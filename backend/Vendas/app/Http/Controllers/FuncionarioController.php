<?php

namespace App\Http\Controllers;

use App\Models\Funcionario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class FuncionarioController extends Controller
{
    public function filtrarVendedores(Request $r)
    {
        $uid = $r->user()->id;

        return Funcionario::query()
            ->select('id', 'nome', 'cargo')
            ->where('usuario_id', $uid) 
            ->where('cargo', 'Vendedor')
            ->where('status', 'ativo')
            ->orderBy('nome')
            ->get();
    }

    public function index(Request $r)
    {
        $uid    = $r->user()->id;
        $q      = trim((string) $r->get('q', ''));
        $cargo  = $r->get('cargo'); 
        $status = $r->get('status');  

        $query = Funcionario::query()
            ->where('usuario_id', $uid)        
            ->orderByDesc('id');

        if ($q !== '') {
            $query->where(function ($sub) use ($q) {
                $sub->where('nome',  'like', "%{$q}%")
                    ->orWhere('email','like', "%{$q}%");
            });
        }
        if ($cargo)  { $query->where('cargo',  $cargo); }
        if ($status) { $query->where('status', $status); }

        return $query->get();
    }

    public function show(Request $r, Funcionario $funcionario)
    {
        abort_if($funcionario->usuario_id !== $r->user()->id, 403); 
        return $funcionario;
    }

    public function store(Request $r)
    {
        $uid = $r->user()->id;

        $data = $r->validate([
            'nome'           => ['required','string','max:255'],
            'cargo'          => ['required','in:Vendedor,Estoquista,Gerente'],
            'email'          => [
                'required','email','max:100',
                Rule::unique('funcionarios','email')->where('usuario_id', $uid), // <<< unique por usuário
            ],
            'telefone'       => [
                'nullable','string','max:20',
                Rule::unique('funcionarios','telefone')->where('usuario_id', $uid),
            ],
            'salario'        => ['nullable','numeric','min:0'],
            'status'         => ['nullable','in:ativo,inativo,ferias'],
            'data_admissao'  => ['nullable','date'],
            'data_demissao'  => ['nullable','date'],
            'foto'           => ['nullable','image','mimes:jpg,jpeg,png,webp','max:4096'],
        ]);

        if ($r->hasFile('foto')) {
            $data['foto'] = $r->file('foto')->store('avatars-func', 'public');
        } else {
            $data['foto'] = $data['foto'] ?? 'avatars/user.png';
        }

        $data['status']     = $data['status']     ?? 'ativo';
        $data['usuario_id'] = $uid;

        $func = Funcionario::create($data);
        return response()->json($func, 201);
    }

    public function update(Request $r, Funcionario $funcionario)
    {
        abort_if($funcionario->usuario_id !== $r->user()->id, 403); 
        $uid = $r->user()->id;

        $data = $r->validate([
            'nome'           => ['sometimes','string','max:255'],
            'cargo'          => ['sometimes','in:Vendedor,Estoquista,Gerente'],
            'email'          => [
                'sometimes','email','max:100',
                Rule::unique('funcionarios','email')
                    ->where('usuario_id', $uid)
                    ->ignore($funcionario->id),
            ],
            'telefone'       => [
                'nullable','string','max:20',
                Rule::unique('funcionarios','telefone')
                    ->where('usuario_id', $uid)
                    ->ignore($funcionario->id),
            ],
            'salario'        => ['nullable','numeric','min:0'],
            'status'         => ['sometimes','in:ativo,inativo,ferias'],
            'data_admissao'  => ['nullable','date'],
            'data_demissao'  => ['nullable','date'],
            'foto'           => ['nullable','image','mimes:jpg,jpeg,png,webp','max:4096'],
        ]);

        if ($r->hasFile('foto')) {
            if ($funcionario->foto && $funcionario->foto !== 'avatars/user.png') {
                Storage::disk('public')->delete($funcionario->foto);
            }
            $data['foto'] = $r->file('foto')->store('avatars-func', 'public');
        }

        $funcionario->update($data);
        return $funcionario->refresh();
    }

    public function destroy(Request $r, Funcionario $funcionario)
    {
        abort_if($funcionario->usuario_id !== $r->user()->id, 403); 
        $funcionario->update([
            'status' => 'inativo',
            'data_demissao' => now(),
        ]);

        return response()->noContent();
    }
}
