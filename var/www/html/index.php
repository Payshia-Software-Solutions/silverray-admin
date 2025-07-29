<?php

// Set CORS headers for every response
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle pre-flight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

ini_set('memory_limit', '256M');

// Report all PHP errors
error_reporting(E_ALL);

// Display errors in the browser (for development)
ini_set('display_errors', 1);

// --- Database Connection ---
require_once __DIR__ . '/config/database.php';
(new Database())->getConnection(); // This sets $GLOBALS['pdo']


// --- Routing ---
require_once __DIR__ . '/routes/web.php';

// Get the requested route from the query parameter, default to '/'
$uri = $_GET['route'] ?? '/';
$method = $_SERVER['REQUEST_METHOD'];

// Set the header for JSON responses
header('Content-Type: application/json');

// Find the handler for the requested route
$handler = $routes["$method $uri"] ?? null;

if ($handler) {
    // Call the handler function
    $handler();
} else {
    // If no route is found, return a 404 error
    http_response_code(404);
    echo json_encode(['error' => 'Route not found']);
}

?>
