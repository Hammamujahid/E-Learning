<?php

namespace App\Policies;

use App\Models\QuizAttempt;
use App\Models\User;

class QuizAttemptPolicy
{
    /**
     * An attempt is private to the student who started it. Admins may inspect
     * attempts for support purposes.
     */
    public function view(User $user, QuizAttempt $attempt): bool
    {
        return $attempt->user_id === $user->id || $user->isAdmin();
    }

    public function submit(User $user, QuizAttempt $attempt): bool
    {
        return $attempt->user_id === $user->id && ! $attempt->isSubmitted();
    }
}
