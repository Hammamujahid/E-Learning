<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Activities are recorded automatically by ActivityObserver as the
        // seeders above create users, materials and questions.
        $this->call([
            CityTableSeeder::class,
            SubjectTableSeeder::class,
            UserTableSeeder::class,
            ProfileTableSeeder::class,
            LearningMaterialTableSeeder::class,
            QuestionTableSeeder::class,
        ]);
    }
}
