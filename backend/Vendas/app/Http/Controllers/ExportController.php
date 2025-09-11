<?php

namespace App\Http\Controllers;

use App\Exports\ProdutosDoTopicoExport;
use App\Exports\ProdutosDoUsuarioExport;
use App\Models\Topico;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    /**
     * Exporta todos os produtos do usuário autenticado.
     * GET /api/exports/produtos
     */
    public function allProdutosDoUsuario(Request $request): StreamedResponse
    {
        return (new ProdutosDoUsuarioExport())->download();
    }

    /**
     * Exporta os produtos de um tópico específico (do próprio usuário).
     * GET /api/exports/topicos/{topico}
     */
    public function produtosDoTopico(Request $request, Topico $topico): StreamedResponse
    {
        // garante que o tópico pertence ao usuário autenticado
        abort_unless($topico->usuario_id === $request->user()->id, 403);

        // usa a PK real do seu model (id_topico)
        $topicoId = $topico->getKey();

        return (new ProdutosDoTopicoExport($topicoId))->download();
    }
}
