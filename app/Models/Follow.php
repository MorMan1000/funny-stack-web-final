<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Follow extends Model
{
    protected $table = "follows";
    protected $primaryKey = 'followId';
    public $timestamps = false;
    protected $fillable = ["userId", "followerId"];
}
