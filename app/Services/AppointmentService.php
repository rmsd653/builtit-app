<?php

namespace App\Services;

use App\Enums\ActivityLogType;
use App\Enums\AppointmentStatus;
use App\Enums\EmployeeStatus;
use App\Models\ActivityLog;
use App\Models\Appointment;
use App\Models\User;
use App\Models\Visitor;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;

class AppointmentService
{
    public function __construct(private readonly AvailabilityService $availabilityService)
    {
    }

    public function create(array $data, ?User $createdBy = null): Appointment
    {
        $hostId = $data['host_id'];
        $host = User::findOrFail($hostId);

        if (!$this->availabilityService->isSlotAvailable($host, $data['date'], $data['start_time'], $data['end_time'])) {
            throw ValidationException::withMessages([
                'availability' => 'Time slot is not available for this employee.',
            ]);
        }

        $visitorId = $data['visitor_id'] ?? null;
        if (!$visitorId && isset($data['visitor'])) {
            $visitor = Visitor::firstOrCreate(
                ['email' => $data['visitor']['email'] ?? null],
                [
                    'name' => $data['visitor']['name'] ?? '',
                    'phone' => $data['visitor']['phone'] ?? null,
                    'company' => $data['visitor']['company'] ?? null,
                ]
            );
            $visitorId = $visitor->id;
        }

        $appointment = Appointment::create([
            'title' => $data['title'],
            'visitor_id' => $visitorId,
            'host_id' => $hostId,
            'created_by_id' => $createdBy?->id,
            'date' => $data['date'],
            'start_time' => $data['start_time'],
            'end_time' => $data['end_time'],
            'room' => $data['room'],
            'is_private' => $data['is_private'] ?? false,
            'notes' => $data['notes'] ?? null,
            'agenda' => $data['agenda'] ?? null,
            'status' => AppointmentStatus::Scheduled,
        ]);

        if ($appointment->host) {
            $appointment->host->notify(new \App\Notifications\AppointmentCreatedNotification($appointment));
        }

        $actorId = $createdBy?->id ?? $hostId;
        $actorName = $createdBy?->name ?? $host->name;

        ActivityLog::create([
            'type' => ActivityLogType::Created,
            'user_id' => $actorId,
            'user_name' => $actorName,
            'message' => "Created appointment '{$appointment->title}'",
        ]);

        return $appointment;
    }

    public function updateStatus(Appointment $appointment, AppointmentStatus|string $status, ?User $updatedBy = null): Appointment
    {
        $newStatus = is_string($status) ? AppointmentStatus::fromUiStatus($status) : $status;
        $currentStatus = $appointment->status;

        $validTransitions = [
            AppointmentStatus::Scheduled->value => [
                AppointmentStatus::Ongoing,
                AppointmentStatus::Completed,
                AppointmentStatus::Cancelled,
                AppointmentStatus::NoShow,
            ],
            AppointmentStatus::Ongoing->value => [
                AppointmentStatus::Completed,
                AppointmentStatus::Cancelled,
            ],
        ];

        $allowed = $validTransitions[$currentStatus->value] ?? [];
        if (!in_array($newStatus, $allowed)) {
            throw new InvalidArgumentException("Invalid status transition from {$currentStatus->value} to {$newStatus->value}");
        }

        $appointment->update(['status' => $newStatus]);
        $host = $appointment->host;

        if ($host) {
            $host->notify(new \App\Notifications\AppointmentStatusChangedNotification($appointment, $currentStatus, $newStatus));
        }

        if ($newStatus === AppointmentStatus::Ongoing) {
            $host->update(['status' => EmployeeStatus::InMeeting]);
            ActivityLog::create([
                'type' => ActivityLogType::Checkin,
                'user_id' => $host->id,
                'user_name' => $host->name,
                'message' => "Checked in visitor for '{$appointment->title}'",
            ]);
        } elseif ($newStatus === AppointmentStatus::Completed) {
            $host->update(['status' => EmployeeStatus::Available]);
            ActivityLog::create([
                'type' => ActivityLogType::Checkout,
                'user_id' => $host->id,
                'user_name' => $host->name,
                'message' => "Checked out visitor for '{$appointment->title}'",
            ]);
        }

        return $appointment;
    }

    public function reassign(Appointment $appointment, User $newHost, ?User $reassignedBy = null): Appointment
    {
        if ($appointment->status !== AppointmentStatus::Scheduled) {
            throw new InvalidArgumentException('Only scheduled appointments can be reassigned.');
        }

        if (!$this->availabilityService->isSlotAvailable($newHost, $appointment->date, $appointment->start_time, $appointment->end_time)) {
            throw ValidationException::withMessages([
                'availability' => 'Time slot is not available for this employee.',
            ]);
        }

        $appointment->update(['host_id' => $newHost->id]);

        $actorId = $reassignedBy?->id ?? $newHost->id;

        $actorName = $reassignedBy?->name ?? $newHost->name;

        ActivityLog::create([
            'type' => ActivityLogType::Created, // Reassignment log
            'user_id' => $actorId,
            'user_name' => $actorName,
            'message' => "Reassigned appointment '{$appointment->title}' to {$newHost->name}",
        ]);

        return $appointment;
    }

    public function updateAgenda(Appointment $appointment, array $agenda): Appointment
    {
        $appointment->update(['agenda' => $agenda]);
        return $appointment;
    }

    public function updateOutcome(Appointment $appointment, array $outcome): Appointment
    {
        $appointment->update(['outcome' => $outcome]);
        return $appointment;
    }

    public function cancel(Appointment $appointment, ?User $cancelledBy = null): Appointment
    {
        return $this->updateStatus($appointment, AppointmentStatus::Cancelled, $cancelledBy);
    }
}
