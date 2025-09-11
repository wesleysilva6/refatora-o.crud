<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProdutoController;
use App\Http\Controllers\ExportController;
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
    Route::get('/topicos-with-produtos', [TopicoController::class, 'indexWithProdutos']);
    Route::get('/exports/produtos', [ExportController::class, 'allProdutosDoUsuario']);
    Route::get('/exports/topicos/{topico}', [ExportController::class, 'produtosDoTopico']);

    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/password/forgot', [AuthController::class, 'forgot']); // envia e-mail com link
    Route::post('/password/reset',  [AuthController::class, 'reset']);  // altera a senha
    Route::post('/produtos/{produto}/imagem', [ProdutoController::class,'upload']);

    Route::apiResource('topicos', TopicoController::class);
    Route::apiResource('produtos', ProdutoController::class);
    Route::apiResource('topicos',  TopicoController::class);
    Route::apiResource('simulacoes', SimulacaoController::class) ->parameters(['simulacoes' => 'simulacao']); // pt-BR no binding
    Route::apiResource('vendas', VendaController::class);
});
