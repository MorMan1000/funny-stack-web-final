<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Upvote extends Model
{
    protected $table = "upvotes";
    protected $primaryKey = 'upvoteId';
    public $timestamps = false;
    protected $fillable = ["userId", "memeId"];
}
