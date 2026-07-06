<?php

namespace App\Http\Controllers;

use App\Models\RiskAspectCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RiskAspectCategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = RiskAspectCategory::query();
        
        if ($request->filled('search')) {
            $query->where('category_name', 'like', "%" . $request->search . "%");
        }

        $categories = $query->orderBy('lower_bound', 'asc')->paginate(10)->withQueryString();

        return Inertia::render('Admin/RiskCategories/Index', [
            'categories' => $categories,
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_name' => 'required|string|max:255',
            'lower_bound' => 'required|integer|min:0',
            'upper_bound' => 'required|integer|gte:lower_bound',
            'color' => 'required|string|max:7',
        ]);

        RiskAspectCategory::create($validated);

        return redirect()->route('admin.risk-categories.index')->with('success', 'Kategori risiko berhasil ditambahkan.');
    }

    public function update(Request $request, RiskAspectCategory $riskCategory)
    {
        $validated = $request->validate([
            'category_name' => 'required|string|max:255',
            'lower_bound' => 'required|integer|min:0',
            'upper_bound' => 'required|integer|gte:lower_bound',
            'color' => 'required|string|max:7',
        ]);

        $riskCategory->update($validated);

        return redirect()->route('admin.risk-categories.index')->with('success', 'Kategori risiko berhasil diperbarui.');
    }

    public function destroy(RiskAspectCategory $riskCategory)
    {
        $riskCategory->delete();
        return redirect()->route('admin.risk-categories.index')->with('success', 'Kategori risiko berhasil dihapus.');
    }
}
