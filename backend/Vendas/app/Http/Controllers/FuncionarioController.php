<?php

namespace App\Http\Controllers;

use App\Models\Funcionario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FuncionarioController extends Controller
{
    // GET /funcionarios
    public function index(Request $r)
    {
        // se quiser por-usuário, acrescente coluna usuario_id na tabela
        return Funcionario::orderBy('id', 'desc')->get();
    }

    // GET /funcionarios/{funcionario}
    public function show(Funcionario $funcionario)
    {
        return $funcionario;
    }

    // POST /funcionarios
    public function store(Request $r)
    {
        $data = $r->validate([
            'nome'           => ['required','string','max:255'],
            'cargo'          => ['required','in:Vendedor,Estoquista,Gerente'],
            'email'          => ['required','email','max:100','unique:funcionarios,email'],
            'telefone'       => ['nullable','string','max:20','unique:funcionarios,telefone'],
            'salario'        => ['nullable','numeric','min:0'],
            'status'         => ['required','in:ativo,inativo,ferias'],
            'data_admissao'  => ['nullable','date'],
            'data_demissao'  => ['nullable','date'],
            'foto'           => ['nullable','image','mimes:jpg,jpeg,png,webp','max:4096'],
        ]);

        // arquivo
        if ($r->hasFile('foto')) {
            $path = $r->file('foto')->store('avatars-func', 'public');
            $data['foto'] = $path; // guardo o path; no front uso /storage/...
        } else {
            // default opcional
            $data['foto'] = $data['foto'] ?? 'avatars/user.png';
        }

        // valores padrão
        $data['status'] = $data['status'] ?? 'ativo';

        $func = Funcionario::create($data);

        return response()->json($func, 201);
    }

    // PUT /funcionarios/{funcionario}
    public function update(Request $r, Funcionario $funcionario)
    {
        $data = $r->validate([
            'nome'           => ['sometimes','string','max:255'],
            'cargo'          => ['sometimes','in:Vendedor,Estoquista,Gerente'],
            'email'          => ['sometimes','email','max:100','unique:funcionarios,email,'.$funcionario->id],
            'telefone'       => ['nullable','string','max:20', 'unique:funcionarios,telefone,'.$funcionario->id],
            'salario'        => ['nullable','numeric','min:0'],
            'status'         => ['sometimes','in:ativo,inativo,ferias'],
            'data_admissao'  => ['nullable','date'],
            'data_demissao'  => ['nullable','date'],
            'foto'           => ['nullable','image','mimes:jpg,jpeg,png,webp','max:4096'],
        ]);

        if ($r->hasFile('foto')) {
            // apaga antiga se não for a padrão
            if ($funcionario->foto && $funcionario->foto !== 'avatars/user.png') {
                Storage::disk('public')->delete($funcionario->foto);
            }
            $path = $r->file('foto')->store('avatars-func', 'public');
            $data['foto'] = $path;
        }

        $funcionario->update($data);
        return $funcionario->refresh();
    }

    // DELETE /funcionarios/{funcionario}
    public function destroy(Funcionario $funcionario)
    {
        if ($funcionario->foto && $funcionario->foto !== 'avatars/user.png') {
            Storage::disk('public')->delete($funcionario->foto);
        }
        $funcionario->delete();
        return response()->noContent();
    }
}
