<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

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

try {
    // Construct the DSN dynamically using the environment variables
    $dsn = "mysql:host={$host};dbname={$dbname};charset=utf8";
    
    $dbcontact = new PDO($dsn, $user, $password);
    $dbcontact->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $dbcontact->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

/**
 * HANDLE FORM SUBMISSION (Enquiry Form)
 */
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    
    $name      = strip_tags(trim($_POST['name'] ?? ''));
    $company   = strip_tags(trim($_POST['company'] ?? ''));
    $email     = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $telephone = strip_tags(trim($_POST['telephone'] ?? ''));
    $message   = strip_tags(trim($_POST['message'] ?? ''));
    $marketing = isset($_POST['marketing_preference']) ? 1 : 0;

    if (!empty($name) && !empty($email) && !empty($telephone) && !empty($message)) {
        try {
            $sql = "INSERT INTO inquiries (name, company, email, telephone, message, marketing_preference) 
                    VALUES (:name, :company, :email, :telephone, :message, :marketing)";
            
            $stmt = $dbcontact->prepare($sql);
            $stmt->execute([
                ':name'      => $name,
                ':company'   => $company,
                ':email'     => $email,
                ':telephone' => $telephone,
                ':message'   => $message,
                ':marketing' => $marketing
            ]);

            // Save to session so it survives the redirect
            $_SESSION['flash']['successMessage'] = "Your enquiry has been successfully saved!";
            
            // Redirect immediately to prevent resubmission on refresh
            header('Location: /contact-us#contact-form');
            exit();
            
        } catch (PDOException $e) {
            $_SESSION['flash']['errorMessage'] = "Could not save your enquiry. Please try again.";
        }
    } else {
        $_SESSION['flash']['errorMessage'] = "Please fill in all required fields.";
    }

    // Keep old input values in session so form doesn't wipe clear on structural error
    $_SESSION['flash']['old'] = $_POST;
    header('Location: /contact-us#contact-form');
    exit();
}
