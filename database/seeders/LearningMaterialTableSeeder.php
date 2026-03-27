<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\LearningMaterial;

class LearningMaterialTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       $LearningMaterials = [
        [ 'subject_id' => 1, 'name' => 'Introduction to Laravel', 'created_by' => 'Hammam Mujahid'],
        [ 'subject_id' => 2, 'name' => 'Introduction to ReactJS', 'created_by' => 'Hammam Mujahid'],
        [ 'subject_id' => 3, 'name' => 'Introduction to NextJS', 'created_by' => 'Hammam Mujahid'],
        [ 'subject_id' => 4, 'name' => 'Introduction to Flutter', 'created_by' => 'Hammam Mujahid'],
       ];

       foreach ($LearningMaterials as $data){
        LearningMaterial::create([
            'subject_id' => $data['subject_id'],
            'name' => $data['name'],
            'created_by' => $data['created_by'],
        ]);
       }
    }
}
