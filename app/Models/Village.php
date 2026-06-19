<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Village extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'district_id',
        'name',
        'status',
        'strata',
        'centroid_lat',
        'centroid_lng',
    ];

    protected function casts(): array
    {
        return [
            'strata' => 'integer',
            'centroid_lat' => 'decimal:7',
            'centroid_lng' => 'decimal:7',
        ];
    }

    public function district()
    {
        return $this->belongsTo(District::class);
    }

    public function surveyResponses()
    {
        return $this->hasMany(SurveyResponse::class);
    }

    public function irsResults()
    {
        return $this->hasMany(VillageIrsResult::class);
    }

    public function surveyQuotas()
    {
        return $this->hasMany(VillageSurveyQuota::class);
    }

    public function enumerators()
    {
        return $this->belongsToMany(User::class, 'enumerator_villages', 'village_id', 'user_id')
                    ->withPivot('version_id')
                    ->withTimestamps();
    }

    public function mapPopupCaches()
    {
        return $this->hasMany(MapPopupCache::class);
    }
}
