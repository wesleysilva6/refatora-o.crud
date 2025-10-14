<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Venda extends Model
{
    protected $table = 'vendas';
    protected $fillable = ['usuario_id','cliente','telefone','funcionario_id','total','realizada_em'];
    protected $casts = ['realizada_em' => 'datetime', 'total' => 'decimal:2']; 
    public $timestamps = false;

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    public function funcionario()
    { 
        return $this->belongsTo(Funcionario::class,'funcionario_id'); 
    }
    public function itens()
    { 
        return $this->hasMany(ItemVenda::class,'venda_id'); 
    }
}