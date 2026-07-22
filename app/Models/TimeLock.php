<?php

namespace App\Models;

use App\Enums\TimeLockRecurrence;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int $created_by_id
 * @property string $title
 * @property string $start_time
 * @property string $end_time
 * @property Carbon|null $date
 * @property TimeLockRecurrence $recurrence
 * @property Carbon|null $recurrence_end_date
 * @property int|null $day_of_week
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'user_id', 'created_by_id', 'title', 'start_time', 'end_time', 
    'date', 'recurrence', 'recurrence_end_date', 'day_of_week'
])]
class TimeLock extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'recurrence' => TimeLockRecurrence::class,
            'recurrence_end_date' => 'date',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    public function isRecurring(): bool
    {
        return $this->recurrence !== TimeLockRecurrence::None;
    }

    public function isOneTime(): bool
    {
        return !$this->isRecurring();
    }

    public function appliesToDate(Carbon $date): bool
    {
        if ($this->isOneTime()) {
            return $this->date?->isSameDay($date) ?? false;
        }

        if ($this->recurrence_end_date && $date->isAfter($this->recurrence_end_date)) {
            return false;
        }

        if ($this->date && $date->isBefore($this->date)) {
            return false;
        }

        return match ($this->recurrence) {
            TimeLockRecurrence::Daily => true,
            TimeLockRecurrence::Weekly => $this->day_of_week === $date->dayOfWeek,
            default => false,
        };
    }

    public function overlapsTime(string $startTime, string $endTime): bool
    {
        return $this->start_time < $endTime && $this->end_time > $startTime;
    }
}
