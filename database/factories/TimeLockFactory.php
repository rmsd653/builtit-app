<?php

namespace Database\Factories;

use App\Models\TimeLock;
use App\Models\User;
use App\Enums\TimeLockRecurrence;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends Factory<TimeLock>
 */
class TimeLockFactory extends Factory
{
    protected $model = TimeLock::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'created_by_id' => null,
            'title' => fake()->optional()->sentence(3),
            'start_time' => '12:00',
            'end_time' => '13:00',
            'date' => Carbon::today(),
            'recurrence' => TimeLockRecurrence::None,
            'recurrence_end_date' => null,
            'day_of_week' => null,
        ];
    }

    public function oneTime(): static
    {
        return $this->state(fn (array $attributes) => [
            'recurrence' => TimeLockRecurrence::None,
            'date' => Carbon::today(),
        ]);
    }

    public function daily(): static
    {
        return $this->state(fn (array $attributes) => [
            'recurrence' => TimeLockRecurrence::Daily,
            'date' => null,
        ]);
    }

    public function weekly(int $dayOfWeek = 1): static
    {
        return $this->state(fn (array $attributes) => [
            'recurrence' => TimeLockRecurrence::Weekly,
            'date' => null,
            'day_of_week' => $dayOfWeek,
        ]);
    }

    public function withEndDate(Carbon $endDate): static
    {
        return $this->state(fn (array $attributes) => [
            'recurrence_end_date' => $endDate,
        ]);
    }

    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }
}
