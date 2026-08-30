<?php

namespace App\Providers;

use App\Models\LearningMaterial;
use App\Models\Question;
use App\Models\QuizAttempt;
use App\Models\User;
use App\Observers\ActivityObserver;
use App\Policies\LearningMaterialPolicy;
use App\Policies\QuestionPolicy;
use App\Policies\QuizAttemptPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(LearningMaterial::class, LearningMaterialPolicy::class);
        Gate::policy(Question::class, QuestionPolicy::class);
        Gate::policy(QuizAttempt::class, QuizAttemptPolicy::class);

        User::observe(ActivityObserver::class);
        LearningMaterial::observe(ActivityObserver::class);
        Question::observe(ActivityObserver::class);
    }
}
