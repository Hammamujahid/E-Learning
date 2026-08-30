<?php

namespace App\Http\Controllers;

use App\Models\City;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CityController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', Rule::unique('cities', 'name')],
        ]);

        City::create([...$validated, 'is_deleted' => false]);

        return back()->with('success', 'Kota berhasil ditambahkan.');
    }

    public function update(Request $request, City $city): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:100', Rule::unique('cities', 'name')->ignore($city->id)],
            'is_deleted' => ['sometimes', 'boolean'],
        ]);

        $city->forceFill($validated)->save();

        return back()->with('success', 'Kota berhasil diperbarui.');
    }

    public function destroy(City $city): RedirectResponse
    {
        $city->softDelete();

        return back()->with('success', 'Kota berhasil dihapus.');
    }
}
