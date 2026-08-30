<?php

namespace Database\Seeders;

use App\Models\Answer;
use App\Models\LearningMaterial;
use App\Models\Question;
use Illuminate\Database\Seeder;

class QuestionTableSeeder extends Seeder
{
    /**
     * Seeds three questions per material so the quiz flow is usable
     * immediately after a fresh migrate --seed.
     */
    public function run(): void
    {
        $bank = [
            'Introduction to Laravel' => [
                [
                    'text' => 'Perintah Artisan mana yang membuat file migrasi baru?',
                    'answers' => ['php artisan make:migration', 'php artisan migrate:new', 'php artisan db:migration', 'php artisan create:migration'],
                    'correct' => 0,
                ],
                [
                    'text' => 'Apa nama ORM bawaan Laravel?',
                    'answers' => ['Eloquent', 'Doctrine', 'Hibernate', 'Sequelize'],
                    'correct' => 0,
                ],
                [
                    'text' => 'Direktori mana yang menyimpan file route Laravel?',
                    'answers' => ['routes/', 'config/', 'app/Http/', 'resources/'],
                    'correct' => 0,
                ],
            ],
            'Introduction to ReactJS' => [
                [
                    'text' => 'Hook mana yang dipakai untuk menyimpan state lokal komponen?',
                    'answers' => ['useState', 'useEffect', 'useMemo', 'useRef'],
                    'correct' => 0,
                ],
                [
                    'text' => 'Apa yang dikembalikan sebuah komponen React?',
                    'answers' => ['Elemen React (JSX)', 'String HTML', 'Objek DOM', 'Promise'],
                    'correct' => 0,
                ],
                [
                    'text' => 'Prop khusus apa yang dibutuhkan saat me-render list?',
                    'answers' => ['key', 'id', 'index', 'ref'],
                    'correct' => 0,
                ],
            ],
            'Introduction to NextJS' => [
                [
                    'text' => 'Folder mana yang dipakai App Router pada Next.js 14?',
                    'answers' => ['app/', 'pages/', 'src/routes/', 'views/'],
                    'correct' => 0,
                ],
                [
                    'text' => 'Direktif apa yang menandai komponen sebagai Client Component?',
                    'answers' => ["'use client'", "'use server'", "'client only'", "'no ssr'"],
                    'correct' => 0,
                ],
                [
                    'text' => 'File apa yang dipakai untuk menampilkan UI loading pada sebuah route?',
                    'answers' => ['loading.tsx', 'spinner.tsx', 'pending.tsx', 'fallback.tsx'],
                    'correct' => 0,
                ],
            ],
            'Introduction to Flutter' => [
                [
                    'text' => 'Bahasa pemrograman apa yang dipakai Flutter?',
                    'answers' => ['Dart', 'Kotlin', 'Swift', 'JavaScript'],
                    'correct' => 0,
                ],
                [
                    'text' => 'Widget apa yang menyusun anak-anaknya secara vertikal?',
                    'answers' => ['Column', 'Row', 'Stack', 'Wrap'],
                    'correct' => 0,
                ],
                [
                    'text' => 'Method apa yang memicu ulang build pada StatefulWidget?',
                    'answers' => ['setState', 'rebuild', 'notify', 'refresh'],
                    'correct' => 0,
                ],
            ],
        ];

        foreach ($bank as $materialName => $questions) {
            $material = LearningMaterial::where('name', $materialName)->first();

            if (! $material) {
                continue;
            }

            foreach ($questions as $item) {
                $question = Question::create([
                    'learning_material_id' => $material->id,
                    'question_text' => $item['text'],
                    'created_by' => $material->created_by,
                    'is_deleted' => false,
                ]);

                // Shuffle so the answer key is not always the first option.
                $correctText = $item['answers'][$item['correct']];
                $options = $item['answers'];
                shuffle($options);

                foreach ($options as $answerText) {
                    Answer::create([
                        'question_id' => $question->id,
                        'answer_text' => $answerText,
                        'is_correct' => $answerText === $correctText,
                        'is_deleted' => false,
                    ]);
                }
            }
        }
    }
}
