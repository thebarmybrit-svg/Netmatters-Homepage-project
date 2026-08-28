<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Extract messages if they exist in the flash session
$successMessage = $_SESSION['flash']['successMessage'] ?? null;
$errorMessage = $_SESSION['flash']['errorMessage'] ?? null;
$oldInput = $_SESSION['flash']['old'] ?? [];

// Clear them immediately so they only show once
unset($_SESSION['flash']['successMessage']);
unset($_SESSION['flash']['errorMessage']);
unset($_SESSION['flash']['old']);


require base_path('views/contact/contact-us.view.php');