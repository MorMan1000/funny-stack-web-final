<?php

namespace App\Http\Controllers;

use App\Classes\Auth\InvalidFieldsException;
use App\Models\User;
use App\Models\Meme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Classes\Auth\SignUp;
use App\Classes\Auth\SignIn;
use App\Mail\SendMail;
use App\Classes\Utils;
use App\Models\Follow;
use App\Models\Upvote;
use Exception;

class UserController extends Controller
{
    /**
     * signUp - handling user's request to sign up to the website. User details are saved in the server's database. The request should have  a user display name, email and password (Validaton requirements in validateSignUp function in SignUp class). After saving user's details a verification message sent to the provided email.
     *
     * @param  Request $request -An object with data of the request, including user details.
     * @return string if succeeded an id of the new user otherwise an error message.
     */
    public function signUp(Request $request)
    {
        try {
            $userData = $request->all();
            if (isset($userData["user"])) {
                $user = $userData["user"];
                SignUp::validateSignUp($user);
                $error = "";
                if (User::where('userEmail', '=', $user["userEmail"])->first())
                    $error .= "Email is taken \n";
                if (User::where('displayName', '=', $user["displayName"])->first())
                    $error .= "This display name is taken \n";
                if (!$error) {
                    $password = Utils::hashPassword($user["userPassword"]);
                    $verificationHash = hash('sha256', rand(1, 100000));
                    $userRecord = User::create(['userEmail' => $user["userEmail"], 'displayName' => $user["displayName"], 'userPassword' => $password["userPassword"], 'passwordSalt' =>  $password["passwordSalt"], 'verificationHash' => $verificationHash]);
                    if ($userRecord) {
                        SignUp::sendMail($userRecord, $userData["redirect"], $verificationHash);
                        return response()->json($userRecord->id, 200, ["Content-type" => "application/json"]);
                    }
                }

                return response()->json($error, 400, ["Content-type" => "application/json"]);
            }
            return response()->json("User details are missing", 400, ["Content-type" => "application/json"]);
        } catch (InvalidFieldsException $e) {
            return response()->json($e->getMessage(), 400, ["Content-type" => "application/json"]);
        } catch (Exception $e) {
            return response()->json("Error signing up", 500, ["Content-type" => "application/json"]);
        }
    }


    /**
     * getUserUpvotes - getting a list of memes upvoted by the user
     *
     * @return void
     */
    function getUserUpvotes()
    {
        try {
            $userId = request("userId");
            $upvotedMemes = Upvote::leftJoin("memes", "upvotes.memeId", "=", "memes.memeId")->where("upvotes.userId", $userId)->get();
            if ($upvotedMemes) {
                foreach ($upvotedMemes as $meme) {
                    $meme["memeTexts"] = json_decode($meme["memeTexts"], true);
                }
                return response()->json(
                    json_encode($upvotedMemes),
                    200,
                    ["Content-type" => "application/json"]
                );
            }
            return response()->json("Upvotes could not be retrieved", 500, ["Content-type" => "application/json"]);
        } catch (Exception $err) {
            return response()->json("Error while getting upvotes", 500, ["Content-type" => "application/json"]);
        }
    }


    /**
     * searchUsers - search for users with display name partially matching a given input string.
     *
     * @return void
     */
    function searchUsers()
    {
        try {
            $search_input = htmlspecialchars(request("query"));
            if ($search_input) {
                $users = User::selectRaw("users.userId, users.displayName, COUNT(follows.userId) AS followers")->where("displayName", "like", "%$search_input%")->leftJoin("follows", "follows.userId", "=", "users.userId")->paginate(10);
                foreach ($users as $user) {
                    $user->memes = Meme::where("userId", $user->userId)->count();
                }
                return response()->json(
                    json_encode($users),
                    200,
                    ["Content-type" => "application/json"]
                );
            } else
                return response()->json(
                    "Search input is invalid",
                    400,
                    ["Content-type" => "application/json"]
                );
        } catch (Exception $err) {
            return response()->json("Error while searching users", 500, ["Content-type" => "application/json"]);
        }
    }


    /**
     * save an upvote of a user to selected meme
     *
     * @param  $request - The request should contain a user id and selected meme id
     * @return void
     */
    function upvote(Request $request)
    {
        $upvoteData = $request->all();
        if (isset($upvoteData["userId"]) && isset($upvoteData["memeId"])) {
            $upvote = Upvote::create($upvoteData);
            if ($upvote) {
                return response()->json(
                    $upvote->upvoteId,
                    201,
                    ["Content-type" => "application/json"]
                );
            } else {
                return response()->json(
                    "Upvote could not be updated",
                    500,
                    ["Content-type" => "application/json"]
                );
            }
        }
        return response()->json(
            "Upvote data is missing",
            400,
            ["Content-type" => "application/json"]
        );
    }

    /**
     * delete an upvote of a user to selected meme
     *
     * @param  $upvoteId - The id of the upvote record to delete
     * @return void
     */
    function deleteUpvote($upvoteId)
    {
        if ($upvoteId) {
            Upvote::where("upvoteId", $upvoteId)->delete();
            return response()->json(
                "1",
                200,
                ["Content-type" => "application/json"]
            );
        }
        return response()->json(
            "Upvote id is missing",
            400,
            ["Content-type" => "application/json"]
        );
    }

    /**
     * followUser - save a following of user after another one
     *
     * @param  $request - should contain id of the and id of the user being followed
     * @return void
     */
    function followUser(Request $request)
    {

        $data = $request->all();
        if (isset($data["userId"]) && isset($data["followerId"])) {
            $following = Follow::create($data);
            if ($following) {
                return response()->json(
                    $following->followId,
                    201,
                    ["Content-type" => "application/json"]
                );
            } else {
                return response()->json(
                    "Following could not be updated",
                    500,
                    ["Content-type" => "application/json"]
                );
            }
        }
        return response()->json(
            "Following data is missing",
            400,
            ["Content-type" => "application/json"]
        );
    }


    /**
     * unfollowUser - delete a selected following 
     *
     * @param  $followId - id of the following record to delete
     * @return void
     */
    function unfollowUser($followId)
    {
        try {
            if ($followId) {
                Follow::where("followId", $followId)->delete();
                return response()->json(
                    "1",
                    200,
                    ["Content-type" => "application/json"]
                );
            }
            return response()->json(
                "followId id is missing",
                400,
                ["Content-type" => "application/json"]
            );
        } catch (Exception $err) {
            return response()->json(
                "Error: " . $err->getMessage(),
                500,
                ["Content-type" => "application/json"]
            );
        }
    }

    /**
     * getUserData - get none-confidential details of selected user
     *
     * @param  $userId - id of the selected user
     * @return void
     */
    function getUserData($userId)
    {
        try {
            if ($userId) {
                $userData = User::select("userId", "displayName")->where("userId", $userId)->get()[0];
                $numOfMemes = Meme::where("userId", $userId)->count();
                $numOfFollowers = Follow::where("userId", $userId)->count();
                $userData->memes = $numOfMemes;
                $userData->followers = $numOfFollowers;
                return response()->json(
                    json_encode($userData),
                    200,
                    ["Content-type" => "application/json"]
                );
            }


            return response()->json(
                "user id is missing",
                400,
                ["Content-type" => "application/json"]
            );
        } catch (Exception $err) {
            return response()->json(
                "Error: " . $err->getMessage(),
                500,
                ["Content-type" => "application/json"]
            );
        }
    }

    /**
     * getUserFollowings - get a list of users followed by a selected user
     *
     * @param  $request - should contain selected user id
     * @return void
     */
    function getUserFollowings(Request $request)
    {
        try {
            $userId = $request->get("userId");
            if (isset($userId)) {
                $followers = Follow::selectRaw("followId, follows.userId, users.displayName")->where("followerId", $userId)->leftJoin("users", "follows.userId", "=", "users.userId")->get();
                foreach ($followers as $follower) {
                    $follower->memes = Meme::where("userId", $follower->userId)->count();
                    $follower->followers = Follow::where("userId", $follower->userId)->count();
                }
                if ($followers) {
                    return response()->json(
                        json_encode($followers),
                        200,
                        ["Content-type" => "application/json"]
                    );
                } else {
                    return response()->json(
                        "Following could not be updated",
                        500,
                        ["Content-type" => "application/json"]
                    );
                }
            }
            return response()->json(
                "Following data is missing",
                400,
                ["Content-type" => "application/json"]
            );
        } catch (Exception $err) {
            return response()->json("Error Getting followings", 500, ["Content-type" => "application/json"]);
        }
    }

    /**
     * verifyAccount
     *This function is triggered when user clicked the verification link in their email. If the user id and the hash string match to those provided in the link the user is verified and can login to the website from now on.
     * @param  string $userId - An id of the user
     * @param  string $verificationHash - an hash which is used to verify the user.
     * @return - redirection to the website's home page. The user should be logged in as its details are saved on cookies.
     */
    public function verifyAccount($userId, $verificationHash)
    {
        try {
            $getUser = User::whereraw('userId=? and verificationHash=?', array($userId, $verificationHash))->get();
            if ($getUser) {
                $user = $getUser[0];
                if ($user->isVerified) {
                    return response()->json("Account is already verified", 400, ["Content-type" => "application/json"]);
                }
                $user->isVerified = true;
                $user->save();
                $userDetails = [
                    'displayName' => $user->displayName,
                    'userEmail' => $user->userEmail,
                    'userId' => $user->userId
                ];
                return redirect("https://funny-stack.herokuapp.com")->withCookie(cookie("user-details", json_encode($userDetails), httpOnly: false));
            }
            return response()->json("Account could noe be verified", 400, ["Content-type" => "application/json"]);
        } catch (Exception $e) {
            return response()->json("Error verifying account", 500, ["Content-type" => "application/json"]);
        }
    }


    /**
     * signIn
     *This function is used to sign a user in to the website and email and password (Or token id if they used google auth).
     * @param  Request $request - Object with the request data which has the user credentials
     * @return void
     */
    public function signIn(Request $request)
    {
        try {
            $userData = $request->all();
            if ($userData) {
                $userData["googleLogin"] = isset($userData["tokenId"]);
                SignIn::checkUserCredentials($userData);
                $cols = ["userId", "displayName", "userEmail", "isVerified"];
                if (!$userData["googleLogin"]) {
                    array_push($cols, "userPassword", "passwordSalt");
                }
                $getRecord = User::where("userEmail", "=", $userData["email"])->get($cols);
                if ($getRecord && isset($getRecord[0])) {
                    $user = $getRecord[0];
                    if ($user->isVerified) {
                        if (!$userData["googleLogin"]) {
                            $passwordInput = Utils::hashPassword($userData["password"], $user->passwordSalt)["userPassword"];
                            if ($passwordInput != $user->userPassword)
                                return response()->json("Password is incorrect", 400, ["Content-type" => "application/json"]);
                        }
                        $userDetails = [
                            'displayName' => $user->displayName,
                            'userEmail' => $user->userEmail,
                            'userId' => $user->userId,
                            'googleLogin' => $userData["googleLogin"]
                        ];
                        return response()->json(['success' => $user->userId], 200)->withCookie(cookie("user-details", json_encode($userDetails), httpOnly: false));
                    }
                    return response()->json("User is not verified", 400, ["Content-type" => "application/json"]);
                }
                return response()->json("User is not found", 400, ["Content-type" => "application/json"]);
            }
            return response()->json("Invalid request", 400, ["Content-type" => "application/json"]);
        } catch (Exception $e) {
            return response()->json("Error signing in", 500, ["Content-type" => "application/json"]);
        }
    }



    /**
     * sendPasswordResetLink - Send to user's email a link to reset their password.
     *
     * @param  $request - request should contain the user's email.
     * @return void
     */
    public function sendPasswordResetLink(Request $request)
    {
        try {
            $data = $request->all();
            $verificationHash = hash('sha256', rand(1, 100000));
            $user = User::select("userId")->where("userEmail", $data["userEmail"]);
            if (isset($user) && $user->update(["verificationHash" => $verificationHash]))
                $user = $user->first();
            if ($user) {
                $resetLink = "$data[redirect]?userId=" . $user->userId . '&hash=' . $verificationHash;
                $details = [
                    'resetLink' => $resetLink,
                    'subject' => "Funny Stack Password Reset"
                ];
                $sendMail = new SendMail($details, "emails.ResetPasswordMail");
                Mail::to($data["userEmail"])->send($sendMail);
                return response()->json(['success'], 200);
            }
        } catch (Exception $e) {
            return response()->json("Error signing in", 500, ["Content-type" => "application/json"]);
        }
    }

    /**
     * updatePassword - this function completes the process of resetting user's password, by saving in database the new password sent by the user
     *
     * @param $request  - should contain user id and password
     * @return void
     */
    public function updatePassword(Request $request)
    {
        try {
            $data = $request->all();
            $password = $data["password"];
            $userId = $data["userId"];
            $verificationHash = $data["hash"];
            if ($userId) {
                if ($password) {
                    $hashedPassword = Utils::hashPassword($password);
                    $record = User::select("displayName", "userEmail", "verificationHash")->where("userId", $userId);
                    $user = $record->first();
                    if ($user->verificationHash == $verificationHash)
                        $updated = $record->update(["userPassword" => $hashedPassword["userPassword"], "passwordSalt" => $hashedPassword["passwordSalt"]]);
                    if ($updated)
                        return response()->json(["userId" => $userId, "displayName" => $user->displayName, "userEmail" => $user->userEmail], 200);
                } else {
                    return response()->json("Password is missing", 400, ["Content-type" => "application/json"]);
                }
            } else {
                return response()->json("User id is missing", 400, ["Content-type" => "application/json"]);
            }
        } catch (Exception $err) {
            return response()->json("Error occured while updating password", 500, ["Content-type" => "application/json"]);
        }
    }

    /**
     * updateAccount - This function saves in database a changes in account sent by the user
     *
     * @param  $userId - an id number of the user
     * @return void
     */
    public function updateAccount($userId)
    {
        try {
            if ($userId) {
                $changes = json_decode(file_get_contents("php://input"), true);
                if ($changes) {
                    $user = User::where("userId", $userId)->first();
                    if ($user) {
                        $errors = [];
                        if (isset($changes["displayName"]))
                            if (!User::where('displayName', '=', $changes["displayName"])->first()) {
                                if (preg_match("/^[\w]{2,15}([\s][\w]{1,15})?$/", $changes["displayName"]))
                                    $user->displayName =
                                        $changes["displayName"];
                                else {
                                    array_push($errors, "Display name is not valid");
                                }
                            } else
                                array_push($errors, "Display name is taken");
                        if (isset($changes["userEmail"]))
                            if (filter_var($changes["userEmail"], FILTER_VALIDATE_EMAIL)) {
                                if (!User::where('userEmail', '=', $changes["userEmail"])->first()) {
                                    $details = [
                                        'subject' => "FunnyStack Account - Email Change Notification",
                                        'oldEmail' => $user->userEmail,
                                        'newEmail' => $changes["userEmail"],
                                        'name' => $user->displayName
                                    ];
                                    $sendMail = new SendMail($details, "emails.EmailAddressUpdate");
                                    Mail::to($changes["userEmail"])->send($sendMail);
                                    $user->userEmail = $changes["userEmail"];
                                } else
                                    array_push($errors, "Email is taken");
                            } else {
                                array_push($errors, "Email is invalid");
                            }
                        if (isset($changes["userPassword"]))
                            if (preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[\w!?@#$%^*()<>,;`~]{8,}$/", $changes["userPassword"])) {
                                $hashedPassword = Utils::hashPassword($changes["userPassword"]);
                                $user->userPassword = $hashedPassword["userPassword"];
                                $user->passwordSalt = $hashedPassword["passwordSalt"];
                            } else {
                                array_push($errors, "Password is invalid");
                            }
                        if ($errors)
                            return response()->json($errors, 400, ["Content-type" => "application/json"]);
                        $user->save();
                        return response()->json($user, 200);
                    }
                }
            }
            return response()->json("User id is missing", 400, ["Content-type" => "application/json"]);
        } catch (Exception $err) {
            return response()->json("Error occured while updating the account", 500, ["Content-type" => "application/json"]);
        }
    }

    public function test(Request $request)
    {
        return response()->json([env("MAIL_HOST"), env("MAIL_USERNAME"), env("MAIL_PASSWORD"), env("MAIL_ENCRYPTION"), env("MAIL_PORT")], 200);
    }
}
