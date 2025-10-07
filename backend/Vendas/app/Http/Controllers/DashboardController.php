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
    public function __invoke()
    {
        return [
            'produtos'     => Produto::count(),
            'topicos'      => Topico::count(),
            'funcionarios' => Funcionario::count(),
            'vendas'       => Venda::count(),
        ];
    }

    public function metrics(Request $request)
    {
        $uid = $request->user()->id;

        // Hoje / Ontem
        $hoje = now()->timezone(config('app.timezone'))->toDateString();      // 'YYYY-MM-DD'
        $ontem = now()->timezone(config('app.timezone'))->subDay()->toDateString();

        $vendasHoje = DB::table('vendas')
            ->where('realizada_em', '>=', $hoje.' 00:00:00')
            ->where('realizada_em', '<=', $hoje.' 23:59:59')
            ->sum('total');

        $vendasOntem = DB::table('vendas')
            ->where('realizada_em', '>=', $ontem.' 00:00:00')
            ->where('realizada_em', '<=', $ontem.' 23:59:59')
            ->sum('total');

        $varHoje = $vendasOntem > 0
            ? round((($vendasHoje - $vendasOntem) / $vendasOntem) * 100, 1)
            : null; // null => sem base de comparação

        // Mês atual / mês anterior
        $iniMes = now()->startOfMonth()->toDateTimeString();
        $fimMes = now()->endOfMonth()->toDateTimeString();
        $iniMesAnt = now()->subMonth()->startOfMonth()->toDateTimeString();
        $fimMesAnt = now()->subMonth()->endOfMonth()->toDateTimeString();

        $vendasMes = DB::table('vendas')
            ->whereBetween('realizada_em', [$iniMes, $fimMes])
            ->sum('total');

        $vendasMesAnterior = DB::table('vendas')
            ->whereBetween('realizada_em', [$iniMesAnt, $fimMesAnt])
            ->sum('total');

        $varMes = $vendasMesAnterior > 0
            ? round((($vendasMes - $vendasMesAnterior) / $vendasMesAnterior) * 100, 1)
            : null;

        // Itens com baixo estoque (ex.: < 10)
        $limite = 10;
        $estoqueBaixo = DB::table('produtos')
            ->where('quantidade', '<', $limite)
            ->count();

        return response()->json([
            'hoje' => [
                'total' => (float) $vendasHoje,
                'diff_pct_vs_ontem' => $varHoje, // pode vir null
            ],
            'mes' => [
                'total' => (float) $vendasMes,
                'diff_pct_vs_mes_anterior' => $varMes, // pode vir null
            ],
            'estoque_baixo' => [
                'qtd' => (int) $estoqueBaixo,
                'limite' => $limite,
            ],
        ]);
    }
}
