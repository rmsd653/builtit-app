<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $working_hours_start
 * @property string $working_hours_end
 * @property bool $lock_time_enabled
 * @property bool $notify_on_late
 * @property bool $auto_checkout
 * @property int $default_meeting_duration
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'working_hours_start', 'working_hours_end', 'lock_time_enabled', 
    'notify_on_late', 'auto_checkout', 'default_meeting_duration'
])]
class OfficeSetting extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'lock_time_enabled' => 'boolean',
            'notify_on_late' => 'boolean',
            'auto_checkout' => 'boolean',
            'default_meeting_duration' => 'integer',
        ];
    }

    public static function current(): self
    {
        return self::firstOrCreate([], [
            'working_hours_start' => '09:00:00',
            'working_hours_end' => '17:00:00',
            'lock_time_enabled' => false,
            'notify_on_late' => false,
            'auto_checkout' => false,
            'default_meeting_duration' => 30,
        ]);
    }
}
