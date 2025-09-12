<?php

namespace App\Http\Controllers;

use App\Models\Topico;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

class TopicoController extends Controller
{
public function index(Request $r)
{
    // era: orderBy('id','desc')
    return Topico::where('usuario_id', $r->user()->id)
        ->orderBy('id_topico', 'desc')
        ->get();
}

public function indexWithProdutos(Request $r)
{
    $topicos = Topico::with('produtos')
        ->where('usuario_id', $r->user()->id)
        ->orderBy('id_topico', 'desc')
        // >>> Importante: inclua a coluna real 'id_topico'
        ->get(['id_topico', 'nome_topico']);

    return response()->json($topicos);
}

public function store(Request $r)
{
    $data = $r->validate([
        'nome_topico' => ['required','string','max:255'],
    ]);

    $topico = Topico::create([
        'nome_topico' => $data['nome_topico'],
        'usuario_id'  => $r->user()->id,
    ]);

    return response()->json($topico, 201);
}

    public function show(Topico $topico)
    {
        return $topico->load('usuario','produtos');
    }

    public function update(Request $request, Topico $topico)
    {
        $data = $request->validate([
            'nome_topico' => ['sometimes','string','max:255'],
        ]);

        $topico->update($data);
        return $topico->refresh();
    }

public function destroy(Request $r, Topico $topico) {
    abort_unless($topico->usuario_id === $r->user()->id, 403);
    $topico->produtos()->delete();
    $topico->delete();
    return response()->noContent();
    }
}