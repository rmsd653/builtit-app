<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('system_role')->default('employee')->index();
            $table->string('display_role')->nullable();
            $table->foreignId('manager_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('initials', 5)->nullable();
            $table->text('avatar_url')->nullable();
            $table->string('status')->default('Available');
            $table->string('status_details')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['manager_id']);
            $table->dropColumn([
                'system_role',
                'display_role',
                'manager_id',
                'initials',
                'avatar_url',
                'status',
                'status_details'
            ]);
        });
    }
};
