<?php

namespace App\Models;

use App\Models\Concerns\HasDeletedFlag;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    use HasDeletedFlag, HasFactory;

    protected $table = 'questions';

    protected $fillable = [
        'learning_material_id',
        'question_text',
        'created_by',
        'media_path',
        'public_id',
        'is_deleted',
    ];

    protected function casts(): array
    {
        return [
            'is_deleted' => 'boolean',
        ];
    }

    public function learningMaterial(): BelongsTo
    {
        return $this->belongsTo(LearningMaterial::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class, 'question_id', 'id');
    }

    public function checkingAnswers(): HasMany
    {
        return $this->hasMany(CheckingAnswer::class);
    }

    /**
     * The single correct answer for this question, if one is set.
     */
    public function correctAnswer(): ?Answer
    {
        return $this->answers->firstWhere('is_correct', true);
    }
}
