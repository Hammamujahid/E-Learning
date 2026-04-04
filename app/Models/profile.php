<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'city_id',
        'fullname',
        'birth_date',
        'phone_number',
        'gender',
        'is_deleted'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(city::class);
    }
}
