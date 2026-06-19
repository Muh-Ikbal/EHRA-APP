<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IrsWeight extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'version_id',
        'irs_component_id',
        'question_id',
        'risk_condition',
        'weight',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'weight' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function version()
    {
        return $this->belongsTo(QuestionnaireVersion::class, 'version_id');
    }

    public function irsComponent()
    {
        return $this->belongsTo(IrsComponent::class, 'irs_component_id');
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
