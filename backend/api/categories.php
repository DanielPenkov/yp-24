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
  "name": "Savings",
  "type": "savings",
  "target": "12,000 BGN",
  "current_value": "7,000 BGN",
  "data": [
    {
        "month": "January",
        "value": "7,000 BGN"
    },
    {
        "month": "February",
        "value": "7,000 BGN"
    }
  ]
}';

// Set the Content-Type header to application/json
header('Content-Type: application/json');

// Output the JSON data
echo $data;
