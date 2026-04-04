<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
class UserController extends Controller
{
    public function index () {
        $user = User::where('role', '!=', 'admin')->get();
        return response()->json(['status' => 200, 'data' => $user]);
    }

    public function latest() {
        $newUsers = User::where('role', '!=', 'admin')
            ->where('created_at', '>=', now()->subWeek())
            ->count();
        return response()->json(['status' => 200, 'data' => $newUsers]);
    }

    public function update(Request $request, $id) {
        $user = User::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:20',
            'role' => 'sometimes|required|in:student,teacher',
        ]);

        $user->update($validatedData);

        return response()->json(['status' => 200, 'data' => $user]);
    }

    public function destroy($id) {
        $user = User::findOrFail($id);

        $user->delete();

        return response()->json(['status' => 200, 'message' => 'User deleted successfully']);
    }
}
