const sliderOperation = function () {
  // берем все слайдеры страницы
  const sliders = Array.from(document.querySelectorAll(".slider"));
  let isDesctop = document.documentElement.clientWidth >= 1366 ? true : false;

  // если разрешение меняется делает проверку
  window.addEventListener("resize", () => {
    isDesctop = document.documentElement.clientWidth >= 1366 ? true : false;
  });

  //@ пробегаемся по каждому слайдеру страницы
  sliders.forEach((slider) => {
    // текущий слайд
    let currentSlide = 0;
    // список  слайдов
    let slides;
    const slidesList = slider.querySelector(".slider__list");
    const slide = slider.querySelector(".slider__item");
    const nextButton = slider.querySelector(".slider__button-next");
    const previousButton = slider.querySelector(".slider__button-previous");
    const dots = slider.querySelectorAll(".slider__button-dot");
    let pages = slider.querySelector(".slider__button-pages");

    // если слайдер самолет то уменьшим количество слайдов
    if (slider.classList.contains("stages__slider")) {
      slides = Array.from(slider.querySelectorAll(".slider__item")).slice(0, 5);
    } else {
      slides = Array.from(slider.querySelectorAll(".slider__item"));
    }

    /**
     *выключает кнопки на первом и последнем слайде
     */
    const checkSlide = function () {
      if (currentSlide === 0) {
        nextButton.disabled = false;
        previousButton.disabled = true;
      } else if (currentSlide === (isDesctop ? slides.length - 3 : slides.length - 1)) {
        previousButton.disabled = false;
        nextButton.disabled = true;
      } else {
        previousButton.disabled = false;
        nextButton.disabled = false;
      }
    };

    /**
     *проверка на каком слайде находимся
     */
    const updateDotes = function () {
      // для слайдером с точками
      if (dots.length != 0) {
        // если индекс точки равен текущему слайду то ставим активную
        dots.forEach((dot, index) => {
          if (currentSlide === index) {
            dot.classList.add("slider__button-dot_active");
          } else {
            dot.classList.remove("slider__button-dot_active");
          }
        });
      }
      // для слайдеров с текстом
      if (pages) {
        pages.textContent = `${isDesctop ? currentSlide + 3 : currentSlide + 1} / ${slides.length}`;
      }
    }

    const toogleSlide = function () {
      slidesList.style.transform = `translateX(-${currentSlide * (slide.offsetWidth + 20)}px)`;
    }

    /**
     * функция для автоматического перелистывания
     */
    const autoNextSlide = function () {
      if (slider.classList.contains("participants__slider")) {
        if (currentSlide < (isDesctop ? slides.length - 3 : slides.length - 1)) {
          currentSlide++;
          toogleSlide();
          checkSlide();
          updateDotes();
        } else {
          currentSlide = 0;
          toogleSlide();
          checkSlide();
          updateDotes();
        }
      }
    };

    /**
     * функция для сброса счетчика
     */
    const clearTimerSlide = function () {
      clearInterval(timerSlide);
      timerSlide = setInterval(autoNextSlide, 4000);
    };

    // запускаем функцию для автоматического перелистывания через каждые 4сек
    let timerSlide = setInterval(autoNextSlide, 4000);

    // кнопка след слайда
    nextButton.addEventListener("click", () => {
      currentSlide++;
      toogleSlide();
      checkSlide();
      updateDotes();
      // сбрасываем счетчик при нажатии
      clearTimerSlide();
    });

    // кнопка пред слайда
    previousButton.addEventListener("click", () => {
      currentSlide--;
      toogleSlide();
      checkSlide();
      updateDotes();
      // сбрасываем счетчик при нажатии
      clearTimerSlide();
    });

    // навигация по точкам
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentSlide = index;
        toogleSlide();
        checkSlide();
        updateDotes();
      });
    });

    // при изменение экрана повторяет перелистывание
    window.addEventListener("resize", () => {
      toogleSlide();
      checkSlide();
      updateDotes();
    });

    checkSlide();
    updateDotes();
  });
};

sliderOperation();
