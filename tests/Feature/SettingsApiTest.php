<?php

namespace Tests\Feature;

use App\Enums\EmployeeStatus;
use App\Enums\SystemRole;
use App\Models\OfficeSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SettingsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_settings()
    {
        $user = User::factory()->create([
            'system_role' => SystemRole::Admin,
            'status' => EmployeeStatus::Available,
        ]);

        OfficeSetting::current();

        $response = $this->actingAs($user)->getJson('/api/settings');

        $response->assertStatus(200)
            ->assertJsonPath('workingHoursStart', '09:00:00');
    }

    public function test_can_update_settings()
    {
        $user = User::factory()->create([
            'system_role' => SystemRole::Admin,
            'status' => EmployeeStatus::Available,
        ]);

        OfficeSetting::current();

        $response = $this->actingAs($user)->putJson('/api/settings', [
            'workingHoursStart' => '10:00:00',
            'lockTimeEnabled' => true,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('workingHoursStart', '10:00:00')
            ->assertJsonPath('lockTimeEnabled', true);

        $this->assertDatabaseHas('office_settings', [
            'working_hours_start' => '10:00:00',
            'lock_time_enabled' => true,
        ]);
    }
}
