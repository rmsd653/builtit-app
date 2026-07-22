<?php

namespace App\Services;

use App\Enums\TimeLockRecurrence;
use App\Models\TimeLock;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class TimeLockService
{
    public function createLock(User $user, array $data, ?User $createdBy = null): TimeLock
    {
        $recurrence = $data['recurrence'] ?? TimeLockRecurrence::None;
        
        if (is_string($recurrence)) {
            $recurrence = TimeLockRecurrence::tryFrom($recurrence) ?? TimeLockRecurrence::None;
        }

        if ($recurrence === TimeLockRecurrence::Weekly && !isset($data['day_of_week']) && isset($data['date'])) {
            $data['day_of_week'] = Carbon::parse($data['date'])->dayOfWeek;
        }

        $lock = new TimeLock($data);
        $lock->user_id = $user->id;
        $lock->created_by_id = $createdBy?->id ?? $user->id;
        $lock->recurrence = $recurrence;

        // Ensure time format matches DB
        if (isset($data['start_time'])) {
            $lock->start_time = Carbon::parse($data['start_time'])->format('H:i:s');
        }
        
        if (isset($data['end_time'])) {
            $lock->end_time = Carbon::parse($data['end_time'])->format('H:i:s');
        }

        $lock->save();

        return $lock;
    }

    public function deleteLock(TimeLock $lock): void
    {
        $lock->delete();
    }

    /**
     * @return Collection<int, TimeLock>
     */
    public function getLocksForDate(User $user, Carbon|string $date): Collection
    {
        $dateObj = $date instanceof Carbon ? $date : Carbon::parse($date);
        
        $locks = TimeLock::where('user_id', $user->id)->get();

        return $locks->filter(fn (TimeLock $lock) => $lock->appliesToDate($dateObj))->values();
    }
}
