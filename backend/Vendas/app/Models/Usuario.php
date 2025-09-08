<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens; // <- importante para tokens Sanctum

    protected $table = 'usuarios';
    protected $fillable = ['nome','email','senha','foto'];
    protected $hidden = ['senha'];
    public $timestamps = false;

    public function getAuthPassword()
    {
        return $this->senha;
    }
}
