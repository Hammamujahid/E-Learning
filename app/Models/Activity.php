<?php

namespace App\Models;

use App\Models\Concerns\HasDeletedFlag;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasDeletedFlag, HasFactory;

    protected $table = 'activities';

    protected $fillable = [
        'model_id',
        'type',
        'action',
        'description',
        'is_deleted',
    ];

    protected function casts(): array
    {
        return [
            'is_deleted' => 'boolean',
        ];
    }
}
