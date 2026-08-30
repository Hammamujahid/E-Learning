<?php

namespace App\Models;

use App\Models\Concerns\HasDeletedFlag;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CheckingAnswer extends Model
{
    use HasDeletedFlag, HasFactory;

    protected $table = 'checking_answers';

    protected $fillable = [
        'quiz_attempt_id',
        'question_id',
        'answer_id',
        'is_correct',
        'is_deleted',
    ];

    protected function casts(): array
    {
        return [
            'is_correct' => 'boolean',
            'is_deleted' => 'boolean',
        ];
    }

    public function quizAttempt(): BelongsTo
    {
        return $this->belongsTo(QuizAttempt::class);
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    public function answer(): BelongsTo
    {
        return $this->belongsTo(Answer::class);
    }
}
