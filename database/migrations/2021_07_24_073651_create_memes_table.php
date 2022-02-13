<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMemesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('memes', function (Blueprint $table) {
            $table->increments('memeId');
            $table->string('memeImage')->default('');
            $table->string('memeOriginImage');
            $table->string('memeTitle');
            $table->longText("memeTexts");
            $table->double('textSize');
            $table->string('textColor');
            $table->string('outlineColor');
            $table->unsignedInteger('userId');
            $table->foreign('userId')->references('userId')->on('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('memes');
    }
}
