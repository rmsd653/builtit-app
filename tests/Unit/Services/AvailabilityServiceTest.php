<?php

namespace Tests\Unit\Services;

use App\Enums\AppointmentStatus;
use App\Enums\TimeLockRecurrence;
use App\Models\Appointment;
use App\Models\OfficeSetting;
use App\Models\TimeLock;
use App\Models\User;
use App\Services\AvailabilityService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AvailabilityServiceTest extends TestCase
{
    use RefreshDatabase;

    private AvailabilityService $service;
    private User $employee;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->service = app(AvailabilityService::class);
        $this->employee = User::factory()->create();

        OfficeSetting::current()->update([
            'working_hours_start' => '08:00:00',
            'working_hours_end' => '18:00:00',
        ]);
    }

    public function test_available_slot_within_work_hours_returns_true(): void
    {
        $date = Carbon::tomorrow();
        
        $this->assertTrue($this->service->isSlotAvailable($this->employee, $date, '09:00', '10:00'));
        $this->assertEmpty($this->service->getConflicts($this->employee, $date, '09:00', '10:00'));
    }

    public function test_slot_outside_work_hours_returns_false(): void
    {
        $date = Carbon::tomorrow();
        
        // Before work hours
        $this->assertFalse($this->service->isSlotAvailable($this->employee, $date, '07:00', '08:00'));
        $conflicts = $this->service->getConflicts($this->employee, $date, '07:00', '08:00');
        $this->assertEquals('work_hours', $conflicts[0]['type']);

        // After work hours
        $this->assertFalse($this->service->isSlotAvailable($this->employee, $date, '18:00', '19:00'));
        
        // Overlapping boundary
        $this->assertFalse($this->service->isSlotAvailable($this->employee, $date, '17:30', '18:30'));
    }

    public function test_overlapping_appointment_blocks_slot(): void
    {
        $date = Carbon::tomorrow();
        
        Appointment::factory()->create([
            'host_id' => $this->employee->id,
            'date' => $date,
            'start_time' => '10:00',
            'end_time' => '11:00',
            'status' => AppointmentStatus::Scheduled,
        ]);

        // Exact match
        $this->assertFalse($this->service->isSlotAvailable($this->employee, $date, '10:00', '11:00'));
        
        // Partial overlap
        $this->assertFalse($this->service->isSlotAvailable($this->employee, $date, '09:30', '10:30'));
        $this->assertFalse($this->service->isSlotAvailable($this->employee, $date, '10:30', '11:30'));
        
        // Internal overlap
        $this->assertFalse($this->service->isSlotAvailable($this->employee, $date, '10:15', '10:45'));

        // External overlap
        $this->assertFalse($this->service->isSlotAvailable($this->employee, $date, '09:00', '12:00'));

        $conflicts = $this->service->getConflicts($this->employee, $date, '10:00', '11:00');
        $this->assertEquals('appointment', $conflicts[0]['type']);
    }

    public function test_cancelled_or_completed_appointment_does_not_block_slot(): void
    {
        $date = Carbon::tomorrow();
        
        Appointment::factory()->create([
            'host_id' => $this->employee->id,
            'date' => $date,
            'start_time' => '10:00',
            'end_time' => '11:00',
            'status' => AppointmentStatus::Cancelled,
        ]);

        Appointment::factory()->create([
            'host_id' => $this->employee->id,
            'date' => $date,
            'start_time' => '12:00',
            'end_time' => '13:00',
            'status' => AppointmentStatus::Completed,
        ]);

        $this->assertTrue($this->service->isSlotAvailable($this->employee, $date, '10:00', '11:00'));
        $this->assertTrue($this->service->isSlotAvailable($this->employee, $date, '12:00', '13:00'));
    }

    public function test_ignore_appointment_id(): void
    {
        $date = Carbon::tomorrow();
        
        $appointment = Appointment::factory()->create([
            'host_id' => $this->employee->id,
            'date' => $date,
            'start_time' => '10:00',
            'end_time' => '11:00',
            'status' => AppointmentStatus::Scheduled,
        ]);

        $this->assertTrue($this->service->isSlotAvailable($this->employee, $date, '10:00', '11:00', $appointment->id));
        $this->assertEmpty($this->service->getConflicts($this->employee, $date, '10:00', '11:00', $appointment->id));
    }

    public function test_one_time_time_lock_blocks_slot(): void
    {
        $date = Carbon::tomorrow();
        
        TimeLock::factory()->create([
            'user_id' => $this->employee->id,
            'date' => $date,
            'start_time' => '13:00',
            'end_time' => '14:00',
            'recurrence' => TimeLockRecurrence::None,
        ]);

        $this->assertFalse($this->service->isSlotAvailable($this->employee, $date, '13:30', '14:30'));
        $conflicts = $this->service->getConflicts($this->employee, $date, '13:30', '14:30');
        $this->assertEquals('time_lock', $conflicts[0]['type']);
    }

    public function test_recurring_daily_lock_blocks_slot(): void
    {
        $date = Carbon::tomorrow();
        
        TimeLock::factory()->create([
            'user_id' => $this->employee->id,
            'date' => Carbon::today(), // Starts today
            'start_time' => '14:00',
            'end_time' => '15:00',
            'recurrence' => TimeLockRecurrence::Daily,
            'recurrence_end_date' => null,
        ]);

        $this->assertFalse($this->service->isSlotAvailable($this->employee, $date, '14:00', '15:00'));
    }

    public function test_recurring_weekly_lock_blocks_slot_on_matching_day(): void
    {
        $date = Carbon::tomorrow();
        
        TimeLock::factory()->create([
            'user_id' => $this->employee->id,
            'date' => Carbon::today(),
            'start_time' => '15:00',
            'end_time' => '16:00',
            'recurrence' => TimeLockRecurrence::Weekly,
            'day_of_week' => $date->dayOfWeek,
            'recurrence_end_date' => null,
        ]);

        // Same day of week should block
        $this->assertFalse($this->service->isSlotAvailable($this->employee, $date, '15:00', '16:00'));
        
        // Next day (different day of week) should be available
        $this->assertTrue($this->service->isSlotAvailable($this->employee, $date->copy()->addDay(), '15:00', '16:00'));
    }

    public function test_expired_recurring_lock_does_not_block_slot(): void
    {
        $date = Carbon::tomorrow();
        
        TimeLock::factory()->create([
            'user_id' => $this->employee->id,
            'date' => Carbon::yesterday()->subWeek(),
            'start_time' => '09:00',
            'end_time' => '10:00',
            'recurrence' => TimeLockRecurrence::Daily,
            'recurrence_end_date' => Carbon::yesterday(),
        ]);

        $this->assertTrue($this->service->isSlotAvailable($this->employee, $date, '09:00', '10:00'));
    }
}
