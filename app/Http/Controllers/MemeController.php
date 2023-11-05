<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Meme;
use App\Classes\Memes\Test;
use App\Classes\Memes\MemeUpload;
use App\Classes\Utils;
use App\Models\Upvote;
use Exception;
use Illuminate\Support\Facades\Storage;

class MemeController extends Controller
{


    /**
     * create
     *This function is used to handle user's new meme and its data.
     * @param  mixed $request - the request object which contains the meme data
     * @return string - json: if succeeded, an array with meme data, otherwise an error massage.
     */
    public function create(Request $request)
    {
        try {

            $memeData = $request->all();
            if (isset($memeData["memeTitle"])) {
                if (isset($memeData["memeOriginImage"])) {
                    $paths = ["memeOriginImage" => $memeData["memeOriginImage"]];
                    if (isset($memeData["memeImage"]))
                        $paths["memeImage"] = $memeData["memeImage"];
                    $paths = MemeUpload::uploadFiles($paths);
                    if (!count($paths)) {
                        http_response_code(500);
                        return response()->json("Image could not be saved", 500, ["Content-type" => "application/json"]);
                    }
                    $memeData["memeOriginImage"] = $paths["memeOriginImage"];
                    if (isset($paths["memeImage"]))
                        $memeData["memeImage"] =  $paths["memeImage"];
                    if (isset($memeData["memeTexts"])) {
                        $memeData["memeTexts"] = json_encode($memeData["memeTexts"]);
                    }
                    $meme = Meme::create($memeData);
                    if ($meme) {
                        $meme["upvotes"] = 0;
                        $meme["memeTexts"] = json_decode($meme["memeTexts"], true);
                        return response()->json(
                            json_encode($meme),
                            201,
                            ["Content-type" => "application/json"]
                        );
                    }
                    return response()->json("Meme could not be saved", 500, ["Content-type" => "application/json"]);
                }
                return response()->json("Meme image is missing", 400, ["Content-type" => "application/json"]);
            }
            return response()->json("Meme title is missing", 400, ["Content-type" => "application/json"]);
        } catch (Exception $err) {
            return response()->json("Error creating meme", 500, ["Content-type" => "application/json"]);
        }
    }

    /**
     * getUserMemes
     * getting a 30 memes of a user. 
     * @param  mixed $userId the id of the selected user
     * @param  mixed $index - determines the starting index from the memes table. index >= 1
     * @return string json array with the user memes, error message if failed.
     */
    public function getUserMemes($userId)
    {
        try {
            $usersMemes = Meme::selectRaw("memes.*, COUNT(upvotes.memeId) AS upvotes, users.displayName AS userDisplayName")->where("memes.userId", $userId)->groupBy("memes.memeId")->leftJoin("upvotes", "memes.memeId", "=", "upvotes.memeId")->leftJoin("users", "memes.userId", "=", "users.userId")->paginate(30);
            if ($usersMemes) {
                foreach ($usersMemes as $meme) {
                    $meme["memeTexts"] = json_decode($meme["memeTexts"], true);
                }
                return response()->json(
                    json_encode($usersMemes),
                    200,
                    ["Content-type" => "application/json"]
                );
            }
        } catch (Exception $err) {
            return response()->json("Error getting memes", 500, ["Content-type" => "application/json"]);
        }
    }



    /**
     *Get 30 latest memes
     */
    public function getLastMemes()
    {
        try {
            $lastMemes = Meme::selectRaw("memes.*, COUNT(upvotes.memeId) AS upvotes, users.displayName AS userDisplayName")->leftJoin("upvotes", "memes.memeId", "=", "upvotes.memeId")->leftJoin("users", "memes.userId", "=", "users.userId")->groupBy("memeId")->orderBy('created_at', 'desc')->paginate(30);
            if ($lastMemes) {
                foreach ($lastMemes as $meme) {
                    $meme["memeTexts"] = json_decode($meme["memeTexts"], true);
                }
                return response()->json(
                    json_encode($lastMemes),
                    200,
                    ["Content-type" => "application/json"]
                );
            }
        } catch (Exception $err) {
            return response()->json("Error getting memes", 500, ["Content-type" => "application/json"]);
        }
    }


    /**
     * updateMeme
     *Update user existing meme
     * @param   $memeId - ID of the selected meme
     * @return string - json: array of the updated meme data, error message if failed
     */
    function updateMeme($memeId)
    {
        try {
            $memeData = json_decode(file_get_contents("php://input"), true);
            if ($memeData) {
                $meme = Meme::where("memeId", $memeId);
                if ($meme) {
                    $memeRecord = $meme->get()[0];
                    $paths = [];
                    if (isset($memeData["memeOriginImage"]))
                        $paths["memeOriginImage"] = $memeData["memeOriginImage"];
                    if (isset($memeData["memeImage"]))
                        $paths["memeImage"] = $memeData["memeImage"];
                    $paths = MemeUpload::uploadFiles($paths);
                    if (isset($paths["memeOriginImage"])) {
                        $memeData["memeOriginImage"] = $paths["memeOriginImage"];
                        $splitFile = explode("/", $memeRecord["memeOriginImage"]);
                        $filename = end($splitFile);;
                        unlink($_SERVER['DOCUMENT_ROOT'] . "/memes/" . $filename);
                    }
                    if (isset($paths["memeImage"])) {
                        $memeData["memeImage"] = $paths["memeImage"];
                        // $splitFile = explode("/", $memeRecord["memeImage"]);
                        // $filename = end($splitFile);
                        // unlink($_SERVER['DOCUMENT_ROOT'] . "/memes/" . $filename);
                    }
                    if ($meme->update($memeData)) {
                        $meme = $meme->get()[0];
                        $meme["memeTexts"] = json_decode($meme["memeTexts"], true);
                        return response()->json(
                            json_encode($meme),
                            200,
                            ["Content-type" => "application/json"]
                        );
                    }
                    return response()->json("Error updating meme", 500, ["Content-type" => "application/json"]);
                }
                return response()->json("Error updating meme", 500, ["Content-type" => "application/json"]);
            }
            return response()->json("Meme data is missing", 400, ["Content-type" => "application/json"]);
        } catch (Exception $err) {
            return response()->json("Error updating meme", 500, ["Content-type" => "application/json"]);
        }
    }


    /**
     * deleteMeme - delete a meme record
     *
     * @param $memeId - an id of the meme record
     * @return void
     */
    function deleteMeme($memeId)
    {
        try {
            $meme = Meme::where("memeId", $memeId);
            $memeImage = $meme->get()[0]->memeImage;
            Storage::disk("s3")->delete($memeImage);
            $meme->delete();
            if ($meme) {
                return response()->json(
                    json_encode($meme),
                    202,
                    ["Content-type" => "application/json"]
                );
            }
            return response()->json("Meme could not be deleted", 500, ["Content-type" => "application/json"]);
        } catch (Exception $err) {
            return response()->json("Error deleting meme", 500, ["Content-type" => "application/json"]);
        }
    }



    /**
     * getting a meme data by its id
     * @param  int $memeId - an id of the requested meme
     * @return string json - meme data in json object
     */
    function getMeme($memeId)
    {
        try {
            $meme = Meme::selectRaw("memes.*, COUNT(upvotes.memeId) AS upvotes, users.displayName AS userDisplayName")->where("memes.memeId", $memeId)->leftJoin("upvotes", "memes.memeId", "=", "upvotes.memeId")->leftJoin("users", "memes.userId", "=", "users.userId")->groupBy("memes.memeId")->get()[0];
            if ($meme) {
                $meme["memeTexts"] = json_decode($meme["memeTexts"], true);
                return response()->json(
                    json_encode($meme),
                    200,
                    ["Content-type" => "application/json"]
                );
            }
            return response()->json("Meme could not be fetched", 500, ["Content-type" => "application/json"]);
        } catch (Exception $err) {
            return response()->json("Error getting meme", 500, ["Content-type" => "application/json"]);
        }
    }

    /**
     * Get memes list sorted by upvotes amount.
     */
    function getPopularMemes()
    {
        try {
            $memes = Meme::selectRaw("memes.*, COUNT(upvotes.memeId) AS upvotes,users.displayName AS userDisplayName")->leftJoin("upvotes", "memes.memeId", "=", "upvotes.memeId")->leftJoin("users", "memes.userId", "=", "users.userId")->groupBy("memeId")->orderBy("upvotes", "desc")->paginate(30);
            if ($memes) {
                foreach ($memes as $meme) {
                    $meme["memeTexts"] = json_decode($meme["memeTexts"], true);
                }
            }
            return response()->json(
                json_encode($memes),
                200,
                ["Content-type" => "application/json"]
            );
        } catch (Exception $err) {
            return response()->json("Error getting popular memes", 500, ["Content-type" => "application/json"]);
        }
    }

    /**
     * Returns a memes list with title that contains the title search input.
     */
    function searchMemes()
    {
        try {
            $memeTitle = request("title");
            if ($memeTitle) {
                $memes = Meme::selectRaw("memes.*, COUNT(upvotes.memeId) AS upvotes, users.displayName AS userDisplayName")->where("memeTitle", "like", "%$memeTitle%")->leftJoin("upvotes", "memes.memeId", "=", "upvotes.memeId")->leftJoin("users", "memes.userId", "=", "users.userId")->groupBy("memeId")->paginate(30);
                foreach ($memes as $meme) {
                    $meme["memeTexts"] = json_decode($meme["memeTexts"], true);
                }
                return response()->json(
                    json_encode($memes),
                    200,
                    ["Content-type" => "application/json"]
                );
            }
            return response()->json(
                "Meme id is missing",
                400,
                ["Content-type" => "application/json"]
            );
        } catch (Exception $err) {
            return response()->json("Error searching memes", 500, ["Content-type" => "application/json"]);
        }
    }
    /**
     * Get memes list sorted by upvotes amount.
     */
    function getUserTopMemes(Request $request)
    {
        try {
            $userId = $request->get("userId");
            if ($userId) {
                $memes = Meme::selectRaw("memes.*, COUNT(upvotes.memeId) AS upvotes,users.displayName AS userDisplayName")->where("memes.userId", $userId)->leftJoin("upvotes", "memes.memeId", "=", "upvotes.memeId")->leftJoin("users", "memes.userId", "=", "users.userId")->groupBy("memeId")->orderBy("upvotes", "desc")->take(3)->get();
                if ($memes) {
                    foreach ($memes as $meme) {
                        $meme["memeTexts"] = json_decode($meme["memeTexts"], true);
                    }
                }
                return response()->json(
                    json_encode($memes),
                    200,
                    ["Content-type" => "application/json"]
                );
            }
            return response()->json("Meme data is missing", 400, ["Content-type" => "application/json"]);
        } catch (Exception $err) {
            return response()->json("Error getting popular memes", 500, ["Content-type" => "application/json"]);
        }
    }
}
