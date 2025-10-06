<?php

namespace App\Http\Controllers;

use App\Models\Venda;
use App\Models\ItemVenda;
use App\Models\Produto;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;

class VendaController extends Controller
{
    public function index(Request $request)
    {
        return Venda::query()
            ->with(['funcionario'])
            ->orderByDesc('realizada_em')
            ->paginate(15);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'cliente'        => ['required','string','max:255'],
            'telefone'       => ['nullable','string','max:50'],
            'funcionario_id' => ['required','integer','exists:funcionarios,id'],
            'itens'          => ['required','array','min:1'],
            'itens.*.produto_id'     => ['required','integer','exists:produtos,id'],
            'itens.*.quantidade'     => ['required','integer','min:1'],
            'itens.*.preco_unitario' => ['required','numeric','min:0'],
        ]);

        return DB::transaction(function () use ($data) {
            $venda = Venda::create([
                'cliente'        => $data['cliente'],
                'telefone'       => $data['telefone'] ?? null,
                'funcionario_id' => $data['funcionario_id'],
                'realizada_em'   => now(),
                'total'          => 0,
            ]);

            $total = 0;
            foreach ($data['itens'] as $it) {
                $produto = Produto::findOrFail($it['produto_id']);
                if ($produto->quantidade < $it['quantidade']) {
                    // Aborta a transação se não houver estoque suficiente
                    
                    abort(422, "Estoque insuficiente para o produto '{$produto->nome_produto}'. Disponível: {$produto->quantidade}.");
                }

                $produto->decrement('quantidade', $it['quantidade']);

                $subtotal = $it['quantidade'] * $it['preco_unitario'];
                $total   += $subtotal;

                ItemVenda::create([
                    'venda_id'       => $venda->id,
                    'produto_id'     => $it['produto_id'],
                    'quantidade'     => $it['quantidade'],
                    'preco_unitario' => $it['preco_unitario'],
                    'subtotal'       => $subtotal,
                ]);
            }

            $venda->update(['total' => $total]);

            return $venda->load(['itens','funcionario']);
        });
    }

    public function show(Venda $venda)
    {
        return $venda->load(['itens','funcionario']);
    }

    public function destroy(Venda $venda)
    {
        return DB::transaction(function () use ($venda) {
            $venda->itens()->delete();
            $venda->delete();
            return response()->json(['deleted' => true]);
        });
    }
}