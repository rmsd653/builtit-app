<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $phone
 * @property string|null $email
 * @property string|null $company
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'phone', 'email', 'company'])]
class Visitor extends Model
{
    use HasFactory;

    /**
     * @return HasMany<Appointment, $this>
     */
    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    /**
     * @param Builder<Visitor> $query
     * @param string $phone
     */
    public function scopeByPhone(Builder $query, string $phone): void
    {
        $query->where('phone', $phone);
    }

    /**
     * @param Builder<Visitor> $query
     * @param string $name
     */
    public function scopeByName(Builder $query, string $name): void
    {
        $query->where('name', 'LIKE', "%{$name}%");
    }
}
