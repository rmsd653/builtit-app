<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'host_id' => ['required', 'exists:users,id'],
            'date' => ['required', 'date'],
            'start_time' => ['required', 'string'],
            'end_time' => ['required', 'string'],
            'room' => ['nullable', 'string', 'max:255'],
            'is_private' => ['boolean'],
            'notes' => ['nullable', 'string'],
            'agenda' => ['nullable', 'array'],
            'visitor_id' => ['nullable', 'exists:visitors,id'],
            'visitor' => ['nullable', 'array'],
            'visitor.name' => ['required_with:visitor', 'string'],
            'visitor.phone' => ['nullable', 'string'],
            'visitor.email' => ['nullable', 'email'],
            'visitor.company' => ['nullable', 'string'],
        ];
    }

    public function resolvedData(): array
    {
        return $this->validated();
    }
}
