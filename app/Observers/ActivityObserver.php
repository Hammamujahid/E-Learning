<?php

namespace App\Observers;

use App\Models\Activity;
use App\Models\LearningMaterial;
use App\Models\Question;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * Records create/update/delete events for the models surfaced on the admin
 * dashboard's activity feed. Attached to models in AppServiceProvider.
 */
class ActivityObserver
{
    /**
     * Maps a model class onto the `type` enum stored on the activities table.
     */
    protected const TYPES = [
        User::class => 'user',
        LearningMaterial::class => 'learning_material',
        Question::class => 'question',
    ];

    public function created(Model $model): void
    {
        $this->record($model, 'created');
    }

    public function updated(Model $model): void
    {
        // A soft delete is an update on is_deleted; report it as a deletion.
        if ($model->wasChanged('is_deleted') && $model->is_deleted) {
            $this->record($model, 'deleted');

            return;
        }

        $this->record($model, 'updated');
    }

    public function deleted(Model $model): void
    {
        $this->record($model, 'deleted');
    }

    protected function record(Model $model, string $action): void
    {
        $type = self::TYPES[$model::class] ?? null;

        if (! $type) {
            return;
        }

        Activity::create([
            'model_id' => $model->getKey(),
            'type' => $type,
            'action' => $action,
            'description' => $this->describe($model, $type, $action),
            'is_deleted' => false,
        ]);
    }

    protected function describe(Model $model, string $type, string $action): string
    {
        $label = match ($type) {
            'user' => 'Pengguna',
            'learning_material' => 'Materi',
            'question' => 'Soal',
        };

        $verb = match ($action) {
            'created' => 'ditambahkan',
            'updated' => 'diperbarui',
            'deleted' => 'dihapus',
        };

        $name = match ($type) {
            'user' => $model->name,
            'learning_material' => $model->name,
            'question' => str($model->question_text)->limit(60)->value(),
        };

        return "{$label} \"{$name}\" {$verb}.";
    }
}
