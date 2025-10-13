<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // funcionarios: adiciona usuario_id (nullable) + índice
        Schema::table('funcionarios', function (Blueprint $table) {
            if (!Schema::hasColumn('funcionarios', 'usuario_id')) {
                $table->unsignedBigInteger('usuario_id')->nullable()->index()->after('id');
            }
        });

        // vendas: adiciona usuario_id (nullable) + índice
        Schema::table('vendas', function (Blueprint $table) {
            if (!Schema::hasColumn('vendas', 'usuario_id')) {
                $table->unsignedBigInteger('usuario_id')->nullable()->index()->after('id');
            }
        });
    }

    public function down(): void
    {
        // funcionarios: remove índice + coluna (se existir)
        Schema::table('funcionarios', function (Blueprint $table) {
            if (Schema::hasColumn('funcionarios', 'usuario_id')) {
                // nome padrão do índice seria funcionarios_usuario_id_index
                $table->dropIndex(['usuario_id']);
                $table->dropColumn('usuario_id');
            }
        });

        // vendas: remove índice + coluna (se existir)
        Schema::table('vendas', function (Blueprint $table) {
            if (Schema::hasColumn('vendas', 'usuario_id')) {
                // nome padrão do índice seria vendas_usuario_id_index
                $table->dropIndex(['usuario_id']);
                $table->dropColumn('usuario_id');
            }
        });
    }
};
