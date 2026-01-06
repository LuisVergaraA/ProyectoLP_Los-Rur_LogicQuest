<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cycle extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'difficulty',
        'loop_type',
        'test_cases',
        'points',
        'is_active'
    ];

    protected $casts = [
        'test_cases' => 'array',
        'is_active' => 'boolean',
    ];

    public function attempts()
    {
        return $this->hasMany(CycleAttempt::class);
    }
}