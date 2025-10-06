<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('produtos', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('topico_id');
            $table->foreign('topico_id')->references('id_topico')->on('topicos')->cascadeOnDelete();
            $table->unsignedBigInteger('usuario_id');
            $table->foreign('usuario_id')->references('id')->on('usuarios')->cascadeOnDelete();
            $table->string('nome_produto', 255);
            $table->decimal('preco', 10, 2);
            $table->integer('quantidade');
            $table->text('descricao')->nullable();
            $table->string('imagem', 255)->nullable();
            $table->timestamp('criado_em')->useCurrent();
            $table->timestamp('atualizado_em')->nullable()->useCurrentOnUpdate();
            $table->index(['topico_id', 'usuario_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produtos');
    }
};
