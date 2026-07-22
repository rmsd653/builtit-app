<?php

namespace App\Console\Commands;

use App\Enums\ActivityLogType;
use App\Enums\EmployeeStatus;
use App\Models\ActivityLog;
use App\Models\OfficeSetting;
use App\Models\User;
use Illuminate\Console\Command;

class AutoCheckoutEmployees extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'employees:auto-checkout';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Auto checkout employees if their meetings ended';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $setting = OfficeSetting::current();
        
        if (!$setting->auto_checkout) {
            return;
        }

        $employees = User::where('status', EmployeeStatus::InMeeting)
            ->whereHas('hostedAppointments', function ($query) {
                $query->whereDate('date', now()->toDateString())
                    ->where('end_time', '<', now()->format('H:i:s'));
            })
            ->whereDoesntHave('hostedAppointments', function ($query) {
                $query->whereDate('date', now()->toDateString())
                    ->where('start_time', '<=', now()->format('H:i:s'))
                    ->where('end_time', '>=', now()->format('H:i:s'));
            })
            ->get();

        foreach ($employees as $employee) {
            $employee->update(['status' => EmployeeStatus::Available]);
            
            ActivityLog::create([
                'type' => ActivityLogType::Checkout,
                'user_id' => $employee->id,
                'user_name' => $employee->name,
                'message' => "Auto checkout after meeting.",
            ]);
        }
    }
}
