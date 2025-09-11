<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    use HasFactory;

    // Nome da tabela (se não usar o padrão no plural)
    protected $table = 'produtos';

    // Se seus timestamps são 'criado_em' e 'atualizado_em'
    public const CREATED_AT = 'criado_em';
    public const UPDATED_AT = 'atualizado_em';

    // Campos liberados para atribuição em massa
    protected $fillable = [
        'topico_id',
        'usuario_id',
        'nome_produto',
        'preco',
        'quantidade',
        'descricao',
        'imagem',
    ];

    // Casts úteis
    protected $casts = [
        'preco'         => 'decimal:2',
        'quantidade'    => 'integer',
        'criado_em'     => 'datetime',
        'atualizado_em' => 'datetime',
    ];

    /** Relações */
    public function topico()
    {
        return $this->belongsTo(Topico::class, 'topico_id');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}
