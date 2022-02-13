<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meme extends Model
{
    protected $table = "memes";
    protected $primaryKey = 'memeId';
    protected $fillable = [
        'memeImage',
        'memeOriginImage',
        'memeTitle',
        'userId',
        'memeTexts',
        'bottomTextY',
        'textSize',
        'textColor',
        'outlineColor',
    ];
    protected $casts = [
        'created_at' => 'datetime:Y-m-d H:i', 'updated_at' => 'datetime:Y-m-d H:i'
    ];
}
