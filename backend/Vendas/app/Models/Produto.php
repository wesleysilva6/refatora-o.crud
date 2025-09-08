<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    protected $table = 'produtos';
    protected $fillable = ['nome_produto','quantidade','descricao','topico_id','preco','imagem'];

    // mapear timestamps customizados
    const CREATED_AT = 'criado_em';
    const UPDATED_AT = 'atualizado_em';

    public function topico()
    {
        return $this->belongsTo(Topico::class, 'topico_id', 'id_topico');
    }
}
