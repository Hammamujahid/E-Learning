<?php

namespace Database\Seeders;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProfileTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $profiles = [
            'admin@example.com' => [
                'fullname' => 'Administrator',
                'city_id' => 1,
                'birth_date' => '1990-01-15',
                'phone_number' => '081200000001',
                'gender' => 'male',
            ],
            'user@example.com' => [
                'fullname' => 'Siswa Contoh',
                'city_id' => 2,
                'birth_date' => '2005-06-20',
                'phone_number' => '081200000002',
                'gender' => 'female',
            ],
            'teacher@example.com' => [
                'fullname' => 'Guru Contoh',
                'city_id' => 3,
                'birth_date' => '1988-11-02',
                'phone_number' => '081200000003',
                'gender' => 'male',
            ],
        ];

        foreach ($profiles as $email => $data) {
            $user = User::where('email', $email)->first();

            if (! $user) {
                continue;
            }

            Profile::create([
                'user_id' => $user->id,
                'city_id' => $data['city_id'],
                'fullname' => $data['fullname'],
                'birth_date' => $data['birth_date'],
                'phone_number' => $data['phone_number'],
                'gender' => $data['gender'],
                'is_deleted' => false,
            ]);
        }
    }
}
