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
        slides[i].style.display = "none";
    }
    slides[slideIndex].style.display = "block";
}

const prevButton = document.getElementById("prevBtn");
const nextButton = document.getElementById("nextBtn");

// Function to add event listeners for both click and touch
function addEventListeners(button, action) {
    button.addEventListener("click", action); // For desktop users
    button.addEventListener("touchstart", action, { passive: true }); // For mobile users
}

// Add event listeners to the buttons
addEventListeners(prevButton, () => {
    showSlides(--slideIndex);
});
addEventListeners(nextButton, () => {
    showSlides(++slideIndex);
});

// Automatically advance the slideshow
setInterval(() => {
    showSlides(++slideIndex);
}, 5000); // Change image every 5 seconds
