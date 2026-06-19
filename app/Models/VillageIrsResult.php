<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VillageIrsResult extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'village_id',
        'version_id',
        'total_respondents',
        'component_scores',
        'components_snapshot',
        'irs_total',
        'risk_category',
        'risk_color',
        'is_published',
        'calculated_at',
    ];

    protected function casts(): array
    {
        return [
            'total_respondents' => 'integer',
            'component_scores' => 'array',
            'components_snapshot' => 'array',
            'irs_total' => 'decimal:2',
            'is_published' => 'boolean',
            'calculated_at' => 'datetime',
        ];
    }

    public function village()
    {
        return $this->belongsTo(Village::class);
    }

    public function version()
    {
        return $this->belongsTo(QuestionnaireVersion::class, 'version_id');
    }
}
