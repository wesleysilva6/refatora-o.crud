<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProdutoController;
use App\Http\Controllers\TopicoController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SimulacaoController;
use App\Http\Controllers\VendaController;

Route::get('/health', fn() => response()->json(['ok' => true]));

// login público
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', fn (Request $r) => $r->user());
    Route::get('/dashboard', DashboardController::class);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/produtos/{produto}/imagem', [ProdutoController::class,'upload']);

    Route::apiResource('produtos', ProdutoController::class);
    Route::apiResource('topicos',  TopicoController::class);
    Route::apiResource('simulacoes', SimulacaoController::class) ->parameters(['simulacoes' => 'simulacao']); // pt-BR no binding
    Route::apiResource('vendas', VendaController::class);
});
