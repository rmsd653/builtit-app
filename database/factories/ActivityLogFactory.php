<?php

namespace Database\Factories;

use App\Models\ActivityLog;
use App\Models\User;
use App\Enums\ActivityLogType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ActivityLog>
 */
class ActivityLogFactory extends Factory
{
    protected $model = ActivityLog::class;

    public function definition(): array
    {
        return [
            'type' => fake()->randomElement(ActivityLogType::cases()),
            'user_id' => User::factory(),
            'user_name' => fake()->name(),
            'message' => fake()->sentence(),
        ];
    }

    public function checkout(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => ActivityLogType::Checkout,
            'message' => 'checked out.',
        ]);
    }

    public function checkin(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => ActivityLogType::Checkin,
            'message' => 'checked in at reception.',
        ]);
    }

    public function created(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => ActivityLogType::Created,
        ]);
    }

    public function late(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => ActivityLogType::Late,
        ]);
    }

    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
            'user_name' => $user->name,
        ]);
    }
}
