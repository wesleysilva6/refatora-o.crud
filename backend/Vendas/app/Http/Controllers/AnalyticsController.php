<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $usuario_id = $request->user()->id; 

        $dias = [];
        $qtds = [];
        $rows = DB::table('simulacoes')
            ->selectRaw("DATE_FORMAT(criado_em, '%d/%m') as dia, COUNT(*) as qtd")
            ->where('usuario_id', $usuario_id)
            ->groupBy('dia')
            ->orderByRaw("MIN(criado_em)")
            ->get();

        foreach ($rows as $r) {
            $dias[] = $r->dia;
            $qtds[] = (int) $r->qtd;
        }

        $resumo = DB::table('simulacao_itens as it')
            ->join('simulacoes as s', 'it.simulacao_id', '=', 's.id')
            ->where('s.usuario_id', $usuario_id)
            ->selectRaw('COUNT(*) as total, COALESCE(SUM(it.preco * it.quantidade),0) as valor')
            ->first();

        return response()->json([
            'dias'  => $dias,
            'qtds'  => $qtds,
            'total' => (int) ($resumo->total ?? 0),
            'valor' => (float) ($resumo->valor ?? 0),
        ]);
    }
}
