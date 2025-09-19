<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use App\Models\Simulacao;
use App\Models\SimulacaoItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SimulacaoController extends Controller
{
    public function index(Request $r)
    {
        return Simulacao::with('itens')
            ->where('usuario_id', $r->user()->id)
            ->orderByDesc('id')
            ->get();
    }

    public function show(Request $r, Simulacao $simulacao)
    {
        abort_unless($simulacao->usuario_id === $r->user()->id, 403);
        return $simulacao->load('itens');
    }

    // POST /simulacao/finalizar
    public function finalizar(Request $r)
    {
        $data = $r->validate([
            'cliente' => ['required','string','max:255'],
            'itens'   => ['required','array','min:1'],
            'itens.*.id'         => ['required','integer','exists:produtos,id'],
            'itens.*.quantidade' => ['required','integer','min:1'],
        ]);

        $uid = $r->user()->id;

        $simulacao = DB::transaction(function () use ($data, $uid) {

            $total = 0.0;
            $snapshotItens = [];

            foreach ($data['itens'] as $raw) {
                $produto = Produto::where('id', $raw['id'])
                    ->where('usuario_id', $uid)
                    ->lockForUpdate()
                    ->firstOrFail();

                $qtd = (int) $raw['quantidade'];
                if ($qtd > $produto->quantidade) {
                    abort(422, "Estoque insuficiente para {$produto->nome_produto} (disp: {$produto->quantidade}).");
                }

                $subtotal = round($produto->preco * $qtd, 2);
                $total = round($total + $subtotal, 2);

                $snapshotItens[] = [
                    'produto_id'   => $produto->id,
                    'nome_produto' => $produto->nome_produto,
                    'quantidade'   => $qtd,
                    'preco'        => $produto->preco,
                    'subtotal'     => $subtotal,
                ];

                // baixa de estoque
                $produto->decrement('quantidade', $qtd);
            }

            $sim = Simulacao::create([
                'usuario_id' => $uid,
                'cliente'    => $data['cliente'],
                'total'      => $total,
                'status'     => 'finalizada',
            ]);

            foreach ($snapshotItens as $i) {
                $i['simulacao_id'] = $sim->id;
                SimulacaoItem::create($i);
            }

            return $sim->load('itens');
        });

        return response()->json($simulacao, 201);
    }

    public function destroy(Request $r, Simulacao $simulacao)
    {
        abort_unless($simulacao->usuario_id === $r->user()->id, 403);

        // (Opcional) devolver estoque ao excluir
        DB::transaction(function () use ($simulacao) {
            foreach ($simulacao->itens as $item) {
                Produto::where('id', $item->produto_id)->increment('quantidade', $item->quantidade);
            }
            $simulacao->itens()->delete();
            $simulacao->delete();
        });
        return response()->noContent();
    }
}
