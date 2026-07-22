<?php

namespace Tests\Unit\Services;

use App\Enums\ActivityLogType;
use App\Enums\AppointmentStatus;
use App\Enums\EmployeeStatus;
use App\Models\ActivityLog;
use App\Models\Appointment;
use App\Models\User;
use App\Models\Visitor;
use App\Services\AppointmentService;
use App\Services\AvailabilityService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;
use Tests\TestCase;

class AppointmentServiceTest extends TestCase
{
    use RefreshDatabase;

    private AppointmentService $appointmentService;
    private $availabilityServiceMock;

    protected function setUp(): void
    {
        parent::setUp();
        $this->availabilityServiceMock = $this->createMock(AvailabilityService::class);
        $this->app->instance(AvailabilityService::class, $this->availabilityServiceMock);
        $this->appointmentService = $this->app->make(AppointmentService::class);
    }

    public function test_creating_appointment_on_available_slot_succeeds()
    {
        $host = User::factory()->create(['status' => EmployeeStatus::Available]);
        $visitor = Visitor::factory()->create();

        $this->availabilityServiceMock->method('isSlotAvailable')->willReturn(true);

        $data = [
            'title' => 'Test Meeting',
            'visitor_id' => $visitor->id,
            'host_id' => $host->id,
            'date' => Carbon::today()->toDateString(),
            'start_time' => '10:00:00',
            'end_time' => '11:00:00',
            'room' => 'Room A',
            'is_private' => false,
            'notes' => 'Test notes',
            'agenda' => null,
        ];

        $appointment = $this->appointmentService->create($data, $host);

        $this->assertInstanceOf(Appointment::class, $appointment);
        $this->assertEquals(AppointmentStatus::Scheduled, $appointment->status);
        $this->assertEquals('Test Meeting', $appointment->title);

        $this->assertDatabaseHas('activity_logs', [
            'type' => ActivityLogType::Created->value,
            'user_id' => $host->id,
        ]);
    }

    public function test_creating_appointment_on_occupied_slot_throws_exception()
    {
        $host = User::factory()->create();
        $visitor = Visitor::factory()->create();

        $this->availabilityServiceMock->method('isSlotAvailable')->willReturn(false);

        $data = [
            'title' => 'Test Meeting',
            'visitor_id' => $visitor->id,
            'host_id' => $host->id,
            'date' => Carbon::today()->toDateString(),
            'start_time' => '10:00:00',
            'end_time' => '11:00:00',
            'room' => 'Room A',
            'is_private' => false,
            'notes' => 'Test notes',
            'agenda' => null,
        ];

        $this->expectException(ValidationException::class);
        $this->expectExceptionMessage('Time slot is not available for this employee.');

        $this->appointmentService->create($data, $host);
    }

    public function test_status_transition_scheduled_to_ongoing_succeeds_and_updates_host_status()
    {
        $host = User::factory()->create(['status' => EmployeeStatus::Available]);
        $appointment = Appointment::factory()->create([
            'host_id' => $host->id,
            'status' => AppointmentStatus::Scheduled
        ]);

        $updatedAppointment = $this->appointmentService->updateStatus($appointment, AppointmentStatus::Ongoing, $host);

        $this->assertEquals(AppointmentStatus::Ongoing, $updatedAppointment->status);
        $this->assertEquals(EmployeeStatus::InMeeting, $host->fresh()->status);
        
        $this->assertDatabaseHas('activity_logs', [
            'type' => ActivityLogType::Checkin->value,
            'user_id' => $host->id,
        ]);
    }

    public function test_invalid_status_transition_throws_exception()
    {
        $host = User::factory()->create();
        $appointment = Appointment::factory()->create([
            'host_id' => $host->id,
            'status' => AppointmentStatus::Completed
        ]);

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage("Invalid status transition from completed to ongoing");

        $this->appointmentService->updateStatus($appointment, AppointmentStatus::Ongoing, $host);
    }

    public function test_reassigning_updates_host_and_logs_activity()
    {
        $host = User::factory()->create();
        $newHost = User::factory()->create();
        $appointment = Appointment::factory()->create([
            'host_id' => $host->id,
            'status' => AppointmentStatus::Scheduled
        ]);

        $this->availabilityServiceMock->method('isSlotAvailable')->willReturn(true);

        $updatedAppointment = $this->appointmentService->reassign($appointment, $newHost, $host);

        $this->assertEquals($newHost->id, $updatedAppointment->host_id);
    }

    public function test_reassigning_to_busy_host_throws_exception()
    {
        $host = User::factory()->create();
        $newHost = User::factory()->create();
        $appointment = Appointment::factory()->create([
            'host_id' => $host->id,
            'status' => AppointmentStatus::Scheduled
        ]);

        $this->availabilityServiceMock->method('isSlotAvailable')->willReturn(false);

        $this->expectException(ValidationException::class);
        $this->expectExceptionMessage('Time slot is not available for this employee.');

        $this->appointmentService->reassign($appointment, $newHost, $host);
    }
}
