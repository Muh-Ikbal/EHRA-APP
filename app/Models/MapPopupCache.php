<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MapPopupCache extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'map_popup_cache';

    public $timestamps = false;

    protected $fillable = [
        'village_id',
        'version_id',
        'popup_data',
        'cached_at',
    ];

    protected function casts(): array
    {
        return [
            'popup_data' => 'array',
            'cached_at' => 'datetime',
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
