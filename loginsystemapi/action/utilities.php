<?php 

  class Utilities{
    public static function hash($string){
      return password_hash($string, PASSWORD_DEFAULT);
    }
  }

?>