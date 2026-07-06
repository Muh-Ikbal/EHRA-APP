<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RiskAspectCategory extends Model
{
    protected $table = 'risk_aspect_categories';

    protected $fillable = [
        'category_name',
        'lower_bound',
        'upper_bound',
        'color',
    ];

    protected $casts = [
        'lower_bound' => 'integer',
        'upper_bound' => 'integer',
    ];
}
