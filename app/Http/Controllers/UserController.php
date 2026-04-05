<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    public function index()
    {
        $user = User::where('role', '!=', 'admin')->get();
        return response()->json(['status' => 200, 'data' => $user]);
    }

    public function latest()
    {
        $newUsers = User::where('role', '!=', 'admin')
            ->where('created_at', '>=', now()->subWeek())
            ->count();
        return response()->json(['status' => 200, 'data' => $newUsers]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'string', 'in:user,teacher,admin'],
            'city_id' => ['nullable', 'exists:cities,id'],
            'fullname' => ['nullable', 'string', 'max:50'],
            'birth_date' => ['nullable', 'date'],
            'phone_number' => ['nullable', 'string', 'max:15'],
            'gender' => ['nullable', 'in:male,female'],
            'is_deleted' => ['nullable', 'boolean'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role
        ]);

        $user->profile()->create([
            'fullname' => $request->fullname,
            'city_id' => $request->city_id,
            'birth_date' => $request->birth_date,
            'phone_number' => $request->phone_number,
            'gender' => $request->gender,
            'is_deleted' => $request->is_deleted
        ]);

        return response()->json([
            'status' => 200,
            'data' => $user->load('profile')
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:20',
            'role' => 'sometimes|required|in:student,teacher',
        ]);

        $user->update($validatedData);

        return response()->json(['status' => 200, 'data' => $user]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        $user->delete();

        return response()->json(['status' => 200, 'message' => 'User deleted successfully']);
    }
}
