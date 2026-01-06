<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CycleAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'cycle_id',
        'user_answer',
        'is_correct',
        'execution_time_ms'
    ];

    protected $casts = [
        'user_answer' => 'array',
        'is_correct' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cycle()
    {
        return $this->belongsTo(Cycle::class);
    }
}