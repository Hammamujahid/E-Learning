<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class quiz_attempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'learning_material_id',
        'user_id',
        'score',
        'is_deleted'
    ];

    public function learningMaterial(): BelongsTo
    {
        return $this->belongsTo(LearningMaterial::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function checkingAnswers(): HasMany
    {
        return $this->hasMany(checking_answer::class);
    }
}
