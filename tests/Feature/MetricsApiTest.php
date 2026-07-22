<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MetricsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_overview_metrics()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->getJson('/api/metrics/overview');

        $response->assertStatus(200);
    }

    public function test_can_get_employees_metrics()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->getJson('/api/metrics/employees');

        $response->assertStatus(200);
    }

    public function test_can_get_volume_metrics()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->getJson('/api/metrics/volume');

        $response->assertStatus(200);
    }

    public function test_can_get_distribution_metrics()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->getJson('/api/metrics/distribution');

        $response->assertStatus(200);
    }
}
