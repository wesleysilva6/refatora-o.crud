<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Produto;
use App\Models\Topico;
use App\Models\Funcionario;
use App\Models\Venda;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $uid = $request->user()->id;

        return [
            'produtos'     => Produto::where('usuario_id', $uid)->count(),
            'topicos'      => Topico::where('usuario_id', $uid)->count(),
            'funcionarios' => Funcionario::where('usuario_id', $uid)->count(),
            'vendas'       => Venda::where('usuario_id', $uid)->count(),
        ];
    }

    public function metrics(Request $request)
    {
        $uid = $request->user()->id;

        $iniHoje   = now()->startOfDay();
        $fimHoje   = now()->endOfDay();
        $iniOntem  = now()->subDay()->startOfDay();
        $fimOntem  = now()->subDay()->endOfDay();

        $vendasHoje = Venda::where('usuario_id', $uid)
            ->whereBetween('realizada_em', [$iniHoje, $fimHoje])
            ->sum('total');

        $vendasOntem = Venda::where('usuario_id', $uid)
            ->whereBetween('realizada_em', [$iniOntem, $fimOntem])
            ->sum('total');

        $varHoje = $vendasOntem > 0
            ? round((($vendasHoje - $vendasOntem) / $vendasOntem) * 100, 1)
            : null; // sem base

        $iniMes     = now()->startOfMonth();
        $fimMes     = now()->endOfMonth();
        $iniMesAnt  = now()->subMonth()->startOfMonth();
        $fimMesAnt  = now()->subMonth()->endOfMonth();

        $vendasMes = Venda::where('usuario_id', $uid)
            ->whereBetween('realizada_em', [$iniMes, $fimMes])
            ->sum('total');

        $vendasMesAnterior = Venda::where('usuario_id', $uid)
            ->whereBetween('realizada_em', [$iniMesAnt, $fimMesAnt])
            ->sum('total');

        $varMes = $vendasMesAnterior > 0
            ? round((($vendasMes - $vendasMesAnterior) / $vendasMesAnterior) * 100, 1)
            : null;

        $limite = 10;
        $estoqueBaixo = Produto::where('usuario_id', $uid)
            ->where('quantidade', '<', $limite)
            ->count();

        return response()->json([
            'hoje' => [
                'total' => (float) $vendasHoje,
                'diff_pct_vs_ontem' => $varHoje,
            ],
            'mes' => [
                'total' => (float) $vendasMes,
                'diff_pct_vs_mes_anterior' => $varMes,
            ],
            'estoque_baixo' => [
                'qtd' => (int) $estoqueBaixo,
                'limite' => $limite,
            ],
        ]);
    }
}
