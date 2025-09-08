<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Simulacao extends Model
{
    protected $table = 'simulacoes';
    protected $fillable = ['usuario_id','cliente','criada_em','total'];
    public $timestamps = false;

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    public function itens()
    {
        return $this->hasMany(ItemSimulacao::class, 'id_simulacao');
    }
}