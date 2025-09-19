<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class SimulacaoItem extends Model
{
    protected $table = 'simulacao_itens';
    protected $fillable = ['simulacao_id','produto_id','nome_produto','quantidade','preco','subtotal'];
    const CREATED_AT = 'criado_em';
    const UPDATED_AT = 'atualizado_em';

    public function simulacao()
    {
        return $this->belongsTo(Simulacao::class, 'simulacao_id');
    }
}