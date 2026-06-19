<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'response_id',
        'question_id',
        'answer_value',
        'answer_code',
        'answer_codes',
        'is_flagged_risk',
    ];

    protected function casts(): array
    {
        return [
            'answer_codes' => 'array',
            'is_flagged_risk' => 'boolean',
        ];
    }

    public function response()
    {
        return $this->belongsTo(SurveyResponse::class, 'response_id');
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
