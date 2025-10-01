<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class SimulacaoItem extends Model
{
    protected $table = 'simulacao_itens';
    protected $fillable = ['simulacao_id','produto_id','nome_produto','quantidade','preco','subtotal'];
    public const CREATED_AT = 'criado_em';
    public const UPDATED_AT = null; 

    public function simulacao()
    {
        return $this->belongsTo(Simulacao::class, 'simulacao_id');
    }
}