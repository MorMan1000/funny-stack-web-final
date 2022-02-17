<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('auth/signup', 'App\Http\Controllers\UserController@signUp');
Route::post('auth/signin', 'App\Http\Controllers\UserController@signIn');
Route::post('auth/reset-password', 'App\Http\Controllers\UserController@sendPasswordResetLink');
Route::put("auth/update-password", 'App\Http\Controllers\UserController@updatePassword');
Route::put("auth/update-account/{userId}", 'App\Http\Controllers\UserController@updateAccount');

Route::get('auth/sendmail', 'App\Http\Controllers\UserController@sendMail');
Route::put('auth/verify-account/{id}/{hash}', 'App\Http\Controllers\UserController@verifyAccount');
Route::get('memes/search', 'App\Http\Controllers\MemeController@searchMemes');
Route::post('memes/create', 'App\Http\Controllers\MemeController@create');
Route::get('memes/get-user-memes/{userId}', 'App\Http\Controllers\MemeController@getUserMemes');
Route::get('memes/last-memes', 'App\Http\Controllers\MemeController@getLastMemes');
Route::get('memes/upvotes', 'App\Http\Controllers\MemeController@getMemeUpvotes');
Route::get('memes/popular-memes', 'App\Http\Controllers\MemeController@getPopularMemes');
Route::get('memes/user-top-memes', 'App\Http\Controllers\MemeController@getUserTopMemes');
Route::get('memes/{memeId}', 'App\Http\Controllers\MemeController@getMeme');
Route::put(
    'memes/update/{memeId}',
    'App\Http\Controllers\MemeController@updateMeme'
);
Route::delete('memes/delete/{memeId}', "App\Http\Controllers\MemeController@deleteMeme");
Route::post('user/upvote', 'App\Http\Controllers\UserController@upvote');

Route::get('user/upvotes', 'App\Http\Controllers\UserController@getUserUpvotes');
Route::delete('user/upvote/{upvoteId}', 'App\Http\Controllers\UserController@deleteUpvote');
Route::get("users/search", 'App\Http\Controllers\UserController@searchUsers');
Route::post('users/follow', 'App\Http\Controllers\UserController@followUser');
Route::get('user/followers', 'App\Http\Controllers\UserController@getUserFollowings');
Route::delete('users/follow/{followId}', 'App\Http\Controllers\UserController@unfollowUser');
Route::get("users/redirect-to-reset", 'App\Http\Controllers\UserController@redirectToPasswordReset');
Route::get("users/{userId}", 'App\Http\Controllers\UserController@getUserData');
Route::get("test", "App\Http\Controllers\UserController@test");
