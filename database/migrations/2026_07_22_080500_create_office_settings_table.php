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
        Schema::create('office_settings', function (Blueprint $table) {
            $table->id();
            $table->string('working_hours_start')->default('08:00 AM');
            $table->string('working_hours_end')->default('06:00 PM');
            $table->boolean('lock_time_enabled')->default(false);
            $table->boolean('notify_on_late')->default(true);
            $table->boolean('auto_checkout')->default(false);
            $table->integer('default_meeting_duration')->default(60);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('office_settings');
    }
};
