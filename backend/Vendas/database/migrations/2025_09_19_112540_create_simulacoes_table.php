<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('simulacoes', function (Blueprint $table) {
            $table->bigIncrements('id');

            // usuário dono da simulação
            $table->foreignId('usuario_id')
                ->constrained('usuarios')
                ->cascadeOnDelete();

            $table->string('cliente', 255);
            $table->decimal('total', 12, 2)->default(0);

            // status opcional (ajuste como preferir)
            $table->enum('status', ['aberta','finalizada','cancelada'])
                ->default('finalizada');

            // timestamps padrão do Laravel
            $table->timestamps();

            $table->index(['usuario_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('simulacoes');
    }
};
