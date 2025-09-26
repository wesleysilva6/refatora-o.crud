<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('funcionarios', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nome', 100);
            $table->enum('cargo', ['Vendedor', 'Estoquista', 'Gerente']);
            $table->string('email', 100)->unique();  
            $table->string('telefone', 20);
            $table->decimal('salario', 10, 2);
            $table->enum('status', ['ativo', 'inativo'])->default('ativo');
            $table->string('foto', 255)->nullable();
            $table->dateTime('data_admissao')->useCurrent();
            $table->dateTime('data_demissao')->nullable();
            $table->index(['nome', 'cargo']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('funcionarios');
    }
};
