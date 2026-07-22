<?php

namespace Tests\Feature;

use App\Enums\EmployeeStatus;
use App\Enums\SystemRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmployeeApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_login()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'system_role' => SystemRole::Employee,
            'status' => EmployeeStatus::Available,
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['token', 'user' => ['id', 'name', 'email', 'systemRole']]);
    }

    public function test_can_get_me()
    {
        $user = User::factory()->create([
            'system_role' => SystemRole::Employee,
            'status' => EmployeeStatus::Available,
        ]);

        $response = $this->actingAs($user)->getJson('/api/auth/me');

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $user->id);
    }

    public function test_can_logout()
    {
        $user = User::factory()->create([
            'system_role' => SystemRole::Employee,
            'status' => EmployeeStatus::Available,
        ]);

        // actingAs skips sanctum token creation for standard tests, but we will hit the logout endpoint.
        $this->actingAs($user, 'sanctum');
        
        $response = $this->postJson('/api/auth/logout');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Logged out successfully']);
    }

    public function test_can_list_employees()
    {
        User::factory()->count(3)->create([
            'system_role' => SystemRole::Employee,
            'status' => EmployeeStatus::Available,
        ]);
        $user = User::factory()->create([
            'system_role' => SystemRole::Admin,
            'status' => EmployeeStatus::Available,
        ]);

        $response = $this->actingAs($user)->getJson('/api/employees');

        $response->assertStatus(200)
            ->assertJsonCount(4, 'data');
    }

    public function test_can_show_employee()
    {
        $user = User::factory()->create([
            'system_role' => SystemRole::Admin,
            'status' => EmployeeStatus::Available,
        ]);
        $employee = User::factory()->create([
            'system_role' => SystemRole::Employee,
            'status' => EmployeeStatus::Available,
        ]);

        $response = $this->actingAs($user)->getJson("/api/employees/{$employee->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $employee->id);
    }

    public function test_can_create_employee()
    {
        $user = User::factory()->create([
            'system_role' => SystemRole::Admin,
            'status' => EmployeeStatus::Available,
        ]);

        $response = $this->actingAs($user)->postJson('/api/employees', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'secret123',
            'system_role' => 'employee',
            'status' => 'Available',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'John Doe');
            
        $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
    }

    public function test_can_update_employee()
    {
        $user = User::factory()->create([
            'system_role' => SystemRole::Admin,
            'status' => EmployeeStatus::Available,
        ]);
        $employee = User::factory()->create([
            'system_role' => SystemRole::Employee,
            'status' => EmployeeStatus::Available,
        ]);

        $response = $this->actingAs($user)->putJson("/api/employees/{$employee->id}", [
            'name' => 'Jane Doe',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'Jane Doe');
            
        $this->assertDatabaseHas('users', ['id' => $employee->id, 'name' => 'Jane Doe']);
    }

    public function test_can_delete_employee()
    {
        $user = User::factory()->create([
            'system_role' => SystemRole::Admin,
            'status' => EmployeeStatus::Available,
        ]);
        $employee = User::factory()->create([
            'system_role' => SystemRole::Employee,
            'status' => EmployeeStatus::Available,
        ]);

        $response = $this->actingAs($user)->deleteJson("/api/employees/{$employee->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('users', ['id' => $employee->id]);
    }

    public function test_can_update_status()
    {
        $user = User::factory()->create([
            'system_role' => SystemRole::Admin,
            'status' => EmployeeStatus::Available,
        ]);
        $employee = User::factory()->create([
            'system_role' => SystemRole::Employee,
            'status' => EmployeeStatus::Available,
        ]);

        $response = $this->actingAs($user)->patchJson("/api/employees/{$employee->id}/status", [
            'status' => 'Busy',
            'status_details' => 'In a meeting',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.status', 'Busy')
            ->assertJsonPath('data.statusDetails', 'In a meeting');
            
        $this->assertDatabaseHas('users', [
            'id' => $employee->id,
            'status' => 'Busy',
            'status_details' => 'In a meeting',
        ]);
    }
}
