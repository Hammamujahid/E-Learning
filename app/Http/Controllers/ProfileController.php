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
            $request->filled('user_id'),
            fn($q) => $q->where('user_id', $request->user_id)
        );

        return response()->json(['status' => 200, 'data' => $profiles->get()]);
    }

    public function show($id)
    {
        $profile = Profile::findOrFail($id);

        if (!$profile) {
            return response()->json(['status' => 404, 'message' => 'Profile not found']);
        }

        return response()->json(['status' => 200, 'data' => $profile]);
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

        $profile->user->update(['name' => $request->name]);

        return response()->json([
            'data' => $profile->load('user'),
        ]);
    }

    public function destroy($id)
    {
        $profile = Profile::findOrFail($id);

        if (!$profile) {
            return response()->json(['status' => 404, 'message' => 'Profile not found']);
        }

        $profile->delete();

        return response()->json(['status' => 200, 'message' => 'Profile deleted successfully']);
    }
}
