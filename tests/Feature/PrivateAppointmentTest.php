<?php

namespace Tests\Feature;

use App\Enums\SystemRole;
use App\Models\Appointment;
use App\Models\User;
use App\Models\Visitor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PrivateAppointmentTest extends TestCase
{
    use RefreshDatabase;

    public function test_colleague_sees_masked_private_appointment()
    {
        $host = User::factory()->create();
        $creator = User::factory()->create();
        $colleague = User::factory()->create(['system_role' => SystemRole::Employee]);
        $visitor = Visitor::factory()->create(['name' => 'Secret Visitor']);

        $appointment = Appointment::factory()->create([
            'title' => 'Secret Merger Discussion',
            'host_id' => $host->id,
            'created_by_id' => $creator->id,
            'visitor_id' => $visitor->id,
            'is_private' => true,
            'agenda' => ['topic' => 'Acquisition details'],
            'outcome' => ['result' => 'Agreed on terms'],
            'notes' => 'Do not share',
        ]);

        $response = $this->actingAs($colleague, 'sanctum')->getJson("/api/appointments/{$appointment->id}");

        $response->assertOk()
            ->assertJsonPath('data.title', 'Busy / Private Meeting')
            ->assertJsonPath('data.visitor', null)
            ->assertJsonPath('data.agenda', null)
            ->assertJsonPath('data.outcome', null)
            ->assertJsonPath('data.notes', null)
            ->assertJsonPath('data.isPrivate', true);
    }

    public function test_host_sees_full_private_appointment()
    {
        $host = User::factory()->create();
        $visitor = Visitor::factory()->create(['name' => 'Secret Visitor']);

        $appointment = Appointment::factory()->create([
            'title' => 'Secret Merger Discussion',
            'host_id' => $host->id,
            'visitor_id' => $visitor->id,
            'is_private' => true,
            'agenda' => ['topic' => 'Acquisition details'],
            'outcome' => ['result' => 'Agreed on terms'],
            'notes' => 'Do not share',
        ]);

        $response = $this->actingAs($host, 'sanctum')->getJson("/api/appointments/{$appointment->id}");

        $response->assertOk()
            ->assertJsonPath('data.title', 'Secret Merger Discussion')
            ->assertJsonPath('data.visitor.name', 'Secret Visitor')
            ->assertJsonPath('data.agenda.topic', 'Acquisition details')
            ->assertJsonPath('data.outcome.result', 'Agreed on terms')
            ->assertJsonPath('data.notes', 'Do not share');
    }

    public function test_admin_sees_full_private_appointment()
    {
        $admin = User::factory()->create(['system_role' => SystemRole::Admin]);
        $appointment = Appointment::factory()->create([
            'title' => 'Secret Merger Discussion',
            'is_private' => true,
            'agenda' => ['topic' => 'Acquisition details'],
            'outcome' => ['result' => 'Agreed on terms'],
            'notes' => 'Do not share',
        ]);

        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/appointments/{$appointment->id}");

        $response->assertOk()
            ->assertJsonPath('data.title', 'Secret Merger Discussion')
            ->assertJsonPath('data.agenda.topic', 'Acquisition details');
    }
}
