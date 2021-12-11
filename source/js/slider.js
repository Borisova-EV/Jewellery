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
  const SENSITIVITY = 20;

  function disableButton(button, value) {
    button.disabled = value;
  }

  function changeStatusButton(amountPages) {
    if (counter == 0) {
      disableButton(sliderButtonPrev, true);
      disableButton(sliderButtonNext, false);
    } else if (counter > 0 && counter < (amountPages - 1)) {
      disableButton(sliderButtonNext, false);
      disableButton(sliderButtonPrev, false)
    } else {
      disableButton(sliderButtonNext, true);
    }
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

  function isLastPages(cards, numberCards) {
    return getNumberNextCards(cards, numberCards) <= numberCards;
  }

  function showCardSlider(cards, numberCards) {
    cards.forEach((elem) => elem.classList.add('card-product--hidden'));

    const amountShowCards = (isLastPages(cards, numberCards)) ? getNumberNextCards(cards, numberCards) : numberCards;
    for (let i = getNumberPreviousCards(numberCards); i < (getNumberPreviousCards(numberCards) + amountShowCards); i++) {
      cards[i].classList.remove('card-product--hidden');
    }
  }

  function showPreviousSliderCards(amountPages, cards, numberCards, pagination) {
    if (counter == 0) {
      disableButton(sliderButtonPrev, true);
    } else {
      counter--;
      showCardSlider(cards, numberCards)

      const previousIndex = counter + 1;
      changeCurrentPage(previousIndex, pagination);

      if (counter < (amountPages - 1)) {
        disableButton(sliderButtonNext, false);
        disableButton(sliderButtonPrev, false);
      }
    }
  }

  function showNextSliderCards(amountPages, cards, numberCards, pagination) {
    counter++;
    showCardSlider(cards, numberCards)
    if (counter > 0) {
      disableButton(sliderButtonPrev, false);
    }

    const previousIndex = counter - 1;
    changeCurrentPage(previousIndex, pagination);

    if (counter >= (amountPages - 1)) {
      disableButton(sliderButtonNext, true);
    }
  }


  function shiftPage(cards, numberCards, pagination) {
    if (paginationList) {
      pagination[0].classList.add('pagination__item--current');
      for (let page of pagination) {
        page.addEventListener('click', function () {
          for (let page of pagination) {
            page.classList.remove('pagination__item--current');
          }
          this.classList.add('pagination__item--current');
          counter = this.textContent - 1;
          cards.forEach((elem) => elem.classList.add('card-product--hidden'));
          showCardSlider(cards, numberCards)
          changeStatusButton();
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

    function handleTouchStart(evt) {
      let startPoint = null;
      let endPoint = null;

      function getTouchPoint(evt) {
        return evt.changedTouches[0].clientX;
      }

      startPoint = getTouchPoint(evt);

      slider.addEventListener('touchend', handleTouchEnd, false);
      function handleTouchEnd(evt) {
        endPoint = getTouchPoint(evt);
        const differencePoint = startPoint - endPoint;

        if (Math.abs(differencePoint) > SENSITIVITY) {
          if (differencePoint > 0) {
            if (isLastPages(cards, numberCards)) {
              return;
            } else {
              showNextSliderCards(amountPages, cards, numberCards, pagination)
              currentPageElement.textContent = counter + 1;
            }
          } else {

            if (counter === 0) {
              return;
            } else {
              showPreviousSliderCards(amountPages, cards, numberCards, pagination);
              currentPageElement.textContent = counter + 1;
            }
          }
        }

        startPoint = null;
        endPoint = null;

      }
    }
  }


  function scrollSlider(cards, amountPages, numberCards) {
    slider.classList.remove('slider--nojs');
    sliderButtonPrev.classList.remove('control--nojs');
    sliderButtonNext.classList.remove('control--nojs');
    showCardSlider(cards, numberCards);

    let pages;
    if (paginationList) {
      pages = paginationList.getElementsByClassName('pagination__item');
      pages[0].classList.add('pagination__item--current');
    }


    if (counter == 0) {
      disableButton(sliderButtonPrev, true);
    }

    if (cards.length <= numberCards) {
      disableButton(sliderButtonPrev, true);
      disableButton(sliderButtonNext, true);
    } else if (mobileDevice.matches) {
      swipeSlider(cards, amountPages, numberCards, pages);
      currentPageElement.textContent = counter + 1;
      totalPagesElement.textContent = amountPages;
    } else if (smallDevice.matches) {
      swipeSlider(cards, amountPages, numberCards, pages);
      sliderButtonPrev.addEventListener('click', () => showPreviousSliderCards(amountPages, cards, numberCards, pages));
      sliderButtonNext.addEventListener('click', () => showNextSliderCards(amountPages, cards, numberCards, pages));

      shiftPage(cards, numberCards, pages);
    } else {
      sliderButtonPrev.addEventListener('click', () => showPreviousSliderCards(amountPages, cards, numberCards, pages));
      sliderButtonNext.addEventListener('click', () => showNextSliderCards(amountPages, cards, numberCards, pages));

      shiftPage(cards, numberCards, pages)
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
