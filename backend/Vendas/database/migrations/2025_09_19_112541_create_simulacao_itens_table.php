<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('simulacao_itens', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('simulacao_id')->constrained('simulacoes')->cascadeOnDelete();
            $table->foreignId('produto_id')->constrained('produtos');
            $table->string('nome_produto', 255);
            $table->integer('quantidade');
            $table->decimal('preco', 12, 2);
            $table->decimal('subtotal', 12, 2);
            $table->timestamp('criado_em')->useCurrent();
            $table->index(['simulacao_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('simulacao_itens');
    }
};
