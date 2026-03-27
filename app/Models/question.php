<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use PHPUnit\Framework\Attributes\Before;

class question extends Model
{
    use HasFactory;

    protected $fillable = [
        'learning_material_id',
        'media_path',
        'question_text',
        'is_deleted'
    ];

    public function learningMaterial(): BelongsTo
    {
        return $this->belongsTo(LearningMaterial::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class);
    }

    public function checkingAnswers(): HasMany
    {
        return $this->hasMany(checking_answer::class);
    }
}
