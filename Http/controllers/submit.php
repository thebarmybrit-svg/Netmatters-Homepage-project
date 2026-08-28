<?php

// 1. Keep using the database connection that you know works
try {
    $dbcontact = new PDO("mysql:host=localhost;dbname=netmatters;charset=utf8", "root", "");
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

require base_path('views/contact/submit.view.php');
