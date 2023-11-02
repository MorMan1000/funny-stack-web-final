<?php

namespace App\Classes\Auth;

use Illuminate\Support\Facades\Mail;
use App\Mail\SendMail;
use App\Mail\VerifyEmail;
use Exception;
use App\Classes\Utils;
use App\Classes\Auth\InvalidFieldsException;
use Illuminate\Support\Facades\Log;
use stdClass;

class SignUp
{

  /**
   * validateSignUp
   *Make sure all user data is valid setisfies the requirements of the website. if ther's invalid input the script is terminated.
   * @param  array $user - the data that the user enteren in the signup form. 
   */
  public static function validateSignUp(array $user)
  {
    $errorMsg = "";
    if (!isset($user["userEmail"]))
      $errorMsg .= "Email is missing \n";
    else {
      $user["userEmail"] = Utils::testInput($user["userEmail"]);
      if (!filter_var($user["userEmail"], FILTER_VALIDATE_EMAIL)) { //Checking if the email is in correct format.
        $errorMsg .= 'Email is invalid \n';
      }
    }
    if (!isset($user["displayName"]))
      $errorMsg .= "Display is missing \n";
    else {
      $user["displayName"] = Utils::testInput($user["displayName"]);
      if (!preg_match("/^[\w]{2,15}([\s][\w]{1,15})?$/", $user["displayName"])) { // Checking if the display name consists only of letters and numbers, has one or 2 words in length of 2-15 characters for the first and 1-15 for the second.
        $errorMsg .= 'Display name is invalid \n';
      }
    }
    if (!isset($user["userPassword"]))
      $errorMsg .= "Password is missing \n";
    else {
      $user["userPassword"] = Utils::testInput($user["userPassword"]);
      if (!preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[\w!?@#$%^*()<>,;`~]{8,}$/", $user["userPassword"])) { //Checking if the password has at least 8 characters, 1 uppercase leter, 1 lowercase leter and 1 digit.
        $errorMsg .= 'Password is invalid';
      }
    }
    if ($errorMsg)
      throw new InvalidFieldsException($errorMsg);
  }

  /**
   * This function send mail to a user
   * @param  $user - The user object
   * @param  string $redirect - link address to redirect in the message
   * @param  string $verficationHash - hash key to verify the user after redirection
   */
  public static function sendMail($user, $redirect, $verficationHash)
  {
    try {
      $verifyLink = $redirect . $user->userId . "/" .  $verficationHash;
      $details = [
        'name' => $user->displayName,
        'verify-link' => $verifyLink,
        'subject' => "Funny Stack Account Verification"
      ];
      $sendMail = new SendMail($details, "emails.VerificationMail");
      Mail::to($user["userEmail"])->send($sendMail);
    } catch (Exception $e) {
      Log::error($e);
      return response()->json($e->getMessage(), 500, ["Content-type" => "application/json"]);
    }
  }
}
