<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\City;

class CityTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $Cities = [
            "Surabaya",
            "Jakarta",
            "Bandung",
            "Yogyakarta",
            "Malang",
            "Ngawi"
        ];

        foreach ($Cities as $name) {
            City::create([
                "name" => $name
            ]);
        }
    }
}
