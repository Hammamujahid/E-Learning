<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Activity>
 */
class ActivityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'model_id' => $this->faker->numberBetween(1, 10),
            'type' => $this->faker->randomElement(['user', 'learning_material', 'question']),
            'action' => $this->faker->randomElement(['created', 'updated', 'deleted']),
            'description' => $this->faker->sentence(),
            'is_deleted' => false,
        ];
    }
}
