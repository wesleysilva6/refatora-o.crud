<?php

namespace App\Http\Controllers;

use App\Models\Venda;
use App\Models\ItemVenda;
use App\Models\Produto;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;
class VendaController extends Controller
{
    public function index(Request $r)
    {
        $perPage = max(1, (int) $r->integer('per_page', 10));
        $q       = trim((string) $r->get('q', ''));
        $from    = $r->get('from');
        $to      = $r->get('to');  

        $query = Venda::query()
            ->with(['funcionario:id,nome'])
            ->where('usuario_id', $r->user()->id)
            ->orderByDesc('realizada_em');

        if ($from) {
            try { $query->where('realizada_em', '>=', Carbon::parse($from)->startOfDay()); } catch (\Throwable $e) {}
        }
        if ($to) {
            try { $query->where('realizada_em', '<=', Carbon::parse($to)->endOfDay()); } catch (\Throwable $e) {}
        }
        if ($q !== '') {
            $query->where(function ($sub) use ($q) {
                $sub->where('cliente', 'like', "%{$q}%")
                    ->orWhere('telefone', 'like', "%{$q}%");
            });
        }

        return $query->paginate($perPage);
    }

    public function store(Request $request)
    {
        $uid = $request->user()->id;

        $data = $request->validate([
            'cliente'        => ['required','string','max:255'],
            'telefone'       => ['nullable','string','max:50'],

            'funcionario_id' => [
                'required','integer',
                Rule::exists('funcionarios','id')->where('usuario_id', $uid),
            ],

            'itens'                      => ['required','array','min:1'],
            'itens.*.produto_id'        => [
                'required','integer',
                Rule::exists('produtos','id')->where('usuario_id', $uid),
            ],
            'itens.*.quantidade'        => ['required','integer','min:1'],
            'itens.*.preco_unitario'    => ['required','numeric','min:0'],
        ]);

        return DB::transaction(function () use ($data, $uid) {
            $venda = Venda::create([
                'usuario_id'     => $uid,                    
                'cliente'        => $data['cliente'],
                'telefone'       => $data['telefone'] ?? null,
                'funcionario_id' => $data['funcionario_id'],
                'realizada_em'   => now(),
                'total'          => 0,
            ]);

            $total = 0;

            foreach ($data['itens'] as $it) {
                /** @var Produto $produto */
                $produto = Produto::where('id', $it['produto_id'])
                    ->where('usuario_id', $uid)
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($produto->quantidade < $it['quantidade']) {
                    abort(422, "Estoque insuficiente para o produto '{$produto->nome_produto}'. Disponível: {$produto->quantidade}.");
                }

                $produto->decrement('quantidade', $it['quantidade']);

                $precoUnit = (float) $it['preco_unitario'];

                $subtotal = $it['quantidade'] * $precoUnit;
                $total   += $subtotal;

                ItemVenda::create([
                    'venda_id'       => $venda->id,
                    'produto_id'     => $produto->id,
                    'quantidade'     => $it['quantidade'],
                    'preco_unitario' => $precoUnit,
                    'subtotal'       => $subtotal,
                ]);
            }

            $venda->update(['total' => $total]);

            return $venda->load(['itens','funcionario']);
        });
    }

    public function show(Request $request, Venda $venda)
    {
        abort_if($venda->usuario_id !== $request->user()->id, 403);
        return $venda->load(['itens','funcionario']);
    }

    public function destroy(Request $request, Venda $venda)
    {
        abort_if($venda->usuario_id !== $request->user()->id, 403);

        return DB::transaction(function () use ($venda) {
            $venda->itens()->delete();
            $venda->delete();
            return response()->json(['deleted' => true]);
        });
    }
}
