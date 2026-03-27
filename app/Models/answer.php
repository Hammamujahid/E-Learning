<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class answer extends Model
{
    use HasFactory;

    protected  $fillable = [
        'question_id',
        'answer_text',
        'is_correct',
        'is_deleted'
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }
}
