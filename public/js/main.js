// The Polyfill Patch: Restores $.type manually for Slick //
if (typeof jQuery !== 'undefined' && !jQuery.type) {
    jQuery.type = function(obj) {
        if (obj == null) return String(obj);
        return typeof obj === "object" || typeof obj === "function" ?
            Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() || "object" :
            typeof obj;
    };
}

// --- Sticky Header --- //
const $header = $('#header');
const headerHeight = $header.outerHeight();
let lastScrollY = $(window).scrollTop();
let timeoutId = null;
const mediumBreakpoint = 992;
// Dynamically insert the layout placeholder spacer right after the header
const $spacer = $('<div class="header-spacer"></div>').insertAfter($header);

$(window).on('scroll', function() {
    const currentScrollY = $(window).scrollTop();
    
    console.log(currentScrollY);
    // 1. User returns to the top area: Transition smoothly back to static
    if (currentScrollY <= 150) {
        if ($header.hasClass('sticky')) {
            clearTimeout(timeoutId);
            // Switch to a specialized top-transition state
            $header.removeClass('sticky sticky-out').addClass('sticky-top');
            
            timeoutId = setTimeout(() => {
                // Completely clean up and return to normal layout flow after transition ends
                $header.removeClass('sticky-top');
                $spacer.css('height', 0);
            }, 300); // Matches the 0.3s CSS transition
        } else if (!$header.hasClass('sticky-top')) {
            // Safety cleanup if they are already at the top without active sticky states
            $spacer.css('height', 0);
        }
    } 
    // 2. User scrolls UP: Slide sticky header IN
    else if (currentScrollY < lastScrollY) {
        clearTimeout(timeoutId);
        $spacer.css('height', headerHeight); 
        $header.removeClass('sticky-out sticky-top').addClass('sticky');
    } 
    // 3. User scrolls DOWN: Slide sticky header OUT
    else if (currentScrollY > lastScrollY && $header.hasClass('sticky')) {
        clearTimeout(timeoutId);
        $header.removeClass('sticky sticky-top').addClass('sticky-out');
        
        timeoutId = setTimeout(() => {
            $header.removeClass('sticky-out');
            $spacer.css('height', 0);
        }, 300);
    }

    lastScrollY = currentScrollY;
});

// Reset layout calculations if user resizes the browser window
$(window).on('resize', function() {
    if ($(window).width() < mediumBreakpoint) {
        clearTimeout(timeoutId);
        $header.removeClass('sticky sticky-out sticky-top');
        $spacer.css('height', 0);
    }
});

// --- Carousels --- //
$('.banner-slick').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    adaptiveHeight: false,
    autoplay: true,
    autoplaySpeed: 5000,
    accessibility: false,
    // Required to create the inner dot element
    customPaging: function(slider, i) {
        return '<button type="button"><span></span></button>';
    }
});

const $carousel = $('.partners');
$carousel.slick({
    slidesToShow: 6, 
    slidesToScroll: 1,    
    autoplay: true,        
    autoplaySpeed: 2000,  
    infinite: true,    
    arrows: false,     
    dots: false,
    accessibility: false, // Fixed spelling typo
    draggable: false,
    swipe: false,
    touchMove: false,
    swipeToSlide: false,        
    responsive: [
        { breakpoint: 1260, settings: { slidesToShow: 5 } },
        { breakpoint: 992, settings: { slidesToShow: 3 } },
        { breakpoint: 768, settings: { slidesToShow: 2 } },
        { breakpoint: 300, settings: { slidesToShow: 1 } }
    ]
});

const hamburgerBtn = document.getElementById("hamburger-toggle");
const overlay = document.getElementById("nav-overlay");
const body = document.body;
let menuHasOpened = false; 

if (hamburgerBtn && overlay) {
    hamburgerBtn.addEventListener("click", () => {
        // Lock the header to the current scroll position when opening
        document.getElementById("header").style.top = lastScrollY + "px";
        
        if (!menuHasOpened) {
            body.classList.add("has-opened");
            menuHasOpened = true;
        }
        body.classList.toggle("nav-is-active");
    });

    overlay.addEventListener("click", () => {
        // Remove the active class to trigger the closing animation
        body.classList.remove("nav-is-active");
        
        // Wait for the CSS transition to finish before snapping header to 0
        // Change 300 to match the exact duration (in ms) of your CSS sidebar transition
        setTimeout(() => {
            // Only reset if the user didn't instantly reopen it
            if (!body.classList.contains("nav-is-active")) {
                document.getElementById("header").style.top = "0px";
            }
        }, 300); 
    });
}

// --- Cookie Handler --- //
const cookieOverlay = document.getElementById("cookie-overlay");
const cookieBanner = document.getElementById("cookie-banner");
const acceptBtn = document.getElementById("accept-cookies");
const settingsBtn = document.getElementById("change-settings");

if (cookieOverlay && cookieBanner && acceptBtn) {
    // Check storage baseline
    if (!localStorage.getItem("cookieConsent")) {
        cookieOverlay.classList.remove("hidden");
        cookieBanner.classList.remove("hidden");
    }
    // Accept functionality
    acceptBtn.addEventListener("click", () => {
        localStorage.setItem("cookieConsent", "accepted");
        cookieOverlay.classList.add("hidden");
        cookieBanner.classList.add("hidden");
    });
    // Settings functionality placeholder
    if (settingsBtn) {
        settingsBtn.addEventListener("click", () => {
            console.log("Settings panel opened");
        });
    }
}

// --- OoH Support Dropdown Accordion --- //
document.addEventListener('DOMContentLoaded', () => {
    // Select the accordion link wrapper
    const accordionToggle = document.querySelector('.out-of-hours h4 a');
    if (!accordionToggle) return;

    // Select the content panel block
    const accordionAnswer = document.querySelector('.out-of-hours .answer');
    const chevronIcon = accordionToggle.querySelector('.fa-chevron-down');

    // Setup initial state attributes for screen readers
    accordionToggle.setAttribute('aria-expanded', 'false');
    accordionAnswer.setAttribute('aria-hidden', 'true');

    // Click handler trigger
    accordionToggle.addEventListener('click', (event) => {
        event.preventDefault(); // Stop standard link jumping behaviors

        // Check current visible state 
        const isHidden = accordionAnswer.classList.contains('initiallyHidden');

        if (isHidden) {
            // Open Accordion ---
            accordionAnswer.classList.remove('initiallyHidden');
            accordionToggle.setAttribute('aria-expanded', 'true');
            accordionAnswer.setAttribute('aria-hidden', 'false');
            
            // Add rotation class to the chevron arrow
            if (chevronIcon) chevronIcon.classList.add('rotate');
            
            // Smooth slide animation logic
            accordionAnswer.style.height = '0px';
            accordionAnswer.style.opacity = '0';
            accordionAnswer.style.overflow = 'hidden';
            accordionAnswer.style.transition = 'height 0.3s ease, opacity 0.3s ease';
            
            // Force redraw step to catch animation state accurately
            const scrollHeight = accordionAnswer.scrollHeight;
            accordionAnswer.style.height = scrollHeight + 'px';
            accordionAnswer.style.opacity = '1';

            // Clean up style triggers once animation finishes
            setTimeout(() => {
                accordionAnswer.style.height = '';
                accordionAnswer.style.overflow = '';
            }, 300);

        } else {
            // --- 2. Close Accordion ---
            const scrollHeight = accordionAnswer.scrollHeight;
            accordionAnswer.style.height = scrollHeight + 'px';
            accordionAnswer.style.overflow = 'hidden';
            accordionAnswer.style.transition = 'height 0.3s ease, opacity 0.3s ease';

            // Force reflow recalculation
            accordionAnswer.offsetHeight; 

            accordionAnswer.style.height = '0px';
            accordionAnswer.style.opacity = '0';
            
            if (chevronIcon) chevronIcon.classList.remove('rotate');
            accordionToggle.setAttribute('aria-expanded', 'false');
            accordionAnswer.setAttribute('aria-hidden', 'true');

            // Formally hide the element from selectors once transition ends
            setTimeout(() => {
                accordionAnswer.classList.add('initiallyHidden');
                accordionAnswer.style.height = '';
                accordionAnswer.style.opacity = '';
                accordionAnswer.style.overflow = '';
            }, 300);
        }
    });
});


// --- Contact Form Validation -- //
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form[action*="enquiry#contact-form"]');
    if (!form) return;

    form.setAttribute('novalidate', '');

    const fields = form.querySelectorAll('.form-control');
    
    // Cache selectors for performance and reuse
    const nameField = form.querySelector('#name');
    const emailField = form.querySelector('#email');
    const telephoneField = form.querySelector('#telephone');
    const messageField = form.querySelector('#message');

    // Validation rules dictionary
    const validationRules = {
        'name': () => nameField.value.trim().length >= 2,
        'email': () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim()),
        'telephone': () => /^\+?[0-9\s\-]{10,15}$/.test(telephoneField.value.trim().replace(/\s+/g, '')),
        'message': () => messageField.value.trim().length >= 10
    };

    // Helper to validate a specific field by its ID
    function isFieldValid(field) {
        const rule = validationRules[field.id];
        return rule ? rule() : true;
    }

    // Evaluate validation on input; remove error only if rule passes
    fields.forEach(field => {
        field.addEventListener('input', function () {
            if (isFieldValid(this)) {
                clearFieldError(this);
            }
        });
    });

    form.addEventListener('submit', function (event) {
        let isValid = true;

        fields.forEach(field => {
            if (!isFieldValid(field)) {
                showError(field);
                isValid = false;
            } else {
                clearFieldError(field);
            }
        });

        if (!isValid) {
            event.preventDefault();
        }
    });

    function showError(inputElement) {
        const formGroup = inputElement.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('has-error');
        }
    }

    function clearFieldError(inputElement) {
        const formGroup = inputElement.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('has-error');
        }
    }
});