(() => {
    const sliderRoot = document.querySelector('.hero-slider .slider');
    if (!sliderRoot) {
        return;
    }

    const slidesTrack = sliderRoot.querySelector('.slides');
    const slideItems = sliderRoot.querySelectorAll('.slide');
    const prevBtn = sliderRoot.querySelector('.prev');
    const nextBtn = sliderRoot.querySelector('.next');
    const dotsContainer = sliderRoot.querySelector('.dots');

    if (!slidesTrack || !slideItems.length || !prevBtn || !nextBtn || !dotsContainer) {
        return;
    }

    let currentIndex = 0;
    const totalSlides = slideItems.length;

    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) {
            dot.classList.add('active');
        }

        dot.addEventListener('click', () => {
            currentIndex = i;
            updateSlider();
        });

        dotsContainer.appendChild(dot);
    }

    const dots = dotsContainer.querySelectorAll('.dot');

    function updateSlider() {
        slidesTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    });

    setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }, 5000);
})();
