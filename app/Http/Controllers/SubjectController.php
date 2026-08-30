<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Subject;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Reference data managed by admins: subjects and cities.
 */
class SubjectController extends Controller
{
    /**
     * The combined "Lainnya" screen listing subjects and cities.
     */
    public function index(): Response
    {
        return Inertia::render('admin/other', [
            'subjects' => Subject::withDeleted()
                ->orderBy('name')
                ->get()
                ->map(fn (Subject $subject) => [
                    'id' => $subject->id,
                    'name' => $subject->name,
                    'description' => $subject->description,
                    'is_deleted' => $subject->is_deleted,
                    'created_at' => $subject->created_at?->toIso8601String(),
                ])
                ->values(),
            'cities' => City::withDeleted()
                ->orderBy('name')
                ->get()
                ->map(fn (City $city) => [
                    'id' => $city->id,
                    'name' => $city->name,
                    'is_deleted' => $city->is_deleted,
                    'created_at' => $city->created_at?->toIso8601String(),
                ])
                ->values(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', Rule::unique('subjects', 'name')],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        Subject::create([...$validated, 'is_deleted' => false]);

        return back()->with('success', 'Mata pelajaran berhasil ditambahkan.');
    }

    public function update(Request $request, Subject $subject): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:100', Rule::unique('subjects', 'name')->ignore($subject->id)],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_deleted' => ['sometimes', 'boolean'],
        ]);

        $subject->forceFill($validated)->save();

        return back()->with('success', 'Mata pelajaran berhasil diperbarui.');
    }

    public function destroy(Subject $subject): RedirectResponse
    {
        $subject->softDelete();

        return back()->with('success', 'Mata pelajaran berhasil dihapus.');
    }
}
