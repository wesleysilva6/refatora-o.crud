<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Simulacao extends Model
{
    protected $table = 'simulacoes';
    protected $fillable = ['usuario_id','cliente','total','status'];
    const CREATED_AT = 'criado_em';
    const UPDATED_AT = 'atualizado_em';

    public function itens()
    {
        return $this->hasMany(SimulacaoItem::class, 'simulacao_id');
    }
}