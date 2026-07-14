fetch("/api/visit").catch(console.error);

document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("carouselTrack");
  const slides = document.querySelectorAll(".carousel-slide");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsContainer = document.getElementById("carouselDots");

  if (!track || !slides.length || !prevBtn || !nextBtn || !dotsContainer) return;

  let currentSlide = 0;
  let startX = 0;
  let isTouching = false;
  const swipeThreshold = 50;

  function updateCarousel() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    [...dotsContainer.children].forEach((dot, i) => {
      dot.classList.toggle("active", i === currentSlide);
    });
  }

  function createDots() {
    dotsContainer.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "slider-dot";
      dot.setAttribute("aria-label", `Показать слайд ${i + 1}`);
      dot.addEventListener("click", () => {
        currentSlide = i;
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    });
  }

  prevBtn.addEventListener("click", () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateCarousel();
  });

  nextBtn.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarousel();
  });

  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isTouching = true;
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    if (!isTouching) return;

    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > swipeThreshold) {
      currentSlide = diff > 0
        ? (currentSlide + 1) % slides.length
        : (currentSlide - 1 + slides.length) % slides.length;
      updateCarousel();
    }

    isTouching = false;
  });

  createDots();
  updateCarousel();
});
