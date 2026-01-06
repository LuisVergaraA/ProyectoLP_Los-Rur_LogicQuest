<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cycle_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('cycle_id')->constrained()->onDelete('cascade');
            $table->json('user_answer');
            $table->boolean('is_correct');
            $table->integer('execution_time_ms')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'cycle_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cycle_attempts');
    }
};