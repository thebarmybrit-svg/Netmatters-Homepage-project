<?php

// You can fetch data or set variables here if needed
$heading = "Welcome to Netmatters Homepage";

/**
 * Simple helper function to load a .env file into $_ENV
 */
function loadEnv($filePath) {
    if (!file_exists($filePath)) {
        return;
    }

    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        // Skip comments
        if (strpos(trim($line), '#') === 0) {
            continue;
        }

        // Split by the first '=' character
        list($name, $value) = explode('=', $line, 2);
        
        $name = trim($name);
        $value = trim($value);

        // Strip optional quotes around values
        $value = trim($value, '"\'');

        $_ENV[$name] = $value;
        putenv("{$name}={$value}");
    }
}

// Load the environment variables (adjust path if your .env is in a different directory)
loadEnv(__DIR__ . '/.env');

// Retrieve the database values from $_ENV
$host     = $_ENV['DB_HOST'] ?? 'localhost';
$dbname   = $_ENV['DB_NAME'] ?? '';
$user     = $_ENV['DB_USER'] ?? '';
$password = $_ENV['DB_PASSWORD'] ?? '';

// Establish your database connection
try {
    // Construct the DSN dynamically using the environment variables
    $dsn = "mysql:host={$host};dbname={$dbname};charset=utf8";
    
    $db = new PDO($dsn, $user, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Query the data from your table
$query = $db->query("SELECT * FROM articles ORDER BY date DESC LIMIT 3");
$articles = $query->fetchAll(); 

// Load your view file
require base_path('views/index.view.php');