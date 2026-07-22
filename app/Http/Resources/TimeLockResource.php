<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TimeLockResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'userId' => $this->user_id,
            'title' => $this->title,
            'startTime' => $this->start_time,
            'endTime' => $this->end_time,
            'date' => $this->date?->format('Y-m-d'),
            'recurrence' => $this->recurrence->value,
            'recurrenceEndDate' => $this->recurrence_end_date?->format('Y-m-d'),
            'dayOfWeek' => $this->day_of_week,
        ];
    }
}
