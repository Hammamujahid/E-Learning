<?php

namespace App\Http\Controllers;

use App\Models\LearningMaterial;
use Illuminate\Http\Request;

class LearningMaterialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $materials = LearningMaterial::query();

        $materials->when(
            $request->has('is_deleted'),
            fn($q) => $q->where('is_deleted', $request->boolean('is_deleted')),
            fn($q) => $q->where('is_deleted', false)
        );

        $materials->when(
            $request->boolean('subject'),
            fn($q) => $q->with('subject')
        );

        return response()->json([
            'status' => 200,
            'data' => $materials->get()
        ]);
    }

    public function latest()
    {
        $newMaterials = LearningMaterial::where('is_deleted', false)
            ->where('created_at', '>=', now()->subWeek())
            ->count();
        return response()->json(['status' => 200, 'data' => $newMaterials]);
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
    public function show(LearningMaterial $learningMaterial)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LearningMaterial $learningMaterial)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, LearningMaterial $learningMaterial)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LearningMaterial $learningMaterial)
    {
        //
    }
}
