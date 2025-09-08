<?php

namespace App\Http\Controllers;

use App\Models\Simulacao;
use App\Models\ItemSimulacao;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SimulacaoController extends Controller
{
    public function index(Request $request)
    {
        return Simulacao::query()
            ->where('usuario_id', Auth::id())
            ->with('itens')
            ->orderByDesc('criada_em')
            ->paginate(15);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'cliente' => ['required','string','max:255'],
            'itens'   => ['required','array','min:1'],
            'itens.*.produto_id'   => ['nullable','integer'], // no dump a FK é opcional
            'itens.*.nome_produto' => ['required','string','max:255'],
            'itens.*.quantidade'   => ['required','integer','min:1'],
            'itens.*.preco'        => ['required','numeric','min:0'],
        ]);

        return DB::transaction(function () use ($data) {
            $sim = Simulacao::create([
                'usuario_id' => Auth::id(),
                'cliente'    => $data['cliente'],
                'criada_em'  => now(),
                'total'      => 0,
            ]);

            $total = 0;
            foreach ($data['itens'] as $item) {
                $subtotal = $item['quantidade'] * $item['preco'];
                $total   += $subtotal;

                ItemSimulacao::create([
                    'id_simulacao' => $sim->id,
                    'produto_id'   => $item['produto_id'] ?? null,
                    'nome_produto' => $item['nome_produto'],
                    'quantidade'   => $item['quantidade'],
                    'preco'        => $item['preco'],
                    'subtotal'     => $subtotal,
                ]);
            }

            $sim->update(['total' => $total]);

            return $sim->load('itens');
        });
    }

    public function show(Simulacao $simulacao)
    {
        $this->authorizeOwner($simulacao);
        return $simulacao->load('itens');
    }

    public function update(Request $request, Simulacao $simulacao)
    {
        $this->authorizeOwner($simulacao);

        $data = $request->validate([
            'cliente' => ['sometimes','string','max:255'],
        ]);

        $simulacao->update($data);

        return $simulacao->refresh()->load('itens');
    }

    public function destroy(Simulacao $simulacao)
    {
        $this->authorizeOwner($simulacao);

        return DB::transaction(function () use ($simulacao) {
            $simulacao->itens()->delete();
            $simulacao->delete();
            return response()->json(['deleted' => true]);
        });
    }

    private function authorizeOwner(Simulacao $s): void
    {
        if ($s->usuario_id !== Auth::id()) {
            abort(403, 'Simulação pertence a outro usuário.');
        }
    }
}
