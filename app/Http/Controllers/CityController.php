<?php

namespace App\Http\Controllers;

use App\Models\city;
use Illuminate\Http\Request;

class CityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $cities = City::query();

        $cities->when(
            $request->has('is_deleted'),
            fn($q) => $q->where('is_deleted', $request->boolean('is_deleted')),
        );

        return response()->json(['status' => 200, 'data' => $cities->get()]);
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
            'name' => ['required', 'string', 'max:255'],
            'is_deleted' => ['nullable', 'boolean'],

        ]);

        $city = City::create(
            [
                'name' => $request->name,
                'is_deleted' => $request->is_deleted
            ]
        );

        return response()->json([
            'status' => 200,
            'data' => $city
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $city = City::findOrFail($id);


        return response()->json([
            'status' => 200,
            'data' => $city
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(city $city)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $city = City::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:20',
            'is_deleted'  => 'sometimes|boolean',
        ]);

        $city->update($validatedData);

        return response()->json(['status' => 200, 'data' => $city]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $city = City::findOrFail($id);

        $city->delete();

        return response()->json(['status' => 200, 'message' => 'City deleted successfully']);
    }
}
