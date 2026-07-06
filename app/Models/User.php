<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, HasUuids, Notifiable;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'assigned_city_id',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    // ─── Relationships ───────────────────────────────────────

    public function assignedCity()
    {
        return $this->belongsTo(City::class, 'assigned_city_id');
    }

    public function questionnaireVersions()
    {
        return $this->hasMany(QuestionnaireVersion::class, 'created_by');
    }

    public function surveyResponses()
    {
        return $this->hasMany(SurveyResponse::class, 'enumerator_id');
    }

    public function assignedVillages()
    {
        return $this->belongsToMany(Village::class, 'enumerator_villages', 'user_id', 'village_id')
                    ->using(EnumeratorVillage::class)
                    ->withPivot('version_id');
    }

    // ─── Helpers ─────────────────────────────────────────────

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isEnumerator(): bool
    {
        return $this->role === 'enumerator';
    }
}
