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
        'risk_weight',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_risk_flag' => 'boolean',
            'risk_weight' => 'decimal:2',
        ];
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
