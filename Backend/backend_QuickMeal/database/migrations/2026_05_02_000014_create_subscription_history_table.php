<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('subscription_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->date('start_date');
            $table->date('end_date');
            $table->string('status'); // active, expired, cancelled, paused, etc
            $table->string('previous_status')->nullable(); // previous status before this change
            $table->string('change_reason')->nullable(); // reason for the change
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('subscription_history');
    }
};
