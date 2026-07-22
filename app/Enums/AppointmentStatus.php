<?php

namespace App\Enums;

enum AppointmentStatus: string
{
    case Scheduled = 'scheduled';
    case Ongoing = 'ongoing';
    case Completed = 'completed';
    case NoShow = 'no_show';
    case Cancelled = 'cancelled';

    public static function fromUiStatus(string $uiStatus): self
    {
        return match (strtolower($uiStatus)) {
            'booked', 'expected', 'pending', 'scheduled' => self::Scheduled,
            'ongoing', 'in progress', 'starting soon' => self::Ongoing,
            'completed' => self::Completed,
            'no-show', 'no_show' => self::NoShow,
            'cancelled', 'canceled' => self::Cancelled,
            default => self::Scheduled, // fallback
        };
    }

    public function toUiStatus(): string
    {
        return match ($this) {
            self::Scheduled => 'Scheduled',
            self::Ongoing => 'Ongoing',
            self::Completed => 'Completed',
            self::NoShow => 'No-Show',
            self::Cancelled => 'Cancelled',
        };
    }
}
