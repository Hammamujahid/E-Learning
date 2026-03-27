<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Symfony\Component\Console\Question\Question;

class LearningMaterial extends Model
{
    use HasFactory;

    protected $fillable = [
        'subject_id',
        'created_by',
        'name',
        'description',
        'file_path',
        'is_deleted'
    ];

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }

    public function quizAttempts(): HasMany
    {
        return $this->hasMany(quiz_attempt::class);
    }
}
