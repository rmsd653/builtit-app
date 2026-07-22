<?php

namespace Tests\Unit\Services;

use App\Enums\TimeLockRecurrence;
use App\Models\TimeLock;
use App\Models\User;
use App\Services\TimeLockService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TimeLockServiceTest extends TestCase
{
    use RefreshDatabase;

    private TimeLockService $service;
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->service = app(TimeLockService::class);
        $this->user = User::factory()->create();
    }

    public function test_create_lock_one_time(): void
    {
        $creator = User::factory()->create();
        $date = Carbon::tomorrow();

        $lock = $this->service->createLock($this->user, [
            'title' => 'Doctor Appointment',
            'start_time' => '10:00',
            'end_time' => '11:00',
            'date' => $date->toDateString(),
            'recurrence' => TimeLockRecurrence::None,
        ], $creator);

        $this->assertInstanceOf(TimeLock::class, $lock);
        $this->assertDatabaseHas('time_locks', [
            'id' => $lock->id,
            'user_id' => $this->user->id,
            'created_by_id' => $creator->id,
            'title' => 'Doctor Appointment',
            'start_time' => '10:00:00',
            'end_time' => '11:00:00',
            'date' => $lock->getRawOriginal('date'),
        ]);
    }

    public function test_create_lock_weekly_defaults_day_of_week(): void
    {
        $date = Carbon::parse('2023-10-18'); // Wednesday, dayOfWeek = 3
        
        $lock = $this->service->createLock($this->user, [
            'title' => 'Weekly Sync',
            'start_time' => '09:00',
            'end_time' => '10:00',
            'date' => $date->toDateString(),
            'recurrence' => 'weekly',
        ]);

        $this->assertEquals(TimeLockRecurrence::Weekly, $lock->recurrence);
        $this->assertEquals(3, $lock->day_of_week);
    }

    public function test_delete_lock(): void
    {
        $lock = TimeLock::factory()->create(['user_id' => $this->user->id]);

        $this->service->deleteLock($lock);

        $this->assertDatabaseMissing('time_locks', ['id' => $lock->id]);
    }

    public function test_get_locks_for_date(): void
    {
        $date = Carbon::parse('2023-10-18'); // Wednesday

        // One-time on that date
        $lock1 = TimeLock::factory()->create([
            'user_id' => $this->user->id,
            'date' => $date,
            'recurrence' => TimeLockRecurrence::None,
        ]);

        // One-time on different date (should not be returned)
        TimeLock::factory()->create([
            'user_id' => $this->user->id,
            'date' => $date->copy()->addDay(),
            'recurrence' => TimeLockRecurrence::None,
        ]);

        // Daily lock
        $lock2 = TimeLock::factory()->create([
            'user_id' => $this->user->id,
            'date' => $date->copy()->subDay(),
            'recurrence' => TimeLockRecurrence::Daily,
            'recurrence_end_date' => null,
        ]);

        // Weekly lock on same day of week
        $lock3 = TimeLock::factory()->create([
            'user_id' => $this->user->id,
            'date' => $date->copy()->subWeek(),
            'recurrence' => TimeLockRecurrence::Weekly,
            'day_of_week' => 3, // Wednesday
            'recurrence_end_date' => null,
        ]);

        // Weekly lock on different day of week (should not be returned)
        TimeLock::factory()->create([
            'user_id' => $this->user->id,
            'date' => $date->copy()->subWeek(),
            'recurrence' => TimeLockRecurrence::Weekly,
            'day_of_week' => 4, // Thursday
            'recurrence_end_date' => null,
        ]);

        // Daily lock but expired
        TimeLock::factory()->create([
            'user_id' => $this->user->id,
            'date' => $date->copy()->subMonth(),
            'recurrence' => TimeLockRecurrence::Daily,
            'recurrence_end_date' => $date->copy()->subDay(),
        ]);

        $locks = $this->service->getLocksForDate($this->user, $date);

        $this->assertCount(3, $locks);
        $this->assertContains($lock1->id, $locks->pluck('id'));
        $this->assertContains($lock2->id, $locks->pluck('id'));
        $this->assertContains($lock3->id, $locks->pluck('id'));
    }
}
