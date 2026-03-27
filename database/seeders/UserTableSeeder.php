<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $Users = [
            [
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'password' => bcrypt('admin123'),
                'role' => 'admin',
            ],
            [
                'name' => 'User',
                'email' => 'user@example.com',
                'password' => bcrypt('user123'),
                'role' => 'user',
            ],
            [
                'name' => 'Teacher',
                'email' => 'teacher@example.com',
                'password' => bcrypt('teacher123'),
                'role' => 'teacher',
            ]
        ];

        foreach ($Users as $data) {
            User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'role' => $data['role'],
            ]);
        }
    }
}
