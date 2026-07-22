<?php

use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\MetricsController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\TimeLockController;
use Illuminate\Support\Facades\Route;

// Public auth endpoints
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected endpoints
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Appointments CRUD + extra actions
    Route::apiResource('appointments', AppointmentController::class);
    Route::patch('/appointments/{appointment}/status', [AppointmentController::class, 'updateStatus']);
    Route::patch('/appointments/{appointment}/reassign', [AppointmentController::class, 'reassign']);
    Route::patch('/appointments/{appointment}/agenda', [AppointmentController::class, 'updateAgenda']);
    Route::patch('/appointments/{appointment}/outcome', [AppointmentController::class, 'updateOutcome']);

    // Employees (Roster / Directory)
    Route::apiResource('employees', EmployeeController::class);
    Route::patch('/employees/{employee}/status', [EmployeeController::class, 'updateStatus']);

    // Time locks
    Route::apiResource('time-locks', TimeLockController::class)->except(['show', 'update']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markRead']);
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllRead']);

    // Office Settings
    Route::get('/settings', [SettingsController::class, 'show']);
    Route::put('/settings', [SettingsController::class, 'update']);
    Route::patch('/settings', [SettingsController::class, 'update']);

    // Activity Logs
    Route::get('/activity-logs', [ActivityLogController::class, 'index']);

    // Metrics & Analytics
    Route::get('/metrics/overview', [MetricsController::class, 'overview']);
    Route::get('/metrics/employees', [MetricsController::class, 'employees']);
    Route::get('/metrics/volume', [MetricsController::class, 'volume']);
    Route::get('/metrics/distribution', [MetricsController::class, 'distribution']);
});
