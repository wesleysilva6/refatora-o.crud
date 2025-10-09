<?php

namespace App\Http\Controllers;

use App\Exports\ProdutosDoTopicoExport;
use App\Exports\ProdutosDoUsuarioExport;
use App\Models\Topico;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    public function allProdutosDoUsuario(Request $request): StreamedResponse
    {
        return (new ProdutosDoUsuarioExport())->download();
    }

    public function produtosDoTopico(Request $request, Topico $topico): StreamedResponse
    {
        abort_unless($topico->usuario_id === $request->user()->id, 403);

        $topicoId = $topico->getKey();

        return (new ProdutosDoTopicoExport($topicoId))->download();
    }
}
