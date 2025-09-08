<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Authentication Defaults
    |--------------------------------------------------------------------------
    */
    'defaults' => [
        'guard' => env('AUTH_GUARD', 'web'),
        'passwords' => env('AUTH_PASSWORD_BROKER', 'users'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Authentication Guards
    |--------------------------------------------------------------------------
    |
    | web  -> sessão (Blade, etc.)
    | api  -> Sanctum (Bearer Token) para o seu React
    |
    */
    'guards' => [
        'web' => [
            'driver'   => 'session',
            'provider' => 'users',
        ],

        'api' => [
            'driver'   => 'sanctum',
            'provider' => 'users',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | User Providers
    |--------------------------------------------------------------------------
    |
    | Usa seu model App\Models\Usuario que mapeia a tabela `usuarios`
    | (com coluna de senha chamada `senha`).
    |
    */
    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            // Se quiser controlar via .env, mantenha a linha abaixo:
            // 'model'  => env('AUTH_MODEL', App\Models\Usuario::class),
            // Ou fixe diretamente:
            'model'  => App\Models\Usuario::class,
        ],

        // Exemplo de provider por database (não usado aqui):
        // 'users' => [
        //     'driver' => 'database',
        //     'table'  => 'usuarios',
        // ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Resetting Passwords
    |--------------------------------------------------------------------------
    */
    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table'    => env('AUTH_PASSWORD_RESET_TOKEN_TABLE', 'password_reset_tokens'),
            'expire'   => 60,
            'throttle' => 60,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Password Confirmation Timeout
    |--------------------------------------------------------------------------
    */
    'password_timeout' => env('AUTH_PASSWORD_TIMEOUT', 10800),
];
