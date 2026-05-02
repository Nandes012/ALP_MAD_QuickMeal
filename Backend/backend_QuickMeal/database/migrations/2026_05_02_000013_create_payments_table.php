<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscription_id')->constrained('subscriptions')->onDelete('cascade');
            $table->string('method'); // credit_card, debit_card, e_wallet, transfer, etc
            $table->decimal('amount', 10, 2);
            $table->string('status')->default('pending'); // pending, completed, failed, refunded
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
