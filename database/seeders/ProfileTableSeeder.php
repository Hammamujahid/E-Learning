<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Profile;

class ProfileTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $Profiles = [
            [
                'user_id' => 1,
                'is_deleted' => false
            ],
                        [
                'user_id' => 2,
                'is_deleted' => false
            ],
                        [
                'user_id' => 3,
                'is_deleted' => false
            ]
        ];

        foreach($Profiles as $data){
            Profile::create([
                'user_id' => $data['user_id'],
                'is_deleted' => $data['is_deleted']
            ]);
        }
    }
}
