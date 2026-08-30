<?php

namespace Database\Factories;

use App\Models\LearningMaterial;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LearningMaterial>
 */
class LearningMaterialFactory extends Factory
{
    protected $model = LearningMaterial::class;

    public function definition(): array
    {
        return [
            'subject_id' => Subject::factory(),
            'created_by' => User::factory()->teacher(),
            'name' => fake()->unique()->sentence(3),
            'description' => fake()->sentence(),
            'file_path' => null,
            'public_id' => null,
            'is_deleted' => false,
        ];
    }

    public function deleted(): static
    {
        return $this->state(fn () => ['is_deleted' => true]);
    }
}
