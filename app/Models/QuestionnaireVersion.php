<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionnaireVersion extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'version_code',
        'title',
        'description',
        'valid_from',
        'valid_until',
        'is_active',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'valid_from' => 'date',
            'valid_until' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function irsComponents()
    {
        return $this->hasMany(IrsComponent::class, 'version_id');
    }

    public function sections()
    {
        return $this->hasMany(Section::class, 'version_id');
    }

    public function irsWeights()
    {
        return $this->hasMany(IrsWeight::class, 'version_id');
    }

    public function surveyResponses()
    {
        return $this->hasMany(SurveyResponse::class, 'version_id');
    }
}
