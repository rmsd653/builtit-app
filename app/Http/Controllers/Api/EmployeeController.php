<?php

namespace App\Http\Controllers\Api;

use App\Enums\EmployeeStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Resources\EmployeeResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Enum;

class EmployeeController extends Controller
{
    public function index()
    {
        return EmployeeResource::collection(User::all());
    }

    public function store(StoreEmployeeRequest $request)
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        return new EmployeeResource($user);
    }

    public function show(User $employee)
    {
        return new EmployeeResource($employee);
    }

    public function update(Request $request, User $employee)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $employee->id],
            'display_role' => ['nullable', 'string', 'max:255'],
            'manager_id' => ['nullable', 'integer', 'exists:users,id'],
        ]);

        $employee->update($data);

        return new EmployeeResource($employee);
    }

    public function destroy(User $employee)
    {
        $employee->delete();
        return response()->noContent();
    }

    public function updateStatus(Request $request, User $employee)
    {
        $data = $request->validate([
            'status' => ['required', new Enum(EmployeeStatus::class)],
            'status_details' => ['nullable', 'string', 'max:255'],
        ]);

        $employee->update([
            'status' => $data['status'],
            'status_details' => $data['status_details'],
        ]);

        return new EmployeeResource($employee);
    }
}
