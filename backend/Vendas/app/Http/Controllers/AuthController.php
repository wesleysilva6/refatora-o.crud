<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $cred = $request->validate([
            'email'    => ['required','email'],
            'password' => ['required','string'],
        ]);

        $user = Usuario::where('email', $cred['email'])->first();
        if (!$user || !Hash::check($cred['password'], $user->senha)) {
            return response()->json(['message' => 'Credenciais inválidas'], 422);
        }

        $token = $user->createToken('web')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'    => $user->id,
                'nome'  => $user->nome,
                'email' => $user->email,
                'foto'  => $user->foto,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();
        return response()->json(['message' => 'ok']);
    }
}
