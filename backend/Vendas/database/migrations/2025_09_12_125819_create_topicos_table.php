<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('topicos', function (Blueprint $table) {
            $table->bigIncrements('id_topico');   
            $table->string('nome_topico', 255);
            $table->unsignedBigInteger('usuario_id');
            $table->foreign('usuario_id')->references('id')->on('usuarios')->cascadeOnDelete();
            $table->timestamp('criado_em');
            $table->timestamp('atualizado_em');
            $table->index(['usuario_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('topicos');
    }
};
