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

// Dynamically insert the layout placeholder spacer right after the header
const $spacer = $('<div class="header-spacer"></div>').insertAfter($header);

const mediumBreakpoint = 768; 

$(window).on('scroll', function() {
    // Enforce rule to disable functionality completely on small viewports
    if ($(window).width() < mediumBreakpoint) {
        $header.removeClass('sticky sticky-out');
        $spacer.height(0);
        return;
    }

    const currentScrollY = $(window).scrollTop();
    const headerHeight = $header.outerHeight();

    // User scrolls UP and is away from the top area
    if (currentScrollY < lastScrollY && currentScrollY > 150) {
        clearTimeout(timeoutId);
        
        // Set spacer height immediately to absorb the layout gap before header floats
        $spacer.height(headerHeight); 
        $header.removeClass('sticky-out').addClass('sticky');
    } 
    // User scrolls DOWN or returns to the absolute top of the page
    else {
        if ($header.hasClass('sticky')) {
            $header.removeClass('sticky').addClass('sticky-out');
            
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                $header.removeClass('sticky-out');
                // Collapse the layout spacer smoothly once the header is safely static again
                $spacer.height(0);
            }, 300); // Matches the 0.3s SCSS animation duration
        } else if (currentScrollY <= 150) {
            // Safety cleanup if scrolling fast near the top boundary
            $header.removeClass('sticky sticky-out');
            $spacer.height(0);
        }
    }

    lastScrollY = currentScrollY;
});

// Reset layout calculations smoothly if user resizes the browser window
$(window).on('resize', function() {
    if ($(window).width() < mediumBreakpoint) {
        $header.removeClass('sticky sticky-out');
        $spacer.height(0);
    }
});

// Banner Carosel //
 $('.banner-slick').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    adaptiveHeight: false,
    autoplay: true,
    autoplaySpeed: 5000,
    accessibility: false 
});


// Partners Carousel //
$('.partners').slick({
    slidesToShow: 6, 
    slidesToScroll: 1,    
    autoplay: true,        
    autoplaySpeed: 2000,  
    infinite: true,    
    arrows: false,     
    dots: false,        
    responsive: [
        {
            breakpoint: 1260,
            settings: {
                slidesToShow: 5
            }
        },
        {
            breakpoint: 992,
            settings: {
                slidesToShow: 4
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 3
            }
        },
        {
            breakpoint: 300,
            settings: {
                slidesToShow: 2
            }
        }
    ]
});

// sliding sidebar menu //
const hamburgerBtn = document.getElementById("hamburger-toggle");
const overlay = document.querySelector(".nav-overlay"); // Target class layout token directly
const body = document.body;

// Toggle menu slide status
hamburgerBtn.addEventListener("click", () => {
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