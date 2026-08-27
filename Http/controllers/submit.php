<?php

// 1. Keep using the database connection that you know works
try {
    $dbcontact = new PDO("mysql:host=localhost;dbname=articles;charset=utf8", "root", "");
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
            // 2. CHANGE THIS: Point to 'inquiries' instead of 'contacts'
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

            $successMessage = "Your enquiry has been successfully saved!";
            
        } catch (PDOException $e) {
            $errorMessage = "Could not save your enquiry. Please try again.";
        }
    } else {
        $errorMessage = "Please fill in all required fields.";
    }
}

require base_path('views/contact/submit.view.php');
