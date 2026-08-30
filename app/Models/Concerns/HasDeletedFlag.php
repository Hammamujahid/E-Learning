<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;

/**
 * Treats the existing `is_deleted` boolean column as a soft-delete flag.
 *
 * Records flagged as deleted are excluded from every query by default. Use
 * `withDeleted()` to include them or `onlyDeleted()` to fetch just those,
 * mirroring Laravel's own SoftDeletes API without changing the schema.
 */
trait HasDeletedFlag
{
    public static function bootHasDeletedFlag(): void
    {
        static::addGlobalScope('notDeleted', function (Builder $builder) {
            $builder->where($builder->getModel()->getTable().'.is_deleted', false);
        });
    }

    public function scopeWithDeleted(Builder $query): Builder
    {
        return $query->withoutGlobalScope('notDeleted');
    }

    public function scopeOnlyDeleted(Builder $query): Builder
    {
        return $query->withoutGlobalScope('notDeleted')
            ->where($this->getTable().'.is_deleted', true);
    }

    /**
     * Flag the record as deleted instead of removing the row.
     */
    public function softDelete(): bool
    {
        return $this->forceFill(['is_deleted' => true])->save();
    }

    /**
     * Clear the deleted flag.
     */
    public function restoreDeleted(): bool
    {
        return $this->forceFill(['is_deleted' => false])->save();
    }

    public function isDeleted(): bool
    {
        return (bool) $this->is_deleted;
    }

    /**
     * Route binding must reach deleted records so management screens can
     * reactivate them. Screens that should not expose deactivated content
     * (student pages) check `isDeleted()` and 404 explicitly.
     */
    public function resolveRouteBinding($value, $field = null)
    {
        return $this->withoutGlobalScope('notDeleted')
            ->where($field ?? $this->getRouteKeyName(), $value)
            ->firstOrFail();
    }
}
