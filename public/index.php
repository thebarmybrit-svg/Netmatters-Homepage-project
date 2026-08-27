<?php


if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

const BASE_PATH = __DIR__.'/../';

function base_path($path) {
    return BASE_PATH . $path;
}

// Load dependencies
require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Instantiate the Router BEFORE loading routes
$router = new \Core\Router();

// Load the routes (this injects the definitions into the $router instance above)
require base_path('routes.php');

// Parse the incoming request URL and Method
$uri = parse_url($_SERVER['REQUEST_URI'])['path'];

// Normalize the URI for local subfolder setups
$uri = str_replace('/public', '', $uri); 
if ($uri === '') { 
    $uri = '/'; 
}

$method = $_POST['_method'] ?? $_SERVER['REQUEST_METHOD'];

// Dispatch the route
$router->route($uri, $method);