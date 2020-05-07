<?php 
  require("./config/connection.php");
  require("./action/utilities.php");
  require("./action/users_action.php");
  header('Content-Type: application/json');

  $method = $_SERVER['REQUEST_METHOD'];
  switch ($method) {
    case 'GET':
      parse_str($_SERVER['QUERY_STRING'], $queries);

      if(isset($queries["status"])){
        echo GetUsers::getUsersByStatus($queries["status"]);
      } 
      else {
        echo json_encode(array("error" => "Invalid parameter"));
      }

      break;
    case 'POST':
      $data = json_decode(trim(file_get_contents("php://input")), true);
      
      if($data == NULL){
        echo json_encode(array("error" => "Invalid paramaters"));
        exit();
      }

      $error = array();
      $action = isset($data["action"]) ? $data["action"] : "undefined";
      $email = isset($data["email"]) ? $data["email"] : "undefined";
      $password =  isset($data["password"]) ? $data["password"] : "undefined"; 
     
      if($action === "undefined"){
        array_push($error, "action parameter is undefined");
      }
      if($email === "undefined"){
        array_push($error, "email parameter is undefined");
      }
      if($password === "undefined"){
        array_push($error, "password parameter is undefined");
      }

      if(!empty($error)){
        echo json_encode(array("error" => $error));
        exit();
      }

      $user = new User($email, $password);
      
      if($action === "create"){
        $user->createUser();        
      }else if($action === "login"){
        $user->loginUser();
      }else{
        echo json_encode(array("error" => "Invalid action parameter value, it's either 'create' or 'login' "));
        exit();
      }

      echo $user->getResult();

      break;

    case 'PUT' :
      $data = json_decode(trim(file_get_contents("php://input")), true);

      if($data == NULL){
        echo json_encode(array("error" => "Invalid Parameters"));
        exit();
      }

      if(isset($data["action"]) && isset($data["user_id"])){
        $blockUnblockUser = new BlockUnblockUser($data["action"], $data["user_id"]);
        echo $blockUnblockUser->getResult();
      } else {
        http_response_code(400);
        echo json_encode(array("error" => "Invalid Parameters, missing 'action' or 'user_id' paramter"));
      }

      break;

    default:
      echo $method;
      break;
    }
?>