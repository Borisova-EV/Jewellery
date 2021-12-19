(function () {
  const accordion = document.querySelector('.accordion');

  const ACCORDION_HIDDEN_CLASS = 'accordion__content--hidden';
  const ACCORDION_CURRENT_CLASS = 'accordion__item--current';

  let focus;

  function closeAccordionContent(content) {
    content.forEach(function (elem) {
      elem.classList.add(ACCORDION_HIDDEN_CLASS);
    })
  }

  function showAccordionContent(item) {
    item.classList.toggle(ACCORDION_CURRENT_CLASS);
    const currentContent = item.querySelector('.accordion__content');
    currentContent.classList.toggle(ACCORDION_HIDDEN_CLASS);

  }

  function openAccordion() {
    if (accordion) {
      const accordionContents = accordion.querySelectorAll('.accordion__content');
      const accordionItems = accordion.querySelectorAll('.accordion__item');

      closeAccordionContent(accordionContents);
      accordionItems.forEach(function (item) {
        item.addEventListener('click', function () {
          showAccordionContent(item);
        })
      })
      const onDocumentKeyDown = function (evt) {
        if (evt.key === 'Enter') {
          showAccordionContent(focus);
        }
      }
      const onItemFocus = function (evt) {
        focus = evt.target;
        document.addEventListener('keydown', onDocumentKeyDown);
      }
      accordion.addEventListener('focusin', onItemFocus);
    }
  }

  openAccordion();
})();









'use strict';
(function () {
  const page = document.querySelector('.page-body');
  const header = page.querySelector('.page-header');
  const menu = header.querySelector('.main-navigation');
  const menuButton = header.querySelector('.page-header__button-menu');
  const search = header.querySelector('.search');

  function openCloseMenu() {
    header.classList.remove('page-header--nojs');
    menu.classList.remove('main-navigation--nojs');
    search.classList.remove('search--nojs');
    menuButton.addEventListener('click', function () {
      menu.classList.toggle('main-navigation--closed');
      menu.classList.toggle('main-navigation--opened');
      page.classList.toggle('page-body--opened-menu');
      header.classList.toggle('page-header--opened-menu');
      search.classList.toggle('search--opened-menu');
      const attribute = menu.classList.contains('main-navigation--opened') ? 'close the menu' : 'open the menu';
      menuButton.setAttribute('aria-label', attribute);
    });
  }

  openCloseMenu();
})();

(function () {
  const page = document.body;
  const loginButtons = document.querySelectorAll('.login');
  const loginTemplate = document.querySelector('#login').content.querySelector('.modal');
  const loginModal = loginTemplate.cloneNode(true);
  const closeLoginModalButton = loginModal.querySelector('.modal__close');
  const emailInput = loginModal.querySelector('input[type=email]');
  const filterButton = document.querySelector('.filter__button');
  const filterForm = document.querySelector('.filter__form');
  const filter = document.querySelector('.filter');

  let mobileDevice = window.matchMedia("(max-width: 767px)");

  const CLASS_PAGE_OPENED_POPUP = 'page-body--opened-modal';
  const CLASS_HIDDEN_LOGIN_POPUP = 'modal--hidden';

  const focusableElements = (modal) => modal.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');

  function closeLoginModal() {
    loginModal.classList.add(CLASS_HIDDEN_LOGIN_POPUP);
    page.classList.remove(CLASS_PAGE_OPENED_POPUP);

    closeLoginModalButton.removeEventListener('click', onCloseLoginModalButtonClick);
  }

  function closeModalEsc(evt, closeFunction) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      closeFunction();
    }
  };

  const isTargetModal = (evt, modal, classModal) => evt.target !== modal && !evt.target.classList.contains(classModal) && !modal.contains(evt.target);

  function closeModalDocumentClick(evt, closeFunction, modal, classModal) {
    if (isTargetModal(evt, modal, classModal)) {
      closeFunction();
    }
  };

  const onCloseLoginModalButtonClick = function () {
    closeLoginModal();
  }

  function trapFocus(modal) {
    const focusableElementsModal = focusableElements(modal);
    const firstFocusableElement = focusableElementsModal[0];
    const lastFocusableElement = focusableElementsModal[focusableElementsModal.length - 1];
    modal.addEventListener('keydown', function (evt) {
      if (evt.key === 'Tab') {
        if (evt.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            evt.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            evt.preventDefault();
          }
        }
      }
    })
  }

  function openLoginModal() {
    loginButtons.forEach(function (button) {
      button.addEventListener('click', function (evt) {
        evt.preventDefault();
        page.prepend(loginModal);

        page.classList.add(CLASS_PAGE_OPENED_POPUP);
        loginModal.classList.remove(CLASS_HIDDEN_LOGIN_POPUP);
        emailInput.focus();
        trapFocus(loginModal)

        document.addEventListener('keydown', (evt) => closeModalEsc(evt, closeLoginModal));
        document.addEventListener('click', (evt) => closeModalDocumentClick(evt, closeLoginModal, loginModal, 'login'));
        closeLoginModalButton.addEventListener('click', onCloseLoginModalButtonClick);
      })
    })
  }

  openLoginModal();

  function openFilter() {
    if (filterForm) {
      const filterCloseButton = filterForm.querySelector('.filter__close');
      const inputFilter = filterForm.querySelector('input');
      const closeFilter = () => {
        filterForm.classList.add('filter__form--hidden');
        page.classList.remove(CLASS_PAGE_OPENED_POPUP);
      }

      filter.classList.remove('filter--nojs');
      filterButton.addEventListener('click', function () {
        filterForm.classList.remove('filter__form--hidden');
        inputFilter.focus();
        trapFocus(filterForm);
        if (mobileDevice.matches) {
          page.classList.add(CLASS_PAGE_OPENED_POPUP);
        } else {
          page.classList.remove(CLASS_PAGE_OPENED_POPUP);
        }

        window.addEventListener('resize', function () {
          if (mobileDevice.matches) {
            page.classList.add(CLASS_PAGE_OPENED_POPUP);
          } else {
            page.classList.remove(CLASS_PAGE_OPENED_POPUP);
          }

        });
        document.addEventListener('keydown', (evt) => closeModalEsc(evt, closeFilter));
        document.addEventListener('click', (evt) => closeModalDocumentClick(evt, closeFilter, filterForm, 'filter__button'));
        filterCloseButton.addEventListener('click', closeFilter);
      })
    }
  }

  openFilter();
})();

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
