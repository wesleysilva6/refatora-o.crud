<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Topico extends Model
{
    protected $table = 'topicos';
    protected $primaryKey = 'id_topico';
    public $timestamps = false; // tem apenas 'criado_em'

    protected $fillable = ['nome_topico','usuario_id','criado_em'];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    public function produtos()
    {
        return $this->hasMany(Produto::class, 'topico_id', 'id_topico');
    }
}
