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

document.getElementById("prevBtn").addEventListener("click", () => {
    showSlides(--slideIndex);
});

document.getElementById("nextBtn").addEventListener("click", () => {
    showSlides(++slideIndex);
});

// Automatically advance the slideshow (optional)
setInterval(() => {
    showSlides(++slideIndex);
}, 10000); // Change image every 3 seconds
