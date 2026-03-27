<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class checking_answer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_answer',
        'quiz_attempt_id',
        'question_id',
        'is_deleted'
    ];

    public function quizAttempt(): BelongsTo
    {
        return $this->belongsTo(quiz_attempt::class);
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }
}
