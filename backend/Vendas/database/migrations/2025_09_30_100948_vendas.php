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
            $table->string('cliente', 255);
            $table->string('telefone', 50)->nullable();
            $table->foreignId('funcionario_id')->constrained('funcionarios')->cascadeOnDelete()->cascadeOnUpdate();
            $table->decimal('total', 10, 2)->default(0);
            $table->timestamp('realizada_em')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendas');
    }
};
