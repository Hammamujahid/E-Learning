<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Tracks whether an attempt is still being worked on or has been graded,
 * so a submitted attempt cannot be re-submitted and results stay retrievable.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('quiz_attempts', function (Blueprint $table) {
            $table->string('status')->default('in_progress')->after('score');
            $table->timestamp('submitted_at')->nullable()->after('status');
        });

        // Existing rows predate the workflow; treat any scored attempt as submitted.
        DB::table('quiz_attempts')
            ->where('score', '>', 0)
            ->update(['status' => 'submitted', 'submitted_at' => now()]);
    }

    public function down(): void
    {
        Schema::table('quiz_attempts', function (Blueprint $table) {
            $table->dropColumn(['status', 'submitted_at']);
        });
    }
};
