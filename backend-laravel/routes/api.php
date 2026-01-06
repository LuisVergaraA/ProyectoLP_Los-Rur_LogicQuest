<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\CycleController;

Route::prefix('v1')->group(function () {
    // Módulo de Ciclos - Luis Roca
    Route::post('/ciclos', [CycleController::class, 'store']);
    Route::get('/ciclos', [CycleController::class, 'index']);
    Route::get('/ciclos/historial', [CycleController::class, 'history']);
    Route::post('/ciclos/{id}/intentar', [CycleController::class, 'attempt']);
});
