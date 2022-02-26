<?php

namespace App\Classes\Memes;


use Exception;
use Illuminate\Support\Facades\Storage;

class MemeUpload
{

  /**
   * uploadFiles
   *Save uploaded files in local folder.
   * @return array with the files' path.
   */
  public static function uploadFiles(array $files)
  {
    try {
      $uploads_dir = 'memes';
      // $dir_path = $_SERVER['DOCUMENT_ROOT'] . '/' . $uploads_dir;
      $paths = [];
      foreach ($files as $name => $file) {
        if (str_contains($file, "localhost")) {
          $paths[$name] = $file;
        } else {
          $dateObj = date_create();
          $timeStap = date_timestamp_get($dateObj);
          if (str_contains($file, "data:image/png;base64")) {
            $file = str_replace('data:image/png;base64,', '', $file);
            $file = base64_decode($file);
          } else
            $file = file_get_contents($file);
          $randon_str =
            substr(str_shuffle('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'), 1, 10);
          $filename = $timeStap . $randon_str . ".png";
          $memeImgPath = $uploads_dir . "/" . $filename;
          if (Storage::disk("s3")->put($memeImgPath, $file))
            $paths[$name] = Storage::disk('s3')->url($memeImgPath);
          else
            return null;
          //file_put_contents($memeImgPath, $file);
          // $paths[$name] = "https://funny-stack.herokuapp.com/" . $uploads_dir . "/" . $filename;
        }
      }
      return $paths;
    } catch (Exception $err) {
      http_response_code(500);
      exit($err->getMessage());
    } finally {
      $dateObj = null;
    }
  }
}
