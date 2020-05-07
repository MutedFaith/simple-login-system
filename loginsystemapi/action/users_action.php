<?php 
  $conn = Connection::getConnection();
  $hash = array('Utilities', 'hash');

  /* GET USERs */
  class GetUsers{
    public static function getUsersByStatus($status){
      global $conn;
      $result = array();

      $sql = "SELECT users_id, email, DATE_FORMAT(registration_date, '%m-%d-%Y %h:%i %p') AS registration_date
              FROM users
              WHERE status = $status";

      $sqlResult = $conn->query($sql);
      if($sqlResult){
        $data = array();
        while($row = $sqlResult->fetch_assoc()){
          array_push($data, $row);
        }

        $result["result"] = "success";
        $result["data"] = $data;
      } else {
        http_response_code(500);
        $result["result"] = "failed";
        $result["error"] = $conn->error;
      }

      return json_encode($result);
    }
  }

  /* CREATE USER */
  class User {
    private $result = array();
    private $email = "";
    private $password = "";
  
    public function __construct($email, $password) {
      $this->email = $email;
      $this->password = $password;
      $this->validateParameters();
    }

    private function validateParameters() {
      $error = array();
      $status = "success"; 

      if(empty(trim($this->email))){
       $error['email'] = "Email is empty";
       $status = "failed";
      }

      if(empty(trim($this->password))){
        $error['password'] = "Password is empty";
        $status = "failed";
      }

      if($status === "failed"){
        http_response_code(400);
        $this->result["error"] = $error;
      } 

      $this->result["result"] = $status;
    }

    public function createUser(){
      global $conn, $hash;

      if($this->result["result"] === "failed"){
        return;
      }

      if(!$this->isEmailExist()){
        $email = $this->email;
        $passwordHashed = $hash($this->password);
        
        $sql = "INSERT INTO users(email, password, status)
                VALUES('$email', '$passwordHashed', 1)";

        if($conn->query($sql)){
          $this->result["result"] = "success";
        }
        else {
          http_response_code(500);
          $this->result["result"] = "failed";
          $this->result["error"] = $conn->error;
        }
      } else{
        http_response_code(403);
        $this->result["result"] = "failed";
        $this->result["error"] = array("email" => "Email already exist");
      }
    }

    public function loginUser(){
      global $conn, $hash;

      if($this->result["result"] === "failed"){
        return;
      }

      $email = $this->email;
      $password = $this->password;
      
      $sql = "SELECT password, status 
              FROM users 
              WHERE email = '$email'";

      $result = $conn->query($sql);

      if($result){
        if($result->num_rows > 0){
          $row =  $result->fetch_assoc();
          $status = $row["status"];
          $passwordHashed = $row["password"];
          if(password_verify($password, $passwordHashed)){
            if($status){
              $this->result["result"] = "success";
            } else{
              $this->result["result"] = "failed";
              $this->result["error"] = array("email" => "Your account is blocked", "passowrd" => "Your account is blocked");
            }
          } else{
            http_response_code(401);
            $this->result["result"] = "failed";
            $this->result["error"] = array("password" => "Invalid password");
          }
        } else {
          http_response_code(401);
          $this->result["result"] = "failed";
          $this->result["error"] = array("email" => "Invalid email");
        }
      }
      else {
        $this->result["result"] = "failed";
        $this->result["error"] = $conn->error;
      }
    }

    private function isEmailExist(){
      global $conn;

      $email = $this->email;
      $isExist = true;

      $sql = "SELECT users_id 
              FROM users
              WHERE email = '$email'";

      $result = $conn->query($sql);

      if($result->num_rows < 1){
        $isExist = false;
      }

      return $isExist;
    }

    public function getResult(){
      return json_encode($this->result);
    }
  }

   /* BLOCK OR UNBLOCK USER */
  class BlockUnblockUser {
    private $result = array();
    private $user_id = "";
  
    public function __construct($action, $user_id) {
      $this->action = $action;
      $this->user_id = $user_id;
      $this->update();
    }

    private function update() {
      global $conn;

      if($this->isUserExist()){
        $status;

        switch($this->action){
          case "block":
            $status = 0;
            break;
          case "unblock":
            $status = 1;
            break;
          default:
            http_response_code(400);
            $this->result["result"] = "failed";
            $this->result["error"] = "Invalid 'action' parameter value, it must be  'block' or 'unblock'";
            return;
        }


        $sql = "UPDATE users
                SET status = $status
                WHERE users_id = $this->user_id";

        if($conn->query($sql)){
          $this->result["result"] = "success";
        }
        else {
          http_response_code(500);
          $this->result["result"] = "failed";
          $this->result["error"] = $conn->error;
        }
      }else{
        http_response_code(400);
        $this->result["result"] = "failed";
        $this->result["error"] = "This user does not exist";
      }
    }

    private function isUserExist(){
      global $conn;

      $isExist = true;

      $sql = "SELECT users_id 
              FROM users
              WHERE users_id = $this->user_id";

      $result = $conn->query($sql);

      if($result->num_rows < 1){
        $isExist = false;
      }

      return $isExist;
    }

    public function getResult(){
      return json_encode($this->result);
    }
  }
?>