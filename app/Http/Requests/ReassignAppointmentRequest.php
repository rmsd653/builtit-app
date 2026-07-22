<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReassignAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'new_host_id' => ['required_without:host_id', 'exists:users,id'],
            'host_id' => ['required_without:new_host_id', 'exists:users,id'],
        ];
    }
}
