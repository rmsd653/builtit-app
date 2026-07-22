<?php

namespace App\Policies;

use App\Models\Appointment;
use App\Models\User;

class AppointmentPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Appointment $appointment): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Appointment $appointment): bool
    {
        return $user->isAdmin() ||
               $user->isReceptionist() ||
               $user->id === $appointment->host_id ||
               $user->id === $appointment->created_by_id ||
               $user->canManage($appointment->host);
    }

    /**
     * Determine whether the user can update the status of the model.
     */
    public function updateStatus(User $user, Appointment $appointment): bool
    {
        return $this->update($user, $appointment);
    }

    /**
     * Determine whether the user can update the agenda (assigned employee only).
     */
    public function updateAgenda(User $user, Appointment $appointment): bool
    {
        return $user->isAdmin() || $user->id === $appointment->host_id;
    }

    /**
     * Determine whether the user can update the outcome (assigned employee only).
     */
    public function updateOutcome(User $user, Appointment $appointment): bool
    {
        return $user->isAdmin() || $user->id === $appointment->host_id;
    }

    /**
     * Determine whether the user can reassign the appointment (manager of host or admin).
     */
    public function reassign(User $user, Appointment $appointment): bool
    {
        return $user->isAdmin() || $user->canManage($appointment->host);
    }

    /**
     * Determine whether the user can delete/cancel the model.
     */
    public function delete(User $user, Appointment $appointment): bool
    {
        return $user->isAdmin() ||
               $user->isReceptionist() ||
               $user->id === $appointment->host_id ||
               $user->id === $appointment->created_by_id ||
               $user->canManage($appointment->host);
    }
}
