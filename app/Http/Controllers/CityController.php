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
            fn($q) => $q->where('is_deleted', false)
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(city $city)
    {
        //
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
    public function update(Request $request, city $city)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(city $city)
    {
        //
    }
}
