<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Province;
use App\Models\City;
use App\Models\District;
use App\Models\Village;
use Illuminate\Support\Facades\Storage;

class LocationController extends Controller
{
    public function index(Request $request)
    {
        $level = $request->query('level', 'province');
        $parentId = $request->query('parent_id');

        $data = [];
        $breadcrumbs = [];

        if ($level === 'province') {
            $data = Province::orderBy('name')->get();
        } elseif ($level === 'city') {
            $province = Province::findOrFail($parentId);
            $data = $province->cities()->orderBy('name')->get();
            $breadcrumbs = [
                ['name' => 'Semua Provinsi', 'level' => 'province', 'parent_id' => null],
                ['name' => $province->name, 'level' => 'city', 'parent_id' => $province->id],
            ];
        } elseif ($level === 'district') {
            $city = City::with('province')->findOrFail($parentId);
            $data = $city->districts()->orderBy('name')->get();
            $breadcrumbs = [
                ['name' => 'Semua Provinsi', 'level' => 'province', 'parent_id' => null],
                ['name' => $city->province->name, 'level' => 'city', 'parent_id' => $city->province->id],
                ['name' => $city->name, 'level' => 'district', 'parent_id' => $city->id],
            ];
        } elseif ($level === 'village') {
            $district = District::with('city.province')->findOrFail($parentId);
            $data = $district->villages()->orderBy('name')->get();
            $breadcrumbs = [
                ['name' => 'Semua Provinsi', 'level' => 'province', 'parent_id' => null],
                ['name' => $district->city->province->name, 'level' => 'city', 'parent_id' => $district->city->province->id],
                ['name' => $district->city->name, 'level' => 'district', 'parent_id' => $district->city->id],
                ['name' => $district->name, 'level' => 'village', 'parent_id' => $district->id],
            ];
        }

        return Inertia::render('Admin/Location/Index', [
            'level' => $level,
            'parentId' => $parentId,
            'locations' => $data,
            'breadcrumbs' => $breadcrumbs,
        ]);
    }

    public function store(Request $request)
    {
        $level = $request->input('level');

        if ($level === 'province') {
            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'kemendagri_code' => 'required'
            ]);
            Province::create($validated);
        } elseif ($level === 'city') {
            $validated = $request->validate([
                'province_id' => 'required|exists:provinces,id',
                'kemendagri_code' => 'required',
                'name' => 'required|string|max:100',
                'type' => 'required|in:kabupaten,kota',
                'geojson' => 'nullable|file|mimes:json,txt',
            ]);

            $path = null;
            if ($request->hasFile('geojson')) {
                $path = $request->file('geojson')->store('geojsons', 'public');
            }

            City::create([
                'province_id' => $validated['province_id'],
                'kemendagri_code' => $validated['kemendagri_code'],
                'name' => $validated['name'],
                'type' => $validated['type'],
                'geojson_path' => $path,
            ]);
        } elseif ($level === 'district') {
            $validated = $request->validate([
                'city_id' => 'required|exists:cities,id',
                'kemendagri_code' => 'required',
                'name' => 'required|string|max:100',
            ]);
            District::create($validated);
        } elseif ($level === 'village') {
            $validated = $request->validate([
                'district_id' => 'required|exists:districts,id',
                'name' => 'required|string|max:100',
                'status' => 'required|in:pedesaan,perkotaan',
                'strata' => 'nullable|integer',
                'kemendagri_code' => 'required',
                'centroid_lat' => 'nullable|numeric',
                'centroid_lng' => 'nullable|numeric',
            ]);
            Village::create($validated);
        }

        return redirect()->back()->with('success', 'Lokasi berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $level = $request->input('level');

        if ($level === 'province') {
            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'kemendagri_code' => 'required',
                

            ]);
            Province::findOrFail($id)->update($validated);
        } elseif ($level === 'city') {
            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'type' => 'required|in:kabupaten,kota',
                'kemendagri_code' => 'required',
                'geojson' => 'nullable|file|mimes:json,txt',
            ]);

            $city = City::findOrFail($id);
            $data = ['name' => $validated['name'], 'type' => $validated['type'],'kemendagri_code'=>$validated['kemendagri_code']];
            
            if ($request->hasFile('geojson')) {
                if ($city->geojson_path) Storage::disk('public')->delete($city->geojson_path);
                $data['geojson_path'] = $request->file('geojson')->store('geojsons', 'public');
            }

            $city->update($data);
        } elseif ($level === 'district') {
            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'kemendagri_code' => 'required',
            ]);
            District::findOrFail($id)->update($validated);
        } elseif ($level === 'village') {
            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'status' => 'required|in:pedesaan,perkotaan',
                'kemendagri_code' => 'required',
                'strata' => 'nullable|integer',
                'centroid_lat' => 'nullable|numeric',
                'centroid_lng' => 'nullable|numeric',
            ]);
            Village::findOrFail($id)->update($validated);
        }

        return redirect()->back()->with('success', 'Lokasi berhasil diperbarui.');
    }

    public function destroy(Request $request, $id)
    {
        $level = $request->input('level');

        if ($level === 'province') {
            Province::findOrFail($id)->delete();
        } elseif ($level === 'city') {
            $city = City::findOrFail($id);
            if ($city->geojson_path) Storage::disk('public')->delete($city->geojson_path);
            $city->delete();
        } elseif ($level === 'district') {
            District::findOrFail($id)->delete();
        } elseif ($level === 'village') {
            Village::findOrFail($id)->delete();
        }

        return redirect()->back()->with('success', 'Lokasi berhasil dihapus.');
    }
}
