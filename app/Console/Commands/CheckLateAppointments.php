<?php

namespace App\Console\Commands;

use App\Enums\ActivityLogType;
use App\Enums\AppointmentStatus;
use App\Models\ActivityLog;
use App\Models\Appointment;
use App\Models\OfficeSetting;
use App\Notifications\AppointmentLateNotification;
use Illuminate\Console\Command;

class CheckLateAppointments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'appointments:check-late';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for late appointments and notify hosts';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $setting = OfficeSetting::current();
        
        $lateAppointments = Appointment::with('host')
            ->whereDate('date', now()->toDateString())
            ->where('status', AppointmentStatus::Scheduled)
            ->where('start_time', '<', now()->subMinutes(10)->format('H:i:s'))
            ->get();

        foreach ($lateAppointments as $appointment) {
            ActivityLog::create([
                'type' => ActivityLogType::Late,
                'user_name' => 'System',
                'message' => "Meeting '{$appointment->title}' is running late to start",
            ]);

            if ($setting->notify_on_late && $appointment->host) {
                $appointment->host->notify(new AppointmentLateNotification($appointment));
            }
        }
    }
}
