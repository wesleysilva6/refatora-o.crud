<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vendas', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('funcionario_id')->constrained('funcionarios')->cascadeOnDelete();
            $table->string('cliente', 255);
            $table->integer('total');
            $table->timestamp('realizada_em')->useCurrent();
            $table->string('telefone');
            $table->index(['funcionario_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendas');
    }
};
