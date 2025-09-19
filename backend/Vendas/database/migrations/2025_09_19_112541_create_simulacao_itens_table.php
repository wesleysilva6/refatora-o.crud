<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('simulacao_itens', function (Blueprint $table) {
            $table->bigIncrements('id');

            // relação com a simulação
            $table->foreignId('simulacao_id')
                ->constrained('simulacoes')
                ->cascadeOnDelete();

            // referência ao produto no momento da simulação
            $table->foreignId('produto_id')
                  ->constrained('produtos'); // ajuste onDelete se quiser

            // “fotografia” do item na data da simulação
            $table->string('nome_produto', 255);
            $table->integer('quantidade');
            $table->decimal('preco', 12, 2);
            $table->decimal('subtotal', 12, 2);

            $table->timestamp('criado_em')->useCurrent();
            $table->timestamp('atualizado_em')->nullable()->useCurrentOnUpdate();

            $table->index(['simulacao_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('simulacao_itens');
    }
};
