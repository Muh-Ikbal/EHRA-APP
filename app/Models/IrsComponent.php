<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IrsComponent extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'version_id',
        'key',
        'label',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function version()
    {
        return $this->belongsTo(QuestionnaireVersion::class, 'version_id');
    }

    public function sections()
    {
        return $this->hasMany(Section::class, 'irs_component_id');
    }

    public function irsWeights()
    {
        return $this->hasMany(IrsWeight::class, 'irs_component_id');
    }
}
