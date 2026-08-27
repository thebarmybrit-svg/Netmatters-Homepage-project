<?php
// Http/controllers/index.php

// You can fetch data or set variables here if needed
$heading = "Welcome to Netmatters Homepage";

// Establish your database connection
try {
    $db = new PDO("mysql:host=localhost;dbname=netmatters;charset=utf8", "root", "");
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