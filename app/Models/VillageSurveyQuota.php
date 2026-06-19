<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VillageSurveyQuota extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'village_survey_quota';

    protected $fillable = [
        'village_id',
        'version_id',
        'max_respondents',
        'current_count',
        'is_locked',
        'locked_at',
    ];

    protected function casts(): array
    {
        return [
            'max_respondents' => 'integer',
            'current_count' => 'integer',
            'is_locked' => 'boolean',
            'locked_at' => 'datetime',
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
