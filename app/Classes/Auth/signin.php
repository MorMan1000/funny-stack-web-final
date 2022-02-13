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
   * @return void - if cradentials verified, otherise error returned in response.
   */
  public static function checkUserCredentials($user)
  {
    $error = "";
    if (!isset($user["email"])) {
      $error .= "Email is missing\n";
    }
    if (!isset($user["password"]) && !$user["googleLogin"]) {
      $error .= "Password is missing";
    } else if ($user["email"] && $user["googleLogin"]) {
      if (!self::isTokenValid($user["email"], $user["tokenId"]))
        $error = "Email could not be verified";
    }
    if ($error)
      return response()->json($error, 400, ["Content-type" => "application/json"]);
    foreach ($user as $key => $field)
      $user[$key] = Utils::testInput($field);
  }


  /**
   * isTokenValid - verify a google auth token id.
   *
   * @param  string $email - the google account of the user.
   * @param  string $tokenId - the token id associated with the account
   * @return true if verifid, @return false otherwise.
   */
  private static function isTokenValid(string $email, string $tokenId)
  {
    try {
      $url = "https://oauth2.googleapis.com/tokeninfo?id_token=" . $tokenId;
      $ch = curl_init();
      curl_setopt($ch, CURLOPT_URL, $url);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
      $resp = curl_exec($ch);
      if ($e = curl_error($ch)) {
        exit($e);
      } else {
        $decoded = json_decode($resp);
        if (isset($decoded->email) && ($decoded->email_verified))
          return $email == $decoded->email && $decoded->email_verified;
      }
    } catch (Exception $err) {
      http_response_code(500);
      exit("Error while verifing email: " . $err->getMessage());
    } finally {
      curl_close($ch);
    }
  }
}
