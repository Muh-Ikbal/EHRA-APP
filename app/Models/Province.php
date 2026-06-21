<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'kemendagri_code'
    ];

    public function cities()
    {
        return $this->hasMany(City::class);
    }
}
