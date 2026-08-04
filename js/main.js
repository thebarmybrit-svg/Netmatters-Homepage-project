// The Polyfill Patch: Restores $.type manually for Slick //
if (typeof jQuery !== 'undefined' && !jQuery.type) {
    jQuery.type = function(obj) {
        if (obj == null) return String(obj);
        return typeof obj === "object" || typeof obj === "function" ?
            Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() || "object" :
            typeof obj;
    };
}

// Sticky Header //
const $header = $('#header');
let lastScrollY = $(window).scrollTop();
let timeoutId = null;
const mediumBreakpoint = 992;
// Dynamically insert the layout placeholder spacer right after the header
const $spacer = $('<div class="header-spacer"></div>').insertAfter($header);

$(window).on('scroll', function() {
    const currentScrollY = $(window).scrollTop();
    const headerHeight = $header.outerHeight();

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


// Partners Carousel //
// Initialize Partners Carousel
const $carousel = $('.partners');

$carousel.slick({
    slidesToShow: 6, 
    slidesToScroll: 1,    
    autoplay: true,        
    autoplaySpeed: 2000,  
    infinite: true,    
    arrows: false,     
    dots: false,
    accesibility: false,
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

// Dynamic edge detection for tooltips
$carousel.on('mouseenter', '.item-partner .item', function() {
    const $description = $(this).find('.description');
    if (!$description.length) return;

    // Remove old edge classes before measuring
    $description.removeClass('edge-left edge-right');
    
    // Add hover class to override 'display: none' so JS can read its real width
    $(this).addClass('is-hovered');

    // Use native DOM element to get accurate viewport bounding box
    const rect = $description[0].getBoundingClientRect();
    const windowWidth = $(window).width();
    const buffer = 20; // Explicit minimum padding from the edge of the viewport

    if (rect.left < buffer) {
        $description.addClass('edge-left');
    } else if (rect.right > windowWidth - buffer) {
        $description.addClass('edge-right');
    }
}).on('mouseleave', '.item-partner .item', function() {
    // Clean up hover state and edge classes when mouse leaves
    $(this).removeClass('is-hovered');
    $(this).find('.description').removeClass('edge-left edge-right');
});

// sliding sidebar menu //
const hamburgerBtn = document.getElementById("hamburger-toggle");
const overlay = document.getElementById("nav-overlay");
const body = document.body;
let menuHasOpened = false; // Track if the menu was ever activated

// Toggle menu slide status
hamburgerBtn.addEventListener("click", () => {
    if (!menuHasOpened) {
        body.classList.add("has-opened");
        menuHasOpened = true;
    }
    body.classList.toggle("nav-is-active");
});

// Close menu view when overlay mask background is tapped
overlay.addEventListener("click", () => {
    body.classList.remove("nav-is-active");
});

// Cookie Handler //
const cookieOverlay = document.getElementById("cookie-overlay");
const cookieBanner = document.getElementById("cookie-banner");
const acceptBtn = document.getElementById("accept-cookies");
const settingsBtn = document.getElementById("change-settings");

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
settingsBtn.addEventListener("click", () => {
    console.log("Settings panel opened");
});