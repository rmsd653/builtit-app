<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
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
            'name' => $this->name,
            'role' => $this->display_role ?: $this->system_role->value,
            'systemRole' => $this->system_role->value,
            'email' => $this->email,
            'initials' => $this->initials,
            'avatarUrl' => $this->avatar_url,
            'status' => $this->status->value,
            'statusDetails' => $this->status_details,
            'managerId' => $this->manager_id,
            'meetingsCount' => $this->meetings_count ?? 0,
            'punctuality' => $this->punctuality ?? 100,
            'avgDuration' => $this->avg_duration ?? 60,
            'agendaCompletion' => $this->agenda_completion ?? 100,
        ];
    }
}
