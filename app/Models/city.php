<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class city extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'is_deleted'
    ];

    public function profiles(): HasMany
    {
        return $this->hasMany(Profile::class);
    }
}
