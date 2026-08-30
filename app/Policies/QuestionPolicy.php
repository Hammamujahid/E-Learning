<?php

namespace App\Policies;

use App\Models\Question;
use App\Models\User;

class QuestionPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Question $question): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isTeacher();
    }

    public function update(User $user, Question $question): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->isTeacher() && $question->created_by === $user->id;
    }

    public function delete(User $user, Question $question): bool
    {
        return $this->update($user, $question);
    }

    /**
     * Only the owner of an attempt may see which answers were correct.
     */
    public function viewAnswerKey(User $user, Question $question): bool
    {
        return $user->isAdmin() || ($user->isTeacher() && $question->created_by === $user->id);
    }
}
