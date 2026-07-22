<?php

namespace App\Services;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class MetricsService
{
    public function getEmployeeMetrics(User $employee, Carbon|string $from, Carbon|string $to): array
    {
        $fromDate = $from instanceof Carbon ? $from : Carbon::parse($from);
        $toDate = $to instanceof Carbon ? $to : Carbon::parse($to);

        $appointments = Appointment::query()
            ->where('host_id', $employee->id)
            ->whereBetween('date', [$fromDate->toDateString(), $toDate->toDateString()])
            ->whereIn('status', [
                AppointmentStatus::Scheduled,
                AppointmentStatus::Ongoing,
                AppointmentStatus::Completed
            ])
            ->get();

        $meetingsCount = $appointments->count();

        if ($meetingsCount === 0) {
            return [
                'meetingsCount' => 0,
                'punctuality' => 100.0,
                'avgDuration' => 0.0,
                'agendaCompletion' => 0.0,
            ];
        }

        $totalDuration = 0;
        $totalAgendaCompletion = 0;

        foreach ($appointments as $appointment) {
            $start = Carbon::parse($appointment->start_time);
            $end = Carbon::parse($appointment->end_time);
            $totalDuration += $start->diffInMinutes($end, true);

            $completion = 0;
            if (!empty($appointment->outcome)) {
                $completion = 100;
            } elseif (!empty($appointment->agenda) && isset($appointment->agenda['items'])) {
                $items = $appointment->agenda['items'];
                $totalItems = count($items);
                if ($totalItems > 0) {
                    $doneItems = count(array_filter($items, fn($item) => $item['done'] ?? false));
                    $completion = ($doneItems / $totalItems) * 100;
                }
            }
            $totalAgendaCompletion += $completion;
        }

        return [
            'meetingsCount' => $meetingsCount,
            'punctuality' => 100.0, // Placeholder
            'avgDuration' => round($totalDuration / $meetingsCount, 2),
            'agendaCompletion' => round($totalAgendaCompletion / $meetingsCount, 2),
        ];
    }

    public function getOverviewMetrics(Carbon|string $from, Carbon|string $to): array
    {
        $fromDate = $from instanceof Carbon ? $from : Carbon::parse($from);
        $toDate = $to instanceof Carbon ? $to : Carbon::parse($to);

        $appointments = Appointment::query()
            ->whereBetween('date', [$fromDate->toDateString(), $toDate->toDateString()])
            ->get();

        $totalMeetings = $appointments->whereNotIn('status', [AppointmentStatus::Cancelled])->count();
        $completedMeetings = $appointments->where('status', AppointmentStatus::Completed)->count();
        $noShowCount = $appointments->where('status', AppointmentStatus::NoShow)->count();

        $activeEmployeesCount = User::where('system_role', '!=', 'receptionist')->count(); // Adjust if necessary
        // A placeholder for utilization
        $teamUtilization = $activeEmployeesCount > 0 ? min(round(($totalMeetings / ($activeEmployeesCount * 5)) * 100, 2), 100) : 0;

        return [
            'totalMeetings' => $totalMeetings,
            'completedMeetings' => $completedMeetings,
            'noShowCount' => $noShowCount,
            'teamUtilization' => $teamUtilization,
        ];
    }

    public function getStatusDistribution(Carbon|string $from, Carbon|string $to): array
    {
        $fromDate = $from instanceof Carbon ? $from : Carbon::parse($from);
        $toDate = $to instanceof Carbon ? $to : Carbon::parse($to);

        $distribution = Appointment::query()
            ->whereBetween('date', [$fromDate->toDateString(), $toDate->toDateString()])
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        return $distribution;
    }
}
