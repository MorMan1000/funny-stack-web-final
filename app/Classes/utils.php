<?php

namespace App\Classes;

class Utils
{


  /**
   * This function hashes a given password with a salt.
   *
   * @param  string $password - the password to hash.
   * @param  mixed $passwordSalt - the salt to combine with the password in the hashing algorithm. If null then it will be created randomly in the function.
   * @return array with the hashed password and the salt.
   */
  public static function hashPassword(string $password, string $passwordSalt = null)
  {
    $saltLength = 10;
    if (!$passwordSalt)
      $passwordSalt = substr(str_shuffle('!@#%^?0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'), 1, $saltLength);
    $subIndex = ord($passwordSalt[0]) % strlen($password);
    $p1 = substr($password, 0, $subIndex);
    $p2 = substr($password, $subIndex, strlen($password));
    $saltedPassword = ($p1 . $passwordSalt) ^ $p2;
    $hashedPassword = hash("sha256", $saltedPassword);
    return ["userPassword" => $hashedPassword, "passwordSalt" => $passwordSalt];
  }


  /**
   * test_input
   *remove from string all extra spaces and spacial characters.
   * @param  string $data - the string input
   * @return string - the given string after removing the characters.
   */
  public static function testInput(string $data)
  {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
  }
}
