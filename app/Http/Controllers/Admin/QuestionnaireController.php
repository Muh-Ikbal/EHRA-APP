<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\QuestionnaireVersion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class QuestionnaireController extends Controller
{
    public function index()
    {
        $versions = QuestionnaireVersion::with('creator:id,name')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Questionnaire/Index', [
            'versions' => $versions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'version_code' => 'required|string|max:20|unique:questionnaire_versions',
            'title' => 'required|string|max:150',
            'description' => 'nullable|string',
            'valid_from' => 'required|date',
            'valid_until' => 'nullable|date|after_or_equal:valid_from',
        ]);

        $validated['created_by'] = Auth::id() ?? \App\Models\User::first()->id; // Fallback if no auth

        // If this is the first version, make it active
        if (QuestionnaireVersion::count() === 0) {
            $validated['is_active'] = true;
        }

        QuestionnaireVersion::create($validated);

        return redirect()->back()->with('success', 'Versi kuesioner berhasil dibuat.');
    }

    public function toggleActive(QuestionnaireVersion $version)
    {
        // Deactivate all others
        QuestionnaireVersion::where('id', '!=', $version->id)->update(['is_active' => false]);
        
        // Activate this one
        $version->update(['is_active' => true]);

        return redirect()->back()->with('success', 'Versi kuesioner berhasil diaktifkan.');
    }

    public function destroy(QuestionnaireVersion $version)
    {
        if ($version->is_active) {
            return redirect()->back()->with('error', 'Tidak dapat menghapus versi yang sedang aktif.');
        }

        $version->delete();

        return redirect()->back()->with('success', 'Versi kuesioner berhasil dihapus.');
    }
}
