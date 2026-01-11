<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Cycle;
use App\Models\CycleAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CycleController extends Controller
{
    /**
     * POST /api/v1/ciclos
     * Crear un nuevo reto de ciclos
     * RESPONSABLE: Luis Roca (ESCRITURA)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'difficulty' => 'required|in:facil,medio,dificil',
            'loop_type' => 'required|in:for,while',
            'test_cases' => 'required|array',
            'test_cases.*.input' => 'required',
            'test_cases.*.output' => 'required',
            'points' => 'nullable|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $cycle = Cycle::create([
            'title' => $request->title,
            'description' => $request->description,
            'difficulty' => $request->difficulty,
            'loop_type' => $request->loop_type,
            'test_cases' => $request->test_cases,
            'points' => $request->points ?? 10,
            'is_active' => true
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Reto de ciclos creado exitosamente',
            'data' => $cycle
        ], 201);
    }

    /**
     * GET /api/v1/ciclos
     * Listar todos los ejercicios activos
     */
    public function index()
    {
        $cycles = Cycle::where('is_active', true)
            ->orderBy('difficulty')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $cycles
        ], 200);
    }

    /**
     * GET /api/v1/ciclos/historial
     * Ver el historial de avance del estudiante
     * RESPONSABLE: Luis Roca (LECTURA)
     */
    public function history(Request $request)
    {
        $userId = $request->query('user_id');

        if (!$userId) {
            return response()->json([
                'success' => false,
                'error' => 'Se requiere user_id como parámetro'
            ], 400);
        }

        // Verificar que el usuario existe
        $userExists = \App\Models\User::find($userId);
        if (!$userExists) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado'
            ], 404);
        }

        // Obtener historial completo
        $history = CycleAttempt::with('cycle')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        // Calcular estadísticas
        $totalAttempts = $history->count();
        $passedAttempts = $history->where('is_correct', true)->count();
        $failedAttempts = $totalAttempts - $passedAttempts;
        
        $totalPoints = $history->where('is_correct', true)
            ->sum(function($attempt) {
                return $attempt->cycle->points ?? 0;
            });

        $stats = [
            'total_attempts' => $totalAttempts,
            'passed' => $passedAttempts,
            'failed' => $failedAttempts,
            'success_rate' => $totalAttempts > 0 ? round(($passedAttempts / $totalAttempts) * 100, 2) : 0,
            'total_points' => $totalPoints,
            'average_time_ms' => round($history->avg('execution_time_ms'), 2)
        ];

        // Progreso por tipo de bucle
        $progressByType = [
            'for' => $this->getProgressByLoopType($userId, 'for'),
            'while' => $this->getProgressByLoopType($userId, 'while')
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'statistics' => $stats,
                'progress_by_type' => $progressByType,
                'recent_attempts' => $history->take(10)->values()
            ]
        ], 200);
    }

    /**
     * POST /api/v1/ciclos/{id}/intentar
     * Registrar un intento de resolver un ejercicio
     */
    public function attempt(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'user_answer' => 'required|array',
            'execution_time_ms' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $cycle = Cycle::find($id);
        if (!$cycle) {
            return response()->json([
                'success' => false,
                'message' => 'Ejercicio no encontrado'
            ], 404);
        }

        // Validar respuesta
        $isCorrect = $this->validateTestCases($cycle->test_cases, $request->user_answer);

        $attempt = CycleAttempt::create([
            'user_id' => $request->user_id,
            'cycle_id' => $id,
            'user_answer' => $request->user_answer,
            'is_correct' => $isCorrect,
            'execution_time_ms' => $request->execution_time_ms
        ]);

        return response()->json([
            'success' => true,
            'message' => $isCorrect ? '¡Correcto! Ejercicio completado' : 'Respuesta incorrecta, intenta de nuevo',
            'data' => [
                'is_correct' => $isCorrect,
                'points_earned' => $isCorrect ? $cycle->points : 0,
                'attempt_id' => $attempt->id
            ]
        ], 201);
    }

    /**
     * Validar respuestas del usuario
     */
    private function validateTestCases($testCases, $userAnswer)
    {
        if (!isset($userAnswer['outputs']) || !is_array($userAnswer['outputs'])) {
            return false;
        }

        foreach ($testCases as $index => $testCase) {
            if (!isset($userAnswer['outputs'][$index])) {
                return false;
            }
            
            $expectedOutput = trim($testCase['output']);
            $userOutput = trim($userAnswer['outputs'][$index]);
            
            if ($expectedOutput !== $userOutput) {
                return false;
            }
        }

        return true;
    }

    /**
     * Obtener progreso por tipo de bucle
     */
    private function getProgressByLoopType($userId, $loopType)
    {
        $cycleIds = Cycle::where('loop_type', $loopType)
            ->where('is_active', true)
            ->pluck('id');
        
        $attempts = CycleAttempt::where('user_id', $userId)
            ->whereIn('cycle_id', $cycleIds)
            ->get();

        $totalCycles = $cycleIds->count();
        $completedCycles = CycleAttempt::where('user_id', $userId)
            ->whereIn('cycle_id', $cycleIds)
            ->where('is_correct', true)
            ->distinct('cycle_id')
            ->count('cycle_id');

        return [
            'total_cycles' => $totalCycles,
            'completed_cycles' => $completedCycles,
            'completion_rate' => $totalCycles > 0 ? round(($completedCycles / $totalCycles) * 100, 2) : 0,
            'total_attempts' => $attempts->count(),
            'correct_attempts' => $attempts->where('is_correct', true)->count()
        ];
    }
}
