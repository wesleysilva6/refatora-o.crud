<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Funcionario extends Model
{
    protected $table = 'funcionarios';
    protected $fillable = ['nome','cargo','email','telefone','salario', 'status', 'foto', 'data_admissao' ,'data_demissao'];
    public $timestamps = false;

    public function vendas()
    {
        return $this->hasMany(Venda::class, 'funcionario_id');
    }

    public function getFotoAttribute($value)
    {
        return $value ? (\Illuminate\Support\Facades\Storage::url($value)) : null;
    }
}