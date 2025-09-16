<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class PerfilController extends Controller
{
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateName(Request $request)
    {
        $data = $request->validate([
            'novo_nome' => ['required','string','max:255'],
        ]);

        $user = $request->user();
        $user->nome = $data['novo_nome'];
        $user->save();

        return response()->json(['nome' => $user->nome]);
    }

    public function updatePassword(Request $request)
    {
        $data = $request->validate([
            'senha'            => ['required','string'],
            'nova_senha'       => ['required','string','min:8'],
            'confirmar_senha'  => ['required','same:nova_senha'],
        ]);

        $user = $request->user();

        if (! Hash::check($data['senha'], $user->senha)) {
            return response()->json(['message' => 'A senha atual informada está incorreta.'], 422);
        }

        $user->senha = Hash::make($data['nova_senha']);
        $user->save();

        return response()->json(['message' => 'Senha alterada com sucesso.']);
    }

    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'foto' => ['required','image','mimes:jpg,jpeg,png,webp','max:4096'],
        ]);

        $user = $request->user();

        // delete a antiga SE não for a padrão
        $raw = $user->getRawOriginal('foto'); // caminho bruto salvo no BD
        if ($raw && $raw !== 'avatars/user.png') {
            Storage::disk('public')->delete($raw);
        }

        // salva nova
        $path = $request->file('foto')->store('avatars', 'public'); // ex.: avatars/abc.jpg
        $user->foto = $path; // o accessor do model devolverá URL pública
        $user->save();

        return response()->json(['foto' => Storage::url($path)]);
    }

    public function deletePhoto(Request $request)
    {
        $user = $request->user();

        // apaga antiga SE não for a padrão
        $raw = $user->getRawOriginal('foto');
        if ($raw && $raw !== 'avatars/user.png') {
            Storage::disk('public')->delete($raw);
        }

        // volta para a padrão
        $user->foto = 'avatars/user.png';
        $user->save();

        return response()->json([
            'message' => 'Foto removida.',
            'foto'    => Storage::url('avatars/user.png'),
        ]);
    }
}

