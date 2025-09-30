<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('funcionarios', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('nome', 255);
            $table->enum('cargo', ['Vendedor','Estoquista','Gerente']);
            $table->string('email', 100)->unique();
            $table->string('telefone', 20)->nullable();
            $table->decimal('salario', 12, 2)->nullable();
            $table->enum('status', ['ativo','inativo'])->default('ativo');
            $table->string('foto', 255)->nullable()->default('avatars/user.png');
            $table->timestamp('data_admissao')->useCurrent();
            $table->timestamp('data_demissao')->nullable();
            $table->timestamp('atualizado_em')->nullable()->useCurrentOnUpdate();
            $table->index(['nome','cargo']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('funcionarios');
    }
};
