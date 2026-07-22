<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSettingsRequest;
use App\Models\OfficeSetting;

class SettingsController extends Controller
{
    public function show()
    {
        $settings = OfficeSetting::current();

        return response()->json([
            'workingHoursStart' => $settings->working_hours_start,
            'workingHoursEnd' => $settings->working_hours_end,
            'lockTimeEnabled' => $settings->lock_time_enabled,
            'notifyOnLate' => $settings->notify_on_late,
            'autoCheckout' => $settings->auto_checkout,
            'defaultMeetingDuration' => $settings->default_meeting_duration,
        ]);
    }

    public function update(UpdateSettingsRequest $request)
    {
        $settings = OfficeSetting::current();
        
        $settings->update($request->validated());

        return response()->json([
            'workingHoursStart' => $settings->working_hours_start,
            'workingHoursEnd' => $settings->working_hours_end,
            'lockTimeEnabled' => $settings->lock_time_enabled,
            'notifyOnLate' => $settings->notify_on_late,
            'autoCheckout' => $settings->auto_checkout,
            'defaultMeetingDuration' => $settings->default_meeting_duration,
        ]);
    }
}
