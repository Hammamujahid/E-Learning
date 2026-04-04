<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function index(Request $request)
    {
        $profiles = Profile::query();

        $profiles->when(
            $request->has('is_deleted'),
            fn($q) => $q->where('is_deleted', $request->boolean('is_deleted')),
        );

        $profiles->when(
            $request->filled('user_id'),
            fn($q) => $q->where('user_id', $request->user_id)
        );

        $profiles->when(
            $request->boolean('user'),
            fn($q) => $q->with('user')
        );

        $profiles->when(
            $request->boolean('city'),
            fn($q) => $q->with('city')
        );

        $profiles->whereHas('user', function ($q) {
            $q->where('role', '!=', 'admin');
        });

        return response()->json(['status' => 200, 'data' => $profiles->get()]);
    }

    public function show(Request $request, $id)
    {
        $query = Profile::query();


        $query->when(
            $request->boolean('user'),
            fn($q) => $q->with('user')
        );

        $query->when(
            $request->boolean('city'),
            fn($q) => $q->with('city')
        );

        $profile = $query->findOrFail($id);


        return response()->json([
            'status' => 200,
            'data' => $profile
        ]);
    }

    public function update(Request $request, $id)
    {
        $profile = Profile::findOrFail($id);

        $validatedData = $request->validate([
            'city_id' => 'sometimes|required|exists:cities,id',
            'fullname' => 'sometimes|required|string|max:50',
            'birth_date' => 'sometimes|required|date',
            'phone_number' => 'sometimes|required|string|max:15',
            'gender' => 'sometimes|required|in:male,female',
            'is_deleted' => 'sometimes|required|boolean',
        ]);

        $profile->update($validatedData);

        if ($request->has('name')) {
            $profile->user->update([
                'name' => $request->name,
                'email' => $request->email,
                'role' => $request->role
            ]);
        }

        return response()->json([
            'data' => $profile->load('user'),
        ]);
    }

    public function destroy($id)
    {
        $profile = Profile::findOrFail($id);

        $profile->delete();

        return response()->json(['status' => 200, 'message' => 'Profile deleted successfully']);
    }
}
