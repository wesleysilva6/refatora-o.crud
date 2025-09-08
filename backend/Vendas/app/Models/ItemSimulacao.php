<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemSimulacao extends Model
{
    protected $table = 'itens_simulacao';
    protected $fillable = ['id_simulacao','produto_id','nome_produto','quantidade','preco','subtotal'];
    public $timestamps = false;

    public function simulacao()
    {
        return $this->belongsTo(Simulacao::class, 'id_simulacao');
    }

    public function produto()
    {
        return $this->belongsTo(Produto::class, 'produto_id'); // FK sugerida
    }
}
