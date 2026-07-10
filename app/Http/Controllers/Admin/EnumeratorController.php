<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Village;
use App\Models\QuestionnaireVersion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class EnumeratorController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('assignedVillages')
            ->where('role', 'enumerator');
            
        if ($request->filled('search')) {
            $query->where('name', 'like', "%" . $request->search . "%")
                  ->orWhere('email', 'like', "%" . $request->search . "%");
        }

        $enumerators = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();
        $villages = Village::with('district.city')->orderBy('name')->get();
        $versions = QuestionnaireVersion::orderBy('created_at', 'desc')->get(['id', 'version_code', 'title']);

        return Inertia::render('Admin/Enumerators/Index', [
            'enumerators' => $enumerators,
            'villages' => $villages,
            'versions' => $versions,
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'version_id' => 'required|exists:questionnaire_versions,id',
            'village_ids' => 'array',
            'village_ids.*' => 'exists:villages,id',
        ]);

        DB::beginTransaction();

        try {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'enumerator',
                'is_active' => true,
            ]);

            // Assign villages if provided
            if (!empty($validated['village_ids'])) {
                $version = QuestionnaireVersion::find($validated['version_id']);
                if ($version) {
                    foreach ($validated['village_ids'] as $villageId) {
                        \App\Models\EnumeratorVillage::create([
                            'user_id' => $user->id,
                            'village_id' => $villageId,
                            'version_id' => $version->id,
                            'created_at' => now(),
                        ]);
                    }
                }
            }

            DB::commit();
            return redirect()->route('admin.enumerators.index')->with('success', 'Akun enumerator berhasil dibuat.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Illuminate\Support\Facades\Log::error("Failed to store enumerator: " . $e->getMessage() . "\n" . $e->getTraceAsString());
            return redirect()->back()->with('error', 'Gagal membuat akun: ' . $e->getMessage());
        }
    }

    public function update(Request $request, User $enumerator)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($enumerator->id)],
            'password' => 'nullable|string|min:8',
            'version_id' => 'required|exists:questionnaire_versions,id',
            'village_ids' => 'array',
            'village_ids.*' => 'exists:villages,id',
        ]);

        DB::beginTransaction();

        try {
            $updateData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
            ];

            if (!empty($validated['password'])) {
                $updateData['password'] = Hash::make($validated['password']);
            }

            $enumerator->update($updateData);

            // Sync villages if provided
            $version = QuestionnaireVersion::find($validated['version_id']);
            if ($version && isset($validated['village_ids'])) {
                \App\Models\EnumeratorVillage::where('user_id', $enumerator->id)
                    ->delete();

                foreach ($validated['village_ids'] as $villageId) {
                    \App\Models\EnumeratorVillage::create([
                        'user_id' => $enumerator->id,
                        'village_id' => $villageId,
                        'version_id' => $version->id,
                        'created_at' => now(),
                    ]);
                }
            }

            DB::commit();
            return redirect()->route('admin.enumerators.index')->with('success', 'Data enumerator berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Illuminate\Support\Facades\Log::error("Failed to update enumerator: " . $e->getMessage() . "\n" . $e->getTraceAsString());
            return redirect()->back()->with('error', 'Gagal memperbarui data: ' . $e->getMessage());
        }
    }

    public function destroy(User $enumerator)
    {
        if ($enumerator->role !== 'enumerator') {
            return redirect()->back()->withErrors(['error' => 'Aksi tidak diizinkan.']);
        }
        
        $enumerator->delete();
        return redirect()->route('admin.enumerators.index')->with('success', 'Akun enumerator berhasil dihapus.');
    }
}
