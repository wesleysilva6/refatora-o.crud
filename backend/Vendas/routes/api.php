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
use App\Http\Controllers\PerfilController;
use App\Http\Controllers\AnalyticsController;
Use App\Http\Controllers\FuncionarioController;

Route::get('/health', fn () => response()->json(['ok' => true]));

// ---------- PÚBLICAS ----------
Route::post('/login',            [AuthController::class, 'login']);
Route::post('/register',         [AuthController::class, 'register']);
Route::post('/password/forgot',  [AuthController::class, 'forgot']); // envia e-mail com link
Route::post('/password/reset',   [AuthController::class, 'reset']);  // altera a senha

// ---------- PROTEGIDAS ----------
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', fn (Request $r) => $r->user());

    Route::get('/dashboard', DashboardController::class);

    // Dados para a Home (GET somente)
    Route::get('/home',                [TopicoController::class, 'indexWithProdutos']);
    Route::get('/topicos-with-produtos',[TopicoController::class, 'indexWithProdutos']); // alias opcional

    // Exportações
    Route::get('/exports/produtos',            [ExportController::class, 'allProdutosDoUsuario']);
    Route::get('/exports/topicos/{topico}',    [ExportController::class, 'produtosDoTopico']);

    // Upload de imagem do produto (opcional)
    Route::post('/produtos/{produto}/imagem',  [ProdutoController::class,'upload']);

    // CRUDs
    Route::apiResource('topicos',    TopicoController::class);
    Route::apiResource('produtos',   ProdutoController::class);
    Route::apiResource('simulacoes', SimulacaoController::class) ->parameters(['simulacoes' => 'simulacao']);
    Route::apiResource('vendas',     VendaController::class);
    Route::apiResource('funcionarios', FuncionarioController::class);

    // Perfil
    Route::get('/perfil/me',        [PerfilController::class, 'me']);
    Route::post('/perfil/nome',     [PerfilController::class, 'updateName']);
    Route::post('/perfil/senha',    [PerfilController::class, 'updatePassword']);
    Route::post('/perfil/foto',     [PerfilController::class, 'uploadPhoto']);
    Route::delete('/perfil/foto',   [PerfilController::class, 'deletePhoto']);

    // Simulação
    Route::post('/simulacao/finalizar', [SimulacaoController::class, 'finalizar']); // <- usado pelo React
    Route::get('/simulacoes',              [SimulacaoController::class, 'index']);
    Route::get('/simulacoes/{simulacao}',  [SimulacaoController::class, 'show']);
    Route::delete('/simulacoes/item/{item}', [SimulacaoController::class, 'destroyItem']);
    Route::delete('/simulacoes', [SimulacaoController::class, 'destroyAll']);

    // Funcionários
    Route::get('/funcionario/vendedor', [FuncionarioController::class, 'filtrarVendedores']);

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/analytics', [AnalyticsController::class, 'index']);
});