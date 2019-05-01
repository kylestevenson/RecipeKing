<?php
require("callAPI.php");

$API_id = 'app_id=4003cf2f';
$API_key = 'app_key=2b7000bf9e6fd71245369e05bb742915';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$ingredients = $request->ingredients;
$query = implode(",",$ingredients);  // converts the array into a string

$get_data = callAPI('GET', "https://api.edamam.com/search?q=".$query."&".$API_id."&".$API_key, false);
echo $get_data;
$response = json_decode($get_data, true);
//echo $response[0]->hits

?>
