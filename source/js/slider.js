(function () {
  const slider = document.querySelector('.slider');
  const sliderButtonPrev = document.querySelector('.control--previous');
  const sliderButtonNext = document.querySelector('.control--next');
  const paginationList = document.querySelector('.pagination__list');
  const currentPageElement = document.querySelector('.pagination__current-page');
  const totalPagesElement = document.querySelector('.pagination__total-page');

  let smallDevice = window.matchMedia("(max-width: 1023px)");
  let mobileDevice = window.matchMedia("(max-width: 767px)");

  let counter = 0;


  function disableButton(button, value) {
    button.disabled = value;
  }

  function changeCurrentPage(index, pagination) {
    pagination[index].classList.remove('pagination__item--current');
    pagination[counter].classList.add('pagination__item--current');
  }

  function getNumberPreviousCards(numberCards) {
    return numberCards * counter;
  }

  function getNumberNextCards(cards, numberCards) {
    return cards.length - getNumberPreviousCards(numberCards);
  }

  function isLastPages(amountPages) {
    return (counter + 1) == amountPages;
  }

  function isFirstPages() {
    return counter === 0
  }

  function changeStatusButton(amountPages) {
    if (isFirstPages()) {
      disableButton(sliderButtonPrev, true);
      disableButton(sliderButtonNext, false);
    } else {
      disableButton(sliderButtonPrev, false);
      disableButton(sliderButtonNext, false);
    } if (isLastPages(amountPages)) {
      disableButton(sliderButtonNext, true);
      disableButton(sliderButtonPrev, false);
    }
  }

  function showCardSlider(cards, numberCards, amountPages) {
    cards.forEach(function (elem) {
      elem.classList.add('card-product--hidden');
      elem.classList.remove('card-product--opacity');
    });

    const amountShowCards = (isLastPages(amountPages)) ? getNumberNextCards(cards, numberCards) : numberCards;
    for (let i = getNumberPreviousCards(numberCards); i < (getNumberPreviousCards(numberCards) + amountShowCards); i++) {
      cards[i].classList.remove('card-product--hidden');
      function addOpacity() {
        cards[i].classList.add('card-product--opacity');
      }
      setTimeout(() => addOpacity(), 100);
    }
  }

  function showPreviousSliderCards(amountPages, cards, numberCards, pagination) {
    counter--;
    showCardSlider(cards, numberCards, amountPages)

    const previousIndex = counter + 1;
    changeCurrentPage(previousIndex, pagination);

    changeStatusButton(amountPages);
  }

  function showNextSliderCards(amountPages, cards, numberCards, pagination) {
    counter++;
    showCardSlider(cards, numberCards, amountPages)

    const previousIndex = counter - 1;
    changeCurrentPage(previousIndex, pagination);
    changeStatusButton(amountPages);
  }


  function shiftPage(cards, numberCards, pagination, amountPages) {
    if (paginationList) {
      pagination[0].classList.add('pagination__item--current');
      for (let page of pagination) {
        page.addEventListener('click', function () {
          for (let page of pagination) {
            page.classList.remove('pagination__item--current');
          }
          this.classList.add('pagination__item--current');
          counter = this.textContent - 1;

          showCardSlider(cards, numberCards, amountPages)

          changeStatusButton(amountPages);
        })
      }
    }

  }


  function createPagination(amountPages) {
    if (paginationList) {
      if (paginationList.style.display != 'none') {
        const paginationFragment = document.createDocumentFragment();
        for (let i = 1; i <= amountPages; i++) {
          const paginationTemplate = document.querySelector('#pagination').content.querySelector('li');
          const paginationElement = paginationTemplate.cloneNode(true);
          const buttonPage = paginationElement.querySelector('button');
          buttonPage.textContent = i;
          paginationFragment.append(paginationElement);
        }
        paginationList.textContent = '';
        paginationList.append(paginationFragment);
      }
    }
  }


  function swipeSlider(cards, amountPages, numberCards, pagination) {
    slider.addEventListener('touchstart', handleTouchStart, false);
    slider.addEventListener('touchmove', handleTouchMove, false);

    let startPoint = 0;
    let endPoint = 0;
    const SENSITIVITY = 20;

    function handleTouchStart(evt) {
      const startTouch = evt.changedTouches[0];
      startPoint = startTouch.clientX;
    }

    function handleTouchMove(evt) {
      if (!startPoint) {
        return
      }

      endPoint = evt.changedTouches[0].clientX;
      const differencePoint = startPoint - endPoint;

      if (Math.abs(differencePoint) > SENSITIVITY) {

        if (differencePoint > 0) {

          if (isLastPages(amountPages)) {
            return;
          } else {
            evt.preventDefault();
            showNextSliderCards(amountPages, cards, numberCards, pagination)
            if (currentPageElement) {
              currentPageElement.textContent = counter + 1;
            }


          }
        } else if (differencePoint < 0) {

          if (isFirstPages()) {
            return;
          } else {
            evt.preventDefault();
            showPreviousSliderCards(amountPages, cards, numberCards, pagination);
            if (currentPageElement) {
              currentPageElement.textContent = counter + 1;
            }
          }
        }

        startPoint = 0;
        endPoint = 0;
      }
    }
  }



  function scrollSlider(cards, amountPages, numberCards) {
    slider.classList.remove('slider--nojs');
    cards.forEach((card) => card.classList.remove('card-product--nojs'));
    sliderButtonPrev.classList.remove('control--nojs');
    sliderButtonNext.classList.remove('control--nojs');
    showCardSlider(cards, numberCards, amountPages);

    let pages;
    if (paginationList) {
      pages = paginationList.getElementsByClassName('pagination__item');
      pages[0].classList.add('pagination__item--current');
    }

    changeStatusButton(amountPages)

    if (cards.length <= numberCards) {
      disableButton(sliderButtonPrev, true);
      disableButton(sliderButtonNext, true);
    } else if (mobileDevice.matches) {
      swipeSlider(cards, amountPages, numberCards, pages);
      if (currentPageElement) {
        currentPageElement.textContent = counter + 1;
        totalPagesElement.textContent = amountPages;
      }
    } else if (smallDevice.matches) {
      swipeSlider(cards, amountPages, numberCards, pages);

      sliderButtonPrev.addEventListener('click', () => showPreviousSliderCards(amountPages, cards, numberCards, pages));
      sliderButtonNext.addEventListener('click', () => showNextSliderCards(amountPages, cards, numberCards, pages));

      shiftPage(cards, numberCards, pages, amountPages);
    } else {
      sliderButtonPrev.addEventListener('click', () => showPreviousSliderCards(amountPages, cards, numberCards, pages));
      sliderButtonNext.addEventListener('click', () => showNextSliderCards(amountPages, cards, numberCards, pages));

      shiftPage(cards, numberCards, pages, amountPages)
    }
  }

  function controlSlider() {
    const sliderCards = slider.querySelectorAll('li');
    const numberSliderCards = slider.classList.contains('catalog__list') ? 12 : (smallDevice.matches) ? 2 : 4;
    const amountPages = Math.ceil(sliderCards.length / numberSliderCards);
    createPagination(amountPages);
    scrollSlider(sliderCards, amountPages, numberSliderCards);
  }

  if (slider) {
    controlSlider()

    window.addEventListener('resize', () => controlSlider());
  }
})();
