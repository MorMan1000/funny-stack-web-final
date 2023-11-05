<?php

namespace App\Classes\Auth;

use Exception;
use App\Classes\Utils;

class SignIn
{


  /**
   * Verify the credintials provided by the user.
   *
   * @param  array $user - associative array with email and password/token for google auth.
   * @return - upadated user data
   */
  public static function checkUserCredentials($user)
  {
    $error = "";
    if (!isset($user["email"]) && !$user["googleLogin"]) {
      $error .= "Email is missing\n";
    }
    if (!isset($user["password"]) && !$user["googleLogin"]) {
      $error .= "Password is missing";
    } else if ($user["googleLogin"]) {
      $user["email"] = self::isTokenValid($user["access_token"]);
      if (!isset($user["email"]))
        $error = "Email could not be verified";
    }
    if ($error)
      return response()->json($error, 400, ["Content-type" => "application/json"]);
    foreach ($user as $key => $field)
      $user[$key] = Utils::testInput($field);
    return $user;
  }


  /**
   * isTokenValid - verify a google auth token id.
   *
   * @param  string $email - the google account of the user.
   * @param  string $accessToken - the access token associated with the account
   * @return true if verifid, @return false otherwise.
   */
  private static function isTokenValid(string $accessToken)
  {
    try {
      $url = "https://oauth2.googleapis.com/tokeninfo?access_token=" . $accessToken;
      $ch = curl_init();
      curl_setopt($ch, CURLOPT_URL, $url);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
      $resp = curl_exec($ch);
      if ($e = curl_error($ch)) {
        exit($e);
      } else {
        $decoded = json_decode($resp);
        if (isset($decoded->email) && ($decoded->email_verified))
          return $decoded->email;
      }
    } catch (Exception $err) {
      http_response_code(500);
      exit("Error while verifing email: " . $err->getMessage());
    } finally {
      curl_close($ch);
    }
  }
}
