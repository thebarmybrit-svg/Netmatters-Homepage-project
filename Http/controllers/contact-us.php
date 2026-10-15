<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Extract messages and errors if they exist in the flash session
$successMessage = $_SESSION['flash']['successMessage'] ?? null;
$errorMessage   = $_SESSION['flash']['errorMessage'] ?? null;
$errors         = $_SESSION['flash']['errors'] ?? [];
$oldInput       = $_SESSION['flash']['old'] ?? [];

// Clear flash data immediately so messages only show once
unset($_SESSION['flash']['successMessage']);
unset($_SESSION['flash']['errorMessage']);
unset($_SESSION['flash']['errors']);
unset($_SESSION['flash']['old']);

require base_path('views/contact/contact-us.view.php');

?>