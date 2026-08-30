<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Converts `created_by` on learning_materials and questions from a free-text
 * author name into a foreign key on users.id, so ownership can be enforced
 * by policy rather than by string comparison.
 */
return new class extends Migration
{
    public function up(): void
    {
        $fallbackUserId = DB::table('users')->where('role', 'admin')->value('id')
            ?? DB::table('users')->min('id');

        foreach (['learning_materials', 'questions'] as $table) {
            Schema::table($table, function (Blueprint $t) {
                $t->renameColumn('created_by', 'created_by_name');
            });

            Schema::table($table, function (Blueprint $t) {
                $t->foreignId('created_by')->nullable()->after('id')->constrained('users')->nullOnDelete();
            });

            // Match the stored author name back to a user where possible.
            DB::table($table)->orderBy('id')->each(function ($row) use ($table, $fallbackUserId) {
                $userId = DB::table('users')->where('name', $row->created_by_name)->value('id') ?? $fallbackUserId;

                DB::table($table)->where('id', $row->id)->update(['created_by' => $userId]);
            });

            Schema::table($table, function (Blueprint $t) {
                $t->dropColumn('created_by_name');
            });
        }
    }

    public function down(): void
    {
        foreach (['learning_materials', 'questions'] as $table) {
            Schema::table($table, function (Blueprint $t) {
                $t->string('created_by_name')->nullable();
            });

            DB::table($table)->orderBy('id')->each(function ($row) use ($table) {
                $name = DB::table('users')->where('id', $row->created_by)->value('name') ?? 'system';

                DB::table($table)->where('id', $row->id)->update(['created_by_name' => $name]);
            });

            Schema::table($table, function (Blueprint $t) {
                $t->dropConstrainedForeignId('created_by');
            });

            Schema::table($table, function (Blueprint $t) {
                $t->renameColumn('created_by_name', 'created_by');
            });
        }
    }
};
