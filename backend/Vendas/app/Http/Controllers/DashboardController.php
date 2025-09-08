<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use App\Models\Topico;
use App\Models\Funcionario;
use App\Models\Venda;
use Illuminate\Routing\Controller;

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
}
