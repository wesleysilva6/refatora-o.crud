<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Topico extends Model
{
    use HasFactory;

    protected $table = 'topicos';

    // SEU PK:
    protected $primaryKey = 'id_topico';
    public $incrementing  = true;
    protected $keyType    = 'int';

    // Se seus timestamps são em pt-BR:
    public const CREATED_AT = 'criado_em';
    public const UPDATED_AT = 'atualizado_em';

    protected $fillable = [
        'nome_topico',
        'usuario_id'
    ];

    public function produtos()
    {
    return $this->hasMany(Produto::class, 'topico_id', 'id_topico')->orderBy('id', 'desc'); // id de produtos
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}
