<?php

namespace App\Models;

use App\Enums\AppointmentStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $title
 * @property int $visitor_id
 * @property int $host_id
 * @property int $created_by_id
 * @property Carbon $date
 * @property string $start_time
 * @property string $end_time
 * @property string|null $room
 * @property AppointmentStatus $status
 * @property bool $is_private
 * @property array|null $agenda
 * @property array|null $outcome
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'title', 'visitor_id', 'host_id', 'created_by_id', 'date', 
    'start_time', 'end_time', 'room', 'status', 'is_private', 
    'agenda', 'outcome', 'notes'
])]
class Appointment extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'status' => AppointmentStatus::class,
            'is_private' => 'boolean',
            'agenda' => 'array',
            'outcome' => 'array',
        ];
    }

    /**
     * @return BelongsTo<Visitor, $this>
     */
    public function visitor(): BelongsTo
    {
        return $this->belongsTo(Visitor::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function host(): BelongsTo
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    /**
     * @param Builder<Appointment> $query
     */
    public function scopeForDate(Builder $query, Carbon|string $date): void
    {
        $query->whereDate('date', $date instanceof Carbon ? $date->toDateString() : $date);
    }

    /**
     * @param Builder<Appointment> $query
     * @param int|User $hostId
     */
    public function scopeForHost(Builder $query, int|User $hostId): void
    {
        $query->where('host_id', $hostId instanceof User ? $hostId->id : $hostId);
    }

    /**
     * @param Builder<Appointment> $query
     */
    public function scopeActive(Builder $query): void
    {
        $query->whereNotIn('status', [
            AppointmentStatus::Cancelled, 
            AppointmentStatus::NoShow, 
            AppointmentStatus::Completed
        ]);
    }

    /**
     * @param Builder<Appointment> $query
     */
    public function scopeUpcoming(Builder $query): void
    {
        $query->where('date', '>=', Carbon::today())
              ->whereIn('status', [AppointmentStatus::Scheduled]);
    }

    /**
     * @param Builder<Appointment> $query
     */
    public function scopeToday(Builder $query): void
    {
        $query->where('date', Carbon::today()->toDateString());
    }

    public function isEditable(): bool
    {
        return in_array($this->status, [AppointmentStatus::Scheduled, AppointmentStatus::Ongoing]);
    }

    public function canBeReassigned(): bool
    {
        return $this->status === AppointmentStatus::Scheduled;
    }
}
