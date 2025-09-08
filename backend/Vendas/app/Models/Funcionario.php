<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Funcionario extends Model
{
    protected $table = 'funcionarios';
    protected $fillable = ['nome','cargo','email','telefone','salario','data_admissao','status','foto'];
    public $timestamps = false;

    public function vendas()
    {
        return $this->hasMany(Venda::class, 'funcionario_id');
    }
}