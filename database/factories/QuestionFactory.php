<?php

namespace Database\Factories;

use App\Models\LearningMaterial;
use App\Models\Question;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Question>
 */
class QuestionFactory extends Factory
{
    protected $model = Question::class;

    public function definition(): array
    {
        return [
            'learning_material_id' => LearningMaterial::factory(),
            'question_text' => fake()->sentence().'?',
            'created_by' => User::factory()->teacher(),
            'media_path' => null,
            'public_id' => null,
            'is_deleted' => false,
        ];
    }

    /**
     * Attach four answers, exactly one of which is correct.
     */
    public function withAnswers(int $correctIndex = 0): static
    {
        return $this->afterCreating(function (Question $question) use ($correctIndex) {
            foreach (range(0, 3) as $index) {
                $question->answers()->create([
                    'answer_text' => fake()->words(3, true),
                    'is_correct' => $index === $correctIndex,
                    'is_deleted' => false,
                ]);
            }
        });
    }
}
