<?php

namespace Database\Factories;

use App\Models\LearningMaterial;
use App\Models\QuizAttempt;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\QuizAttempt>
 */
class QuizAttemptFactory extends Factory
{
    protected $model = QuizAttempt::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory()->student(),
            'learning_material_id' => LearningMaterial::factory(),
            'score' => 0,
            'status' => QuizAttempt::STATUS_IN_PROGRESS,
            'submitted_at' => null,
            'is_deleted' => false,
        ];
    }

    public function submitted(int $score = 100): static
    {
        return $this->state(fn () => [
            'score' => $score,
            'status' => QuizAttempt::STATUS_SUBMITTED,
            'submitted_at' => now(),
        ]);
    }
}
