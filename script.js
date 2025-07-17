let slideIndex = 0;
showSlides(slideIndex);

function showSlides(index) {
    const slides = document.getElementsByClassName("slideshow-image");
    if (index >= slides.length) {
        slideIndex = 0;
    }
    if (index < 0) {
        slideIndex = slides.length - 1;
    }
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
        slides[i].setAttribute("aria-hidden", "true");
        slides[i].tabIndex = -1;
    }
    slides[slideIndex].classList.add("active");
    slides[slideIndex].setAttribute("aria-hidden", "false");
    slides[slideIndex].tabIndex = 0;
    slides[slideIndex].focus();
}

document.getElementById("prevBtn").addEventListener("click", () => {
    showSlides(--slideIndex);
});

document.getElementById("nextBtn").addEventListener("click", () => {
    showSlides(++slideIndex);
});

// Keyboard navigation
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        showSlides(--slideIndex);
    } else if (e.key === "ArrowRight") {
        showSlides(++slideIndex);
    }
});

// Automatically advance the slideshow
let slideInterval = setInterval(() => {
    showSlides(++slideIndex);
}, 5000);

let isPaused = false;

// Mobile tap-to-pause/resume
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

const slideshowContainer = document.querySelector('.slideshow-container');
if (slideshowContainer) {
    // Desktop: pause on hover
    slideshowContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
        isPaused = true;
        slideshowContainer.classList.add('paused');
    });
    slideshowContainer.addEventListener('mouseleave', () => {
        if (!isTouchDevice()) {
            slideInterval = setInterval(() => {
                showSlides(++slideIndex);
            }, 5000);
            isPaused = false;
            slideshowContainer.classList.remove('paused');
        }
    });
    // Mobile: tap to pause/resume
    if (isTouchDevice()) {
        slideshowContainer.addEventListener('click', () => {
            if (isPaused) {
                slideInterval = setInterval(() => {
                    showSlides(++slideIndex);
                }, 5000);
                isPaused = false;
                slideshowContainer.classList.remove('paused');
            } else {
                clearInterval(slideInterval);
                isPaused = true;
                slideshowContainer.classList.add('paused');
            }
        });
    }
}
