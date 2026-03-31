<?php

namespace App\Http\Controllers;
use App\Models\User;

class UserController extends Controller
{
    public function index () {
        $user = User::where('role', '!=', 'admin')->get();
        return response()->json(['status' => 200, 'data' => $user]);
    }

    public function getNewUsers() {
        $newUsers = User::where('role', '!=', 'admin')
            ->where('created_at', '>=', now()->subWeek())
            ->count();
        return response()->json(['status' => 200, 'data' => $newUsers]);
    }
}
