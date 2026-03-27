<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Subject;


class SubjectTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $Subjects = [
            "Laravel",
            "ReactJS",
            "NextJS",
            "Flutter"
        ];

        foreach ($Subjects as $name) {
            Subject::create([
                'name' => $name
            ]);
        }
    }
}
