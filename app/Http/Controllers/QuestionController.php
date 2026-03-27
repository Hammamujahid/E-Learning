<?php

namespace App\Http\Controllers;

use App\Models\question;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $questions = question::where('is_deleted', false)->get();
        return response()->json(['status' => 200, 'data' => $questions]);
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(question $question)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(question $question)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, question $question)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(question $question)
    {
        //
    }
}
