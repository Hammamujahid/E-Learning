<?php

namespace Database\Seeders;

use App\Models\LearningMaterial;
use App\Models\User;
use Illuminate\Database\Seeder;

class LearningMaterialTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teacher = User::where('role', User::ROLE_TEACHER)->first()
            ?? User::where('role', User::ROLE_ADMIN)->first();

        $learningMaterials = [
            ['subject_id' => 1, 'name' => 'Introduction to Laravel', 'description' => 'Dasar-dasar framework Laravel.'],
            ['subject_id' => 2, 'name' => 'Introduction to ReactJS', 'description' => 'Dasar-dasar library ReactJS.'],
            ['subject_id' => 3, 'name' => 'Introduction to NextJS', 'description' => 'Dasar-dasar framework NextJS.'],
            ['subject_id' => 4, 'name' => 'Introduction to Flutter', 'description' => 'Dasar-dasar framework Flutter.'],
        ];

        foreach ($learningMaterials as $data) {
            LearningMaterial::create([
                'subject_id' => $data['subject_id'],
                'name' => $data['name'],
                'description' => $data['description'],
                'created_by' => $teacher?->id,
                'is_deleted' => false,
            ]);
        }
    }
}
