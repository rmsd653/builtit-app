<?php

namespace App\Http\Requests;

use App\Enums\EmployeeStatus;
use App\Enums\SystemRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'system_role' => ['required', new Enum(SystemRole::class)],
            'display_role' => ['nullable', 'string', 'max:255'],
            'manager_id' => ['nullable', 'integer', 'exists:users,id'],
            'status' => ['nullable', new Enum(EmployeeStatus::class)],
            'status_details' => ['nullable', 'string', 'max:255'],
        ];
    }
}
