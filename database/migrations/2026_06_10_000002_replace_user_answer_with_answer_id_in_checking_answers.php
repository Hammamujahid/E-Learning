<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Replaces the free-text `user_answer` column with a foreign key to the chosen
 * answer, so grading can be verified against the answer key server-side.
 * A null answer_id means the question was left unanswered.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('checking_answers', function (Blueprint $table) {
            $table->foreignId('answer_id')->nullable()->after('question_id')->constrained('answers')->nullOnDelete();
        });

        Schema::table('checking_answers', function (Blueprint $table) {
            $table->dropColumn('user_answer');
        });
    }

    public function down(): void
    {
        Schema::table('checking_answers', function (Blueprint $table) {
            $table->text('user_answer')->nullable()->after('question_id');
        });

        Schema::table('checking_answers', function (Blueprint $table) {
            $table->dropConstrainedForeignId('answer_id');
        });
    }
};
