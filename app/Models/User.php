<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use App\Enums\EmployeeStatus;
use App\Enums\SystemRole;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property SystemRole $system_role
 * @property string|null $display_role
 * @property int|null $manager_id
 * @property string|null $initials
 * @property string|null $avatar_url
 * @property EmployeeStatus $status
 * @property string|null $status_details
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'password', 'system_role', 'display_role', 'manager_id', 'initials', 'avatar_url', 'status', 'status_details'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'system_role' => SystemRole::class,
            'status' => EmployeeStatus::class,
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function manager(): BelongsTo
    {
        return $this->belongsTo(self::class, 'manager_id');
    }

    /**
     * @return HasMany<User, $this>
     */
    public function directReports(): HasMany
    {
        return $this->hasMany(self::class, 'manager_id');
    }

    /**
     * @return HasMany<Appointment, $this>
     */
    public function hostedAppointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'host_id');
    }

    /**
     * @return HasMany<Appointment, $this>
     */
    public function createdAppointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'created_by_id');
    }

    /**
     * @return HasMany<TimeLock, $this>
     */
    public function timeLocks(): HasMany
    {
        return $this->hasMany(TimeLock::class);
    }

    public function isAdmin(): bool
    {
        return $this->system_role === SystemRole::Admin;
    }

    public function isManager(): bool
    {
        return $this->system_role === SystemRole::Manager;
    }

    public function isEmployee(): bool
    {
        return $this->system_role === SystemRole::Employee;
    }

    public function isReceptionist(): bool
    {
        return $this->system_role === SystemRole::Receptionist;
    }

    public function canManage(User $user): bool
    {
        return $user->manager_id === $this->id;
    }
}
