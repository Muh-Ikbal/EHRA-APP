<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionOption extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'question_id',
        'option_value',
        'option_label',
        'sort_order',
        'is_risk_flag',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_risk_flag' => 'boolean',
        ];
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
