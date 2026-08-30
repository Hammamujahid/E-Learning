<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Admin-only user management. Role changes are confined to this controller so
 * a user can never alter their own role through the settings screens.
 */
class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::with(['profile.city'])
            ->where('role', '!=', User::ROLE_ADMIN)
            ->orderBy('name')
            ->get()
            ->map(fn (User $user) => $this->presentRow($user))
            ->values();

        return Inertia::render('admin/user', [
            'users' => $users,
            'cities' => City::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function show(User $user): Response
    {
        $user->load(['profile.city']);

        return Inertia::render('profile/detail', [
            'user' => $this->presentRow($user),
        ]);
    }

    public function edit(User $user): Response
    {
        $user->load(['profile.city']);

        return Inertia::render('profile/edit', [
            'user' => $this->presentRow($user),
            'cities' => City::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', Rule::in([User::ROLE_ADMIN, User::ROLE_TEACHER, User::ROLE_USER])],
            'city_id' => ['nullable', 'exists:cities,id'],
            'fullname' => ['nullable', 'string', 'max:100'],
            'birth_date' => ['nullable', 'date'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'gender' => ['nullable', Rule::in(['male', 'female'])],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        $user->profile()->create([
            'fullname' => $validated['fullname'] ?? null,
            'city_id' => $validated['city_id'] ?? null,
            'birth_date' => $validated['birth_date'] ?? null,
            'phone_number' => $validated['phone_number'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'is_deleted' => false,
        ]);

        return redirect()->route('admin.user')->with('success', 'Pengguna berhasil ditambahkan.');
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => ['sometimes', 'required', Rule::in([User::ROLE_ADMIN, User::ROLE_TEACHER, User::ROLE_USER])],
            'city_id' => ['nullable', 'exists:cities,id'],
            'fullname' => ['nullable', 'string', 'max:100'],
            'birth_date' => ['nullable', 'date'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'gender' => ['nullable', Rule::in(['male', 'female'])],
        ]);

        $user->update(array_filter(
            $request->only(['name', 'email', 'role']),
            fn ($value) => $value !== null,
        ));

        $profile = $user->profile ?? $user->profile()->create(['is_deleted' => false]);

        $profile->update([
            'fullname' => $validated['fullname'] ?? $profile->fullname,
            'city_id' => $validated['city_id'] ?? $profile->city_id,
            'birth_date' => $validated['birth_date'] ?? $profile->birth_date,
            'phone_number' => $validated['phone_number'] ?? $profile->phone_number,
            'gender' => $validated['gender'] ?? $profile->gender,
        ]);

        return back()->with('success', 'Pengguna berhasil diperbarui.');
    }

    /**
     * Deactivate or reactivate a user's profile.
     */
    public function toggle(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate(['is_deleted' => ['required', 'boolean']]);

        $profile = $user->profile ?? $user->profile()->create(['is_deleted' => false]);
        $profile->forceFill(['is_deleted' => $validated['is_deleted']])->save();

        return back()->with('success', $validated['is_deleted'] ? 'Pengguna dinonaktifkan.' : 'Pengguna diaktifkan.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($user->id === $request->user()->id) {
            return back()->withErrors(['user' => 'Anda tidak dapat menghapus akun Anda sendiri.']);
        }

        $user->delete();

        return redirect()->route('admin.user')->with('success', 'Pengguna berhasil dihapus.');
    }

    /**
     * @return array<string, mixed>
     */
    protected function presentRow(User $user): array
    {
        /** @var Profile|null $profile */
        $profile = $user->profile;

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'created_at' => $user->created_at?->toIso8601String(),
            'profile' => $profile ? [
                'id' => $profile->id,
                'fullname' => $profile->fullname,
                'birth_date' => $profile->birth_date?->format('Y-m-d'),
                'phone_number' => $profile->phone_number,
                'gender' => $profile->gender,
                'is_deleted' => $profile->is_deleted,
                'city' => $profile->city?->only(['id', 'name']),
                'city_id' => $profile->city_id,
            ] : null,
        ];
    }
}
