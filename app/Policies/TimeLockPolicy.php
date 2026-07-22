<?php

namespace App\Policies;

use App\Models\TimeLock;
use App\Models\User;

class TimeLockPolicy
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
    public function view(User $user, TimeLock $timeLock): bool
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
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, TimeLock $timeLock): bool
    {
        return $user->isAdmin() ||
               $user->id === $timeLock->user_id ||
               $user->id === $timeLock->created_by_id ||
               $user->canManage($timeLock->user);
    }
}
