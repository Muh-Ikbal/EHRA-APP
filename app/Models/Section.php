<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'version_id',
        'code',
        'title',
        'description',
        'sort_order',
        'is_irs_component',
        'irs_component_id',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_irs_component' => 'boolean',
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

    public function questions()
    {
        return $this->hasMany(Question::class);
    }
}
