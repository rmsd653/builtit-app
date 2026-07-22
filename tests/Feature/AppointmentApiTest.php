<?php

namespace Tests\Feature;

use App\Enums\AppointmentStatus;
use App\Enums\SystemRole;
use App\Models\Appointment;
use App\Models\User;
use App\Models\Visitor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AppointmentApiTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create([
            'system_role' => SystemRole::Admin,
        ]);
    }

    public function test_can_create_appointment_on_available_slot()
    {
        $host = User::factory()->create();
        $visitor = Visitor::factory()->create();
        
        $data = [
            'title' => 'Important Meeting',
            'host_id' => $host->id,
            'visitor_id' => $visitor->id,
            'date' => now()->addDay()->format('Y-m-d'),
            'start_time' => '10:00:00',
            'end_time' => '11:00:00',
            'room' => 'Conference Room A',
            'is_private' => false,
        ];

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/appointments', $data);

        $response->assertStatus(201)
            ->assertJsonPath('data.title', 'Important Meeting')
            ->assertJsonPath('data.hostId', $host->id);
    }

    public function test_creating_appointment_when_slot_occupied_returns_422()
    {
        $host = User::factory()->create();
        $visitor = Visitor::factory()->create();
        
        Appointment::factory()->create([
            'host_id' => $host->id,
            'date' => now()->addDay()->format('Y-m-d'),
            'start_time' => '10:00:00',
            'end_time' => '11:00:00',
            'status' => AppointmentStatus::Scheduled,
        ]);

        $data = [
            'title' => 'Conflict Meeting',
            'host_id' => $host->id,
            'visitor_id' => $visitor->id,
            'date' => now()->addDay()->format('Y-m-d'),
            'start_time' => '10:30:00',
            'end_time' => '11:30:00',
        ];

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/appointments', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['availability']);
    }

    public function test_can_update_status_and_returns_resource()
    {
        $appointment = Appointment::factory()->create([
            'status' => AppointmentStatus::Scheduled,
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->patchJson("/api/appointments/{$appointment->id}/status", [
                'status' => 'ongoing'
            ]);

        $response->assertOk()
            ->assertJsonPath('data.status', 'Ongoing');
            
        $this->assertEquals(AppointmentStatus::Ongoing, $appointment->fresh()->status);
    }

    public function test_can_reassign_appointment_to_new_host()
    {
        $appointment = Appointment::factory()->create([
            'status' => AppointmentStatus::Scheduled,
        ]);
        
        $newHost = User::factory()->create();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->patchJson("/api/appointments/{$appointment->id}/reassign", [
                'new_host_id' => $newHost->id
            ]);

        $response->assertOk()
            ->assertJsonPath('data.hostId', $newHost->id);
            
        $this->assertEquals($newHost->id, $appointment->fresh()->host_id);
    }

    public function test_can_update_agenda()
    {
        $appointment = Appointment::factory()->create();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->patchJson("/api/appointments/{$appointment->id}/agenda", [
                'agenda' => [
                    ['topic' => 'Introductions', 'duration' => 10],
                    ['topic' => 'Project Update', 'duration' => 20],
                ]
            ]);

        $response->assertOk()
            ->assertJsonPath('data.agenda.0.topic', 'Introductions');
    }

    public function test_can_update_outcome()
    {
        $appointment = Appointment::factory()->create();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->patchJson("/api/appointments/{$appointment->id}/outcome", [
                'outcome' => [
                    'summary' => 'Good meeting',
                    'next_steps' => ['Review proposal']
                ]
            ]);

        $response->assertOk()
            ->assertJsonPath('data.outcome.summary', 'Good meeting');
    }
}
