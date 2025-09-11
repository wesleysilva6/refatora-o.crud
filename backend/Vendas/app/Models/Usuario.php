<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
class Usuario extends Authenticatable
{
    use HasApiTokens, Notifiable; // <- importante para tokens Sanctum

    protected $table = 'usuarios';
    protected $fillable = ['nome','email','senha','foto'];
    protected $hidden = ['senha'];
    public $timestamps = false;

    public function getAuthPassword()
    {
        return $this->senha;
    }

    public function topicos()
    { 
        return $this->hasMany(Topico::class, 'usuario_id'); 
    }

    public function produtos() 
    { 
        return $this->hasMany(Produto::class, 'usuario_id'); 
    }
}
