<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Seeder;

class SubjectTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $Subjects = [
            'Laravel',
            'ReactJS',
            'NextJS',
            'Flutter',
        ];

        foreach ($Subjects as $name) {
            Subject::create([
                'name' => $name,
            ]);
        }
    }
}
