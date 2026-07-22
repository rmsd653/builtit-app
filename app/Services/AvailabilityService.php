<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\OfficeSetting;
use App\Models\TimeLock;
use App\Models\User;
use Illuminate\Support\Carbon;

class AvailabilityService
{
    public function isSlotAvailable(
        User $employee,
        Carbon|string $date,

        string $startTime,
        string $endTime,
        ?int $ignoreAppointmentId = null
    ): bool {
        $conflicts = $this->getConflicts($employee, $date, $startTime, $endTime, $ignoreAppointmentId);

        return empty($conflicts);
    }

    public function getConflicts(
        User $employee,
        Carbon|string $date,
        string $startTime,
        string $endTime,
        ?int $ignoreAppointmentId = null
    ): array {
        $conflicts = [];
        $dateObj = $date instanceof Carbon ? $date : Carbon::parse($date);
        
        $parsedStartTime = Carbon::parse($startTime)->format('H:i:s');
        $parsedEndTime = Carbon::parse($endTime)->format('H:i:s');

        // Check working hours
        if (!$this->isWithinWorkingHours($parsedStartTime, $parsedEndTime)) {
            $conflicts[] = [
                'type' => 'work_hours',
                'message' => 'Slot is outside of office working hours.',
            ];
        }

        // Check appointments
        $overlappingAppointments = Appointment::query()
            ->active()
            ->forHost($employee)
            ->forDate($dateObj)
            ->when($ignoreAppointmentId, fn ($query) => $query->where('id', '!=', $ignoreAppointmentId))
            ->where(function ($query) use ($parsedStartTime, $parsedEndTime) {
                $query->where('start_time', '<', $parsedEndTime)
                      ->where('end_time', '>', $parsedStartTime);
            })
            ->get();

        foreach ($overlappingAppointments as $appointment) {
            $conflicts[] = [
                'type' => 'appointment',
                'message' => "Overlaps with appointment: {$appointment->title}",
                'appointment_id' => $appointment->id,
            ];
        }

        // Check time locks
        $timeLocks = TimeLock::where('user_id', $employee->id)->get();

        foreach ($timeLocks as $lock) {
            if ($lock->appliesToDate($dateObj) && $lock->overlapsTime($parsedStartTime, $parsedEndTime)) {
                $conflicts[] = [
                    'type' => 'time_lock',
                    'message' => "Overlaps with time lock: {$lock->title}",
                    'time_lock_id' => $lock->id,
                ];
            }
        }

        return $conflicts;
    }

    private function isWithinWorkingHours(string $startTime, string $endTime): bool
    {
        $setting = OfficeSetting::current();
        
        $workStart = $setting->working_hours_start;
        $workEnd = $setting->working_hours_end;

        return $startTime >= $workStart && $endTime <= $workEnd;
    }
}
