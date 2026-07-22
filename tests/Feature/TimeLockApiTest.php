<?php

namespace Tests\Feature;

use App\Models\TimeLock;
use App\Models\User;
use App\Enums\TimeLockRecurrence;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TimeLockApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_time_locks()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        TimeLock::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->getJson('/api/time-locks');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_can_create_time_lock()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $payload = [
            'title' => 'Meeting',
            'start_time' => '10:00',
            'end_time' => '11:00',
            'date' => today()->format('Y-m-d'),
            'recurrence' => TimeLockRecurrence::None->value,
        ];

        $response = $this->postJson('/api/time-locks', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('data.title', 'Meeting');

        $this->assertDatabaseHas('time_locks', [
            'user_id' => $user->id,
            'title' => 'Meeting',
        ]);
    }

    public function test_can_delete_time_lock()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $timeLock = TimeLock::factory()->create(['user_id' => $user->id]);

        $response = $this->deleteJson("/api/time-locks/{$timeLock->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('time_locks', ['id' => $timeLock->id]);
    }
}
