<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityLogResource extends JsonResource
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
            'type' => $this->type->value,
            'user' => $this->user_name,
            'message' => $this->message,
            'timestamp' => $this->created_at->diffForHumans(),
            'timeISO' => $this->created_at->toIso8601String(),
            'time' => $this->created_at->format('g:i A'),
        ];
    }
}
