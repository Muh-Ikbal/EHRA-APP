<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'section_id',
        'code',
        'question_text',
        'question_type',
        'is_required',
        'is_observation',
        'sort_order',
        'skip_logic',
        'parent_question_id',
    ];

    protected function casts(): array
    {
        return [
            'is_required' => 'boolean',
            'is_observation' => 'boolean',
            'sort_order' => 'integer',
            'skip_logic' => 'array',
        ];
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function parentQuestion()
    {
        return $this->belongsTo(Question::class, 'parent_question_id');
    }

    public function subQuestions()
    {
        return $this->hasMany(Question::class, 'parent_question_id');
    }

    public function options()
    {
        return $this->hasMany(QuestionOption::class);
    }

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }

    public function irsWeights()
    {
        return $this->hasMany(IrsWeight::class);
    }
}
