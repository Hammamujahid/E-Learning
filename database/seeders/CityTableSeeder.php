<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;

class CityTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $Cities = [
            'Surabaya',
            'Jakarta',
            'Bandung',
            'Yogyakarta',
            'Malang',
            'Ngawi',
        ];

        foreach ($Cities as $name) {
            City::create([
                'name' => $name,
            ]);
        }
    }
}
