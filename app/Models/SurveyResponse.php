<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SurveyResponse extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'version_id',
        'enumerator_id',
        'village_id',
        'respondent_code',
        'respondent_seq',
        'status',
        'gps_lat',
        'gps_lng',
        'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'respondent_seq' => 'integer',
            'gps_lat' => 'decimal:7',
            'gps_lng' => 'decimal:7',
            'submitted_at' => 'datetime',
        ];
    }

    public function version()
    {
        return $this->belongsTo(QuestionnaireVersion::class, 'version_id');
    }

    public function enumerator()
    {
        return $this->belongsTo(User::class, 'enumerator_id');
    }

    public function village()
    {
        return $this->belongsTo(Village::class);
    }

    public function answers()
    {
        return $this->hasMany(Answer::class, 'response_id');
    }
}
