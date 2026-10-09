const hero = document.querySelector(".hero");

if (hero) {
	const slides = Array.from(hero.querySelectorAll(".hero-slide"));
	const indicators = Array.from(hero.querySelectorAll(".slide-indicator"));
	const controls = hero.querySelector(".hero-slider-controls");
	const previousButton = hero.querySelector('[data-slide-direction="previous"]');
	const nextButton = hero.querySelector('[data-slide-direction="next"]');
	const rotationButton = hero.querySelector(".slider-toggle");
	const eyebrow = hero.querySelector(".hero-eyebrow-copy");
	const firstLine = hero.querySelector(".hero-title-first");
	const secondLine = hero.querySelector(".hero-title-second");
	const description = hero.querySelector(".hero-copy");
	const caption = hero.querySelector(".hero-caption-copy");
	const currentCount = hero.querySelector(".slide-count-current");

	if (slides.length > 1 && slides.length === indicators.length && controls) {
		let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
		activeIndex = Math.max(activeIndex, 0);
		let rotationEnabled = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let pointerIsInside = false;
		let focusIsInside = false;
		let rotationTimer = null;
		controls.hidden = false;

		const showSlide = (index) => {
			activeIndex = (index + slides.length) % slides.length;

			slides.forEach((slide, slideIndex) => {
				const isActive = slideIndex === activeIndex;
				slide.classList.toggle("is-active", isActive);
				slide.setAttribute("aria-hidden", String(!isActive));
				slide.setAttribute("aria-label", `${slideIndex + 1} of ${slides.length}`);
				indicators[slideIndex].classList.toggle("is-active", isActive);
				indicators[slideIndex].setAttribute("aria-pressed", String(isActive));
			});

			const activeSlide = slides[activeIndex];
			eyebrow.textContent = activeSlide.dataset.eyebrow;
			firstLine.textContent = activeSlide.dataset.firstLine;
			secondLine.textContent = activeSlide.dataset.secondLine;
			description.textContent = activeSlide.dataset.copy;
			caption.textContent = activeSlide.dataset.caption;
			currentCount.textContent = String(activeIndex + 1).padStart(2, "0");
		};

		const updateRotation = () => {
			window.clearInterval(rotationTimer);
			rotationTimer = null;

			if (rotationEnabled && !pointerIsInside && !focusIsInside) {
				rotationTimer = window.setInterval(() => showSlide(activeIndex + 1), 5000);
			}

			const label = rotationEnabled ? "Pause automatic slides" : "Play automatic slides";
			rotationButton.setAttribute("aria-label", label);
			rotationButton.title = label;
			rotationButton.querySelector("span").textContent = rotationEnabled ? "Ⅱ" : "▶";
		};

		previousButton.addEventListener("click", () => showSlide(activeIndex - 1));
		nextButton.addEventListener("click", () => showSlide(activeIndex + 1));
		indicators.forEach((indicator, index) => {
			indicator.addEventListener("click", () => showSlide(index));
		});
		controls.addEventListener("keydown", (event) => {
			if (event.key === "ArrowLeft") {
				event.preventDefault();
				showSlide(activeIndex - 1);
			} else if (event.key === "ArrowRight") {
				event.preventDefault();
				showSlide(activeIndex + 1);
			}
		});
		hero.addEventListener("mouseenter", () => {
			pointerIsInside = true;
			updateRotation();
		});
		hero.addEventListener("mouseleave", () => {
			pointerIsInside = false;
			updateRotation();
		});
		hero.addEventListener("focusin", () => {
			focusIsInside = true;
			updateRotation();
		});
		hero.addEventListener("focusout", (event) => {
			if (!hero.contains(event.relatedTarget)) {
				focusIsInside = false;
				updateRotation();
			}
		});
		rotationButton.addEventListener("click", () => {
			rotationEnabled = !rotationEnabled;
			updateRotation();
		});
		updateRotation();
	}
}