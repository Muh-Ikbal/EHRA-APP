<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnumeratorVillage extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'enumerator_villages';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'village_id',
        'version_id',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
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
