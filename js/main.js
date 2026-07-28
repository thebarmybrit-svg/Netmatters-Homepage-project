

// The Polyfill Patch: Restores $.type manually for Slick
if (typeof jQuery !== 'undefined' && !jQuery.type) {
    jQuery.type = function(obj) {
        if (obj == null) return String(obj);
        return typeof obj === "object" || typeof obj === "function" ?
            Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() || "object" :
            typeof obj;
    };
}

// Banner Carosel
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


// Partners Carousel
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

// sliding dropdown menu
const hamburgerBtn = document.getElementById("hamburger-toggle");
const overlay = document.getElementById("nav-overlay");
const body = document.body;

// Toggle menu slide status
hamburgerBtn.addEventListener("click", () => {
    body.classList.toggle("nav-is-active");
});

// Close menu view when overlay mask background is tapped
overlay.addEventListener("click", () => {
    body.classList.remove("nav-is-active");
});