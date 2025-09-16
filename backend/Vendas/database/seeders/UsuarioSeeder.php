<?php

namespace Database\Seeders;

use App\Models\Usuario;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsuarioSeeder extends Seeder {

public function run(){
    Usuario::updateOrCreate(
        ['email' => 'admin@example.com'],
        ['nome' => 'Admin', 'senha' => Hash::make('123456'), 'foto' => 'avatars/user.png']
    );
}
}
