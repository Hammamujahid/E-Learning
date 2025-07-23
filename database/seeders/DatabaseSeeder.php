<?php

namespace Database\Seeders;

use App\Models\Learning_Material;
use App\Models\User;
use App\Models\Subject;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('test123'),
            'role' => 'admin',
        ]);

        Subject::factory()->create([
            'user_id' => 1,
            'name' => 'Matematika',
        ]);

        Learning_Material::factory()->create([
            'user_id' => 1,
            'subject_id' => 1,
            'name' => 'Aljabar',
        ]);
    }
}
