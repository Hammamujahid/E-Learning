<?php

namespace App\Policies;

use App\Models\LearningMaterial;
use App\Models\User;

class LearningMaterialPolicy
{
    /**
     * Admins and teachers reach the management screens; students only read.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, LearningMaterial $material): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isTeacher();
    }

    public function update(User $user, LearningMaterial $material): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->isTeacher() && $material->created_by === $user->id;
    }

    public function delete(User $user, LearningMaterial $material): bool
    {
        return $this->update($user, $material);
    }
}
