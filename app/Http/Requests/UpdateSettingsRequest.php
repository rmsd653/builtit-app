<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class UpdateSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        $data = [];
        foreach ($this->all() as $key => $value) {
            $data[Str::snake($key)] = $value;
        }
        $this->replace($data);
    }

    public function rules(): array
    {
        return [
            'working_hours_start' => ['nullable', 'string'],
            'working_hours_end' => ['nullable', 'string'],
            'lock_time_enabled' => ['nullable', 'boolean'],
            'notify_on_late' => ['nullable', 'boolean'],
            'auto_checkout' => ['nullable', 'boolean'],
            'default_meeting_duration' => ['nullable', 'integer'],
        ];
    }
}
