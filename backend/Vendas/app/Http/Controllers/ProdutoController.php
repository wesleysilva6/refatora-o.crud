<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use App\Models\Topico;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProdutoController extends Controller
{
public function store(Request $r)
{
    // Aceita 'topico_id' ou 'id_topico'
    if (!$r->filled('topico_id') && $r->filled('id_topico')) {
        $r->merge(['topico_id' => $r->input('id_topico')]);
    }

    $data = $r->validate([
        'topico_id'     => ['required','integer','exists:topicos,id_topico'],
        'nome_produto'  => ['required','string','max:255'],
        'preco'         => ['required','numeric'],
        'quantidade'    => ['required','integer'],
        'descricao'     => ['nullable','string'],
        'imagem'        => ['nullable','image','mimes:jpg,jpeg,png','max:2048'],
    ]);

    $path = null;
    if ($r->hasFile('imagem')) {
        $path = $r->file('imagem')->store('produtos', 'public');
    }

    $produto = Produto::create([
        'topico_id'    => $data['topico_id'], // FK na tabela 'produtos'
        'usuario_id'   => $r->user()->id,
        'nome_produto' => $data['nome_produto'],
        'preco'        => $data['preco'],
        'quantidade'   => $data['quantidade'],
        'descricao'    => $data['descricao'] ?? null,
    ]);

    return response()->json($produto, 201);
}

    public function update(Request $r, Produto $produto)
    {
        abort_unless($produto->usuario_id === $r->user()->id, 403);

        $data = $r->validate([
            'nome_produto' => ['sometimes', 'string', 'max:255'],
            'preco'        => ['sometimes', 'numeric'],
            'quantidade'   => ['sometimes', 'integer'],
            'descricao'    => ['nullable', 'string'],
            'imagem'       => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ]);

        if ($r->hasFile('imagem')) {
            if ($produto->imagem) {
                $old = str_replace('/storage/', '', $produto->imagem);
                Storage::disk('public')->delete($old);
            }
            $path = $r->file('imagem')->store('produtos', 'public');
            $data['imagem'] = Storage::url($path);
        }

        $produto->update($data);
        return $produto;
    }

    public function destroy(Request $r, Produto $produto)
    {
        abort_unless($produto->usuario_id === $r->user()->id, 403);

        if ($produto->imagem) {
            $old = str_replace('/storage/', '', $produto->imagem);
            Storage::disk('public')->delete($old);
        }

        $produto->delete();
        return response()->noContent();
    }
}