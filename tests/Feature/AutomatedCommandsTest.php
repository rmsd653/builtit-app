<?php

namespace Tests\Feature;

use App\Enums\ActivityLogType;
use App\Enums\AppointmentStatus;
use App\Enums\EmployeeStatus;
use App\Models\ActivityLog;
use App\Models\Appointment;
use App\Models\OfficeSetting;
use App\Models\User;
use App\Notifications\AppointmentLateNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class AutomatedCommandsTest extends TestCase
{
    use RefreshDatabase;

    public function test_check_late_appointments_creates_log_and_notifies_host()
    {
        Notification::fake();
        
        OfficeSetting::current()->update(['notify_on_late' => true]);

        $host = User::factory()->create();
        
        $appointment = Appointment::factory()->create([
            'host_id' => $host->id,
            'date' => now()->toDateString(),
            'start_time' => now()->subMinutes(15)->format('H:i:s'),
            'status' => AppointmentStatus::Scheduled,
        ]);

        $this->artisan('appointments:check-late')->assertSuccessful();

        $this->assertDatabaseHas('activity_logs', [
            'type' => ActivityLogType::Late->value,
            'message' => "Meeting '{$appointment->title}' is running late to start",
        ]);

        Notification::assertSentTo($host, AppointmentLateNotification::class);
    }

    public function test_auto_checkout_employees_updates_status()
    {
        OfficeSetting::current()->update(['auto_checkout' => true]);

        $employee = User::factory()->create([
            'status' => EmployeeStatus::InMeeting,
        ]);

        Appointment::factory()->create([
            'host_id' => $employee->id,
            'date' => now()->toDateString(),
            'start_time' => now()->subMinutes(60)->format('H:i:s'),
            'end_time' => now()->subMinutes(10)->format('H:i:s'),
            'status' => AppointmentStatus::Completed,
        ]);

        $this->artisan('employees:auto-checkout')->assertSuccessful();

        $this->assertEquals(EmployeeStatus::Available, $employee->fresh()->status);
        
        $this->assertDatabaseHas('activity_logs', [
            'type' => ActivityLogType::Checkout->value,
            'user_id' => $employee->id,
        ]);
    }
}
