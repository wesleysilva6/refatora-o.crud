<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('usuarios', function (Blueprint $table) {
            $table->string('foto', 255)->nullable()->default('avatars/user.png')->change();
        });
    }
    public function down(): void {
        Schema::table('usuarios', function (Blueprint $table) {
            $table->string('foto', 255)->nullable()->default(null)->change();
        });
    }
    
};
