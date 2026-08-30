<?php

namespace App\Models;

use App\Models\Concerns\HasDeletedFlag;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Answer extends Model
{
    use HasDeletedFlag, HasFactory;

    protected $table = 'answers';

    protected $fillable = [
        'question_id',
        'answer_text',
        'is_correct',
        'is_deleted',
        'media_path',
        'public_id',
    ];

    protected function casts(): array
    {
        return [
            'is_correct' => 'boolean',
            'is_deleted' => 'boolean',
        ];
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }
}
