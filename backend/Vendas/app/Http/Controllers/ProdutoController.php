<?php
namespace App\Http\Controllers;

use App\Models\Produto;
use App\Models\Topico;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ProdutoController extends Controller
{
    public function index(Request $request)
    {
        $q        = $request->string('q');
        $topicoId = $request->integer('topico_id');

        $query = Produto::query()
            ->with('topico')
            // 🔒 escopo por dono via relação com tópicos
            ->whereHas('topico', fn($qq) => $qq->where('usuario_id', Auth::id()));

        if ($q->isNotEmpty()) {
            $query->where('nome_produto', 'like', "%{$q}%");
        }
        if ($topicoId) {
            $query->where('topico_id', $topicoId);
        }

        return $query->orderByDesc('criado_em')->paginate(15);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nome_produto' => ['required','string','max:255'],
            'quantidade'   => ['required','integer','min:0'],
            'descricao'    => ['nullable','string'],
            // 🔒 só permite topico_id que pertença ao usuário
            'topico_id'    => ['required','integer',
                Rule::exists('topicos','id_topico')
                    ->where(fn($q) => $q->where('usuario_id', Auth::id()))
            ],
            'preco'        => ['required','numeric'],
            'imagem'       => ['nullable','string'],
        ]);

        $data['criado_em'] = now();

        $produto = Produto::create($data);

        return response()->json($produto, 201);
    }

    public function show(Produto $produto)
    {
        $this->authorizeProduto($produto);
        return $produto->load('topico');
    }

    public function update(Request $request, Produto $produto)
    {
        $this->authorizeProduto($produto);

        $data = $request->validate([
            'nome_produto' => ['sometimes','string','max:255'],
            'quantidade'   => ['sometimes','integer','min:0'],
            'descricao'    => ['sometimes','nullable','string'],
            // se trocar de tópico, também precisa ser do dono
            'topico_id'    => ['sometimes','integer',
                Rule::exists('topicos','id_topico')
                    ->where(fn($q) => $q->where('usuario_id', Auth::id()))
            ],
            'preco'        => ['sometimes','numeric'],
            'imagem'       => ['sometimes','nullable','string'],
        ]);

        $data['atualizado_em'] = now();

        $produto->update($data);

        return $produto->refresh()->load('topico');
    }

    public function destroy(Produto $produto)
    {
        $this->authorizeProduto($produto);
        $produto->delete();
        return response()->json(['deleted' => true]);
    }

    private function authorizeProduto(Produto $p): void
    {
        // 🔒 garante que o produto pertence ao usuário via tópico
        if (($p->topico?->usuario_id) !== Auth::id()) {
            abort(403, 'Produto pertence a outro usuário.');
        }
    }
}