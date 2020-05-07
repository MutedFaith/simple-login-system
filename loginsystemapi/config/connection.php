<?php 

  class Connection{
    private static $servername = "localhost";
    private static $username = "root";
    private static $password = "";
    private static $dbname = "loginsystem";
    
    public static function getConnection(){
      // Create connection
      $conn = mysqli_connect(self::$servername, self::$username, self::$password, self::$dbname);

      // Check connection
      if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
      }

      return $conn;
    }
  }


?>