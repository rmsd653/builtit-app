<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\User;
use App\Models\Visitor;
use App\Enums\AppointmentStatus;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends Factory<Appointment>
 */
class AppointmentFactory extends Factory
{
    protected $model = Appointment::class;

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'visitor_id' => Visitor::factory(),
            'host_id' => User::factory(),
            'created_by_id' => null,
            'date' => Carbon::today(),
            'start_time' => '10:00',
            'end_time' => '11:00',
            'room' => fake()->randomElement(['Conference Room A', 'Room 301', 'Room 402', 'Board Room A', 'Meeting Room 3', 'Office 2', 'Room 204', 'Room 102', 'Boardroom A']),
            'status' => AppointmentStatus::Scheduled,
            'is_private' => false,
            'agenda' => null,
            'outcome' => null,
            'notes' => fake()->optional()->sentence(),
        ];
    }

    public function scheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AppointmentStatus::Scheduled,
        ]);
    }

    public function ongoing(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AppointmentStatus::Ongoing,
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AppointmentStatus::Completed,
        ]);
    }

    public function noShow(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AppointmentStatus::NoShow,
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AppointmentStatus::Cancelled,
        ]);
    }

    public function private(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_private' => true,
        ]);
    }

    public function withAgenda(): static
    {
        return $this->state(fn (array $attributes) => [
            'agenda' => ['items' => [['text' => fake()->sentence(), 'done' => fake()->boolean()]]],
        ]);
    }

    public function withOutcome(): static
    {
        return $this->state(fn (array $attributes) => [
            'outcome' => ['items' => [['text' => fake()->sentence(), 'done' => true]]],
        ]);
    }

    public function tomorrow(): static
    {
        return $this->state(fn (array $attributes) => [
            'date' => Carbon::tomorrow(),
        ]);
    }

    public function forDate(Carbon $date): static
    {
        return $this->state(fn (array $attributes) => [
            'date' => $date,
        ]);
    }

    public function forHost(User $host): static
    {
        return $this->state(fn (array $attributes) => [
            'host_id' => $host->id,
        ]);
    }

    public function forVisitor(Visitor $visitor): static
    {
        return $this->state(fn (array $attributes) => [
            'visitor_id' => $visitor->id,
        ]);
    }
}
