<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('paymenthistory', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscriptionId')->constrained('subscriptions')->onDelete('cascade');
            $table->string('method'); // credit_card, debit_card, e_wallet, transfer, etc
            $table->decimal('amount', 10, 2);
            $table->string('status'); // pending, completed, failed
            $table->string('previousStatus')->nullable(); // previous status before this change
            $table->string('changeReason')->nullable(); // reason for the change (e.g., refund reason, failure reason)
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('payment_history');
    }
};
