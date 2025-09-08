<?php

namespace App\Http\Controllers;

use App\Models\Topico;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

class TopicoController extends Controller
{
    public function index(Request $request)
    {
        return Topico::query()
            ->withCount('produtos')
            ->orderByDesc('criado_em')
            ->paginate(15);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nome_topico' => ['required','string','max:255'],
        ]);

        $data['usuario_id'] = Auth::id();
        $data['criado_em']  = now();

        $topico = Topico::create($data);

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

    public function destroy(Topico $topico)
    {
        if ($topico->produtos()->exists()) {
            return response()->json([
                'message' => 'Não é possível excluir tópico com produtos associados.'
            ], 409);
        }

        $topico->delete();
        return response()->json(['deleted' => true]);
    }
}