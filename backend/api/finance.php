<?php
// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

// Sample data
$data = '{
	"name": "Mortgage",
	"type": "loan",
	"target": "90,200 BGN",
	"current_value": "134,200 BGN",
	  "data": [
    {
        "month": "January",
        "value": "134,200 BGN"
    },
    {
        "month": "February",
        "value": "134,200 BGN"
    }
  ]
}';

// Set the Content-Type header to application/json
header('Content-Type: application/json');

// Output the JSON data
echo $data;
