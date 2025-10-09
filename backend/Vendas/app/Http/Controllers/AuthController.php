<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Services\PHPMailerService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = Usuario::where('email', $data['email'])->first();

        if (! $user || ! $data['email'] === $user->email) {
            return response()->json(['message' => 'Email inválido.'], 401);
        }

        if (! $user || ! Hash::check($data['password'], $user->senha)) {
            return response()->json(['message' => 'Senha inválida.'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

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
        $request->user()?->currentAccessToken()?->delete();

        return response()->json(['message' => 'ok']);
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'nome'  => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique('usuarios', 'email')],
            'senha' => ['required', 'string', 'min:8'],
        ]);

        $user = Usuario::create([
            'nome'  => $data['nome'],
            'email' => $data['email'],
            'senha' => Hash::make($data['senha']),
            'foto'  => null,
        ]);

        return response()->json([
            'message' => 'Cadastro realizado',
            'user' => [
                'id'    => $user->id,
                'nome'  => $user->nome,
                'email' => $user->email,
            ],
        ], 201);
    }

    public function forgot(Request $request, PHPMailerService $mailer)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = Usuario::where('email', $data['email'])->first();
        if (! $user) {
            return response()->json(['message' => 'E-mail inválido.'], 422);
        }

        $plainToken = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            ['token' => hash('sha256', $plainToken), 'created_at' => now()]
        );

        $frontend = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:5173'));
        $resetUrl = $frontend . '/resetar?token=' . $plainToken . '&email=' . urlencode($user->email);

        $html = view('emails.redefinir-senha-phpmailer', [
            'user'     => $user,
            'resetUrl' => $resetUrl,
        ])->render();

        $mailer->sendHtml($user->email, $user->nome, 'Redefinição de Senha - Estoque Aqui', $html);

        return response()->json(['ok' => true]);
    }

    public function reset(Request $request)
    {
        $data = $request->validate([
            'email'    => ['required','email'],
            'token'    => ['required','string'],
            'password' => ['required','string','min:8'],
        ]);

        $row = DB::table('password_reset_tokens')->where('email', $data['email'])->first();
        if (! $row) {
            return response()->json(['message' => 'Token inválido.'], 422);
        }

        if (Carbon::parse($row->created_at)->addMinutes(60)->isPast()) {
            return response()->json(['message' => 'Token expirado.'], 422);
        }

        if (! hash_equals($row->token, hash('sha256', $data['token']))) {
            return response()->json(['message' => 'Token inválido.'], 422);
        }

        Usuario::where('email', $data['email'])->update([
            'senha' => Hash::make($data['password']),
        ]);

        DB::table('password_reset_tokens')->where('email', $data['email'])->delete();

        return response()->json(['message' => 'Senha alterada com sucesso.']);
    }
}
