<?php

namespace App\Http\Controllers;

use App\Models\LearningMaterial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
    public function show(Request $request, $id)
    {
        $query = LearningMaterial::query();


        $query->when(
            $request->boolean('subject'),
            fn($q) => $q->with('subject')
        );

        $material = $query->findOrFail($id);


        return response()->json([
            'status' => 200,
            'data' => $material
        ]);
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
    public function update(Request $request, $id)
    {
        $learningMaterial = LearningMaterial::findOrFail($id);

        $request->validate([
            'subject_id'  => 'sometimes|exists:subjects,id',
            'name'        => 'sometimes|string|max:50',
            'created_by'  => 'sometimes|string|max:50',
            'description' => 'nullable|string|max:255',
            'file'        => 'sometimes|file|mimes:pdf,doc,docx,ppt,pptx,xls,xlsx|max:20480',
            'remove_file' => 'sometimes|boolean',
            'is_deleted'  => 'sometimes|boolean',
        ]);

        $data = $request->only(['subject_id', 'name', 'created_by', 'description', 'is_deleted']);

        if ($request->boolean('remove_file') && $learningMaterial->file_path) {
            Storage::disk('public')->delete($learningMaterial->file_path);
            $data['file_path'] = null;
        }

        if ($request->hasFile('file')) {
            if ($learningMaterial->file_path) {
                Storage::disk('public')->delete($learningMaterial->file_path);
            }
            $data['file_path'] = $request->file('file')->store('learning-materials', 'public');
        }

        $learningMaterial->update($data);

        return response()->json([
            'data' => $learningMaterial->load('subject'),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $learningMaterial = LearningMaterial::findOrFail($id);

        $learningMaterial->delete();

        return response()->json(['status' => 200, 'message' => 'Material deleted successfully']);
    }
}
