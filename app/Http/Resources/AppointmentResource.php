<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $request->user();
        
        $canViewPrivateDetails = ! $this->is_private 
            || ($user && (
                $user->id === $this->host_id 
                || $user->id === $this->created_by_id 
                || in_array($user->system_role?->value, ['admin', 'manager', 'receptionist'])
            ));

        return [
            'id' => $this->id,
            'title' => $canViewPrivateDetails ? $this->title : 'Busy / Private Meeting',
            'visitor' => $canViewPrivateDetails ? new VisitorResource($this->whenLoaded('visitor')) : null,
            'visitorId' => $canViewPrivateDetails ? $this->visitor_id : null,
            'visitorName' => $canViewPrivateDetails ? ($this->visitor?->name ?? 'Private Visitor') : 'Private Visitor',
            'visitorCompany' => $canViewPrivateDetails ? $this->visitor?->company : null,
            'host' => new EmployeeResource($this->whenLoaded('host')),
            'hostId' => $this->host_id,
            'hostName' => $this->host?->name ?? 'Unknown Host',
            'createdById' => $this->created_by_id,
            'date' => $this->date->format('Y-m-d'),
            'startTime' => $this->start_time,
            'endTime' => $this->end_time,
            'room' => $this->room,
            'status' => $this->status->toUiStatus(),
            'isPrivate' => $this->is_private,
            'agenda' => $canViewPrivateDetails ? $this->agenda : null,
            'outcome' => $canViewPrivateDetails ? $this->outcome : null,
            'notes' => $canViewPrivateDetails ? $this->notes : null,
        ];
    }
}
