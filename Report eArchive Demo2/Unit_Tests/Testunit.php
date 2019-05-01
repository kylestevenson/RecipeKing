<?php
// Dependencies: CodeIgniter
// Make sure to have the CodeIgniter application folder and the system folder in the root directory when running this code
// Change code in /application/config/routes.php so that it has $route['default_controller'] = 'Testunit';
// This file should live in /application/controllers
defined('BASEPATH') OR exit('No direct script access allowed');
require("callAPI.php");

class Testunit extends CI_Controller {
        public function __construct()
        {
            parent::__construct();
			$this->load->library("unit_test");  // Load the unit test library
        }
        public function api_accessor($API_id, $API_key, $ingredients){  // For calling the API
            $query = implode(",", $ingredients); // Convert to string
            return $get_data = callAPI('GET', "https://api.edamam.com/search?q=".$query."&".$API_id."&".$API_key, false);  // Code to test
        }
		public function index(){  // Test function
			echo "Using Unit Test Library";
            $ingredients = ['fish', 'chips'];  // Example of user input
            // When callAPI is executed, it should always return a string of JSON
            // When no ingredients are given, the result will look like
            //{ "q" : "", "from" : 0, "to" : 10, "params" : { "sane" : [ ], "q" : [ "" ], "app_key" : [ "2b7000bf9e6fd71245369e05bb742915" ], "app_id" : [ "4003cf2f" ] }, "more" : false, "count" : 0, "hits" : [ ] }
            $test = $this->api_accessor($API_id = 'app_id=4003cf2f', $API_key = 'app_key=2b7000bf9e6fd71245369e05bb742915', $ingredients); // Make the call
            $test_name = "API Accessor Test";
            echo $this->unit->run($test, 'is_string', $test_name);  // Test for whether the result is a string
		}
}







?>
