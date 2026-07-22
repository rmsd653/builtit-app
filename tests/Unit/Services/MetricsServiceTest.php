<?php

namespace Tests\Unit\Services;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\User;
use App\Services\MetricsService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MetricsServiceTest extends TestCase
{
    use RefreshDatabase;

    private MetricsService $metricsService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->metricsService = $this->app->make(MetricsService::class);
    }

    public function test_get_employee_metrics()
    {
        $employee = User::factory()->create();
        $date = Carbon::today();

        // 1. Scheduled meeting, 60 mins duration, agenda 50%
        Appointment::factory()->create([
            'host_id' => $employee->id,
            'status' => AppointmentStatus::Scheduled,
            'date' => $date,
            'start_time' => '10:00:00',
            'end_time' => '11:00:00',
            'agenda' => ['items' => [['text' => 'Item 1', 'done' => true], ['text' => 'Item 2', 'done' => false]]],
            'outcome' => null,
        ]);

        // 2. Completed meeting, 30 mins duration, outcome exists
        Appointment::factory()->create([
            'host_id' => $employee->id,
            'status' => AppointmentStatus::Completed,
            'date' => $date,
            'start_time' => '11:00:00',
            'end_time' => '11:30:00',
            'agenda' => null,
            'outcome' => ['summary' => 'Good meeting'],
        ]);

        // 3. Cancelled meeting (should not be counted for avg duration or agenda if we only count active? Wait, specs say "total completed/ongoing/scheduled in range" for count. Let's assume duration/agenda are calculated for valid meetings).
        Appointment::factory()->create([
            'host_id' => $employee->id,
            'status' => AppointmentStatus::Cancelled,
            'date' => $date,
            'start_time' => '12:00:00',
            'end_time' => '12:30:00',
        ]);

        $metrics = $this->metricsService->getEmployeeMetrics($employee, $date->copy()->subDay(), $date->copy()->addDay());

        $this->assertEquals(2, $metrics['meetingsCount']);
        // Average duration: (60 + 30) / 2 = 45 mins
        $this->assertEquals(45, $metrics['avgDuration']);
        // Agenda completion: 1 meeting has 50%, 1 meeting has outcome (100%). Average = 75%
        $this->assertEquals(75.0, $metrics['agendaCompletion']);
    }

    public function test_get_overview_metrics()
    {
        $date = Carbon::today();
        User::factory()->count(2)->create();

        Appointment::factory()->create(['status' => AppointmentStatus::Completed, 'date' => $date]);
        Appointment::factory()->create(['status' => AppointmentStatus::Completed, 'date' => $date]);
        Appointment::factory()->create(['status' => AppointmentStatus::NoShow, 'date' => $date]);
        Appointment::factory()->create(['status' => AppointmentStatus::Scheduled, 'date' => $date]);
        Appointment::factory()->create(['status' => AppointmentStatus::Cancelled, 'date' => $date]);

        $metrics = $this->metricsService->getOverviewMetrics($date->copy()->subDay(), $date->copy()->addDay());

        // Total meetings across all (except cancelled usually, but let's say total includes all or active ones)
        // For 'total', let's return all active + no-show + completed. (Total = 4 if we exclude cancelled).
        $this->assertEquals(2, $metrics['completedMeetings']);
        $this->assertEquals(1, $metrics['noShowCount']);
        $this->assertArrayHasKey('totalMeetings', $metrics);
        $this->assertArrayHasKey('teamUtilization', $metrics);
    }

    public function test_get_status_distribution()
    {
        $date = Carbon::today();

        Appointment::factory()->create(['status' => AppointmentStatus::Scheduled, 'date' => $date]);
        Appointment::factory()->create(['status' => AppointmentStatus::Completed, 'date' => $date]);
        Appointment::factory()->create(['status' => AppointmentStatus::Completed, 'date' => $date]);
        Appointment::factory()->create(['status' => AppointmentStatus::NoShow, 'date' => $date]);

        $distribution = $this->metricsService->getStatusDistribution($date->copy()->subDay(), $date->copy()->addDay());

        $this->assertEquals(1, $distribution[AppointmentStatus::Scheduled->value]);
        $this->assertEquals(2, $distribution[AppointmentStatus::Completed->value]);
        $this->assertEquals(1, $distribution[AppointmentStatus::NoShow->value]);
        $this->assertArrayNotHasKey(AppointmentStatus::Cancelled->value, $distribution);
    }
}
