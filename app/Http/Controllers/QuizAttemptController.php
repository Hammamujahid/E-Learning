<?php

namespace App\Http\Controllers;

use App\Models\quiz_attempt;
use Illuminate\Http\Request;

class QuizAttemptController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'learning_material_id' => 'required|exists:learning_materials,id',
            'user_id'              => 'required|exists:users,id',
            'score'                => 'required|numeric|min:0|max:100',
        ]);

        $data = [
            'learning_material_id' => $request->learning_material_id,
            'user_id'              => $request->user_id,
            'score'                => $request->score,
            'is_deleted'            => false,
        ];

        $quizAttempt = quiz_attempt::create($data);
        return response()->json(['status' => 200, 'data' => $quizAttempt]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $query = quiz_attempt::query();

        $quiz_attempt = $query->findOrFail($id);


        return response()->json([
            'status' => 200,
            'data' => $quiz_attempt
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(quiz_attempt $quiz_attempt)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, quiz_attempt $quiz_attempt)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(quiz_attempt $quiz_attempt)
    {
        //
    }
}
