'use strict';
(function () {
  const menu = document.querySelector('.main-navigation');
  const menuButton = document.querySelector('.page-header__button-menu');
  const page = document.querySelector('.page-body');
  const header = page.querySelector('.page-header');
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
  const slider = document.querySelector('.slider__list');
  const sliderCards = slider.querySelectorAll('li');
  const sliderButtonPrev = document.querySelector('.control--previous');
  const sliderButtonNext = document.querySelector('.control--next');
  const paginationBlock = document.querySelector('.pagination');
  const paginationList = paginationBlock.querySelector('ul');
  const pages = document.getElementsByClassName('pagination__item');

  let smallDevice = window.matchMedia("(max-width: 1023px)");

  let counter = 0;

  const AMOUNT = smallDevice.matches ? 2 : 4;

  const amountPages = Math.floor(sliderCards.length / AMOUNT);

  function disableButton(button, value) {
    button.disabled = value;
  }

  function changeStatusButton() {
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

  function changeCurrentPage(index) {
    pages[index].classList.remove('pagination__item--current');
    pages[counter].classList.add('pagination__item--current');
  }

  function showCardSlider() {
    sliderCards.forEach((elem) => elem.classList.add('card-product--hidden'));
    for (let i = AMOUNT * counter; i < (AMOUNT * counter + AMOUNT); i++) {
      sliderCards[i].classList.remove('card-product--hidden');
    }
  }
  const onSliderButtonPrevClick = function () {
    if (counter == 0) {
      disableButton(sliderButtonPrev, true);
    } else {
      counter--;
      showCardSlider()

      const previousIndex = counter + 1;
      changeCurrentPage(previousIndex);

      if (counter < (amountPages - 1)) {
        disableButton(sliderButtonNext, false);
        disableButton(sliderButtonPrev, false);
      }
    }
  }

  const onSliderButtonNextClick = function () {
    counter++;
    showCardSlider()
    if (counter > 0) {
      disableButton(sliderButtonPrev, false);
    }

    const previousIndex = counter - 1;
    changeCurrentPage(previousIndex);

    if (counter >= (amountPages - 1)) {
      disableButton(sliderButtonNext, true);
    }
  }


  function shiftPage() {
    pages[0].classList.add('pagination__item--current');
    for (let page of pages) {
      page.addEventListener('click', function () {
        for (let page of pages) {
          page.classList.remove('pagination__item--current');
        }
        this.classList.add('pagination__item--current');
        counter = this.textContent - 1;
        sliderCards.forEach((elem) => elem.classList.add('card-product--hidden'));
        showCardSlider()
        changeStatusButton();
      })
    }
  }


  function createPagination() {
    const paginationFragment = document.createDocumentFragment();
    for (let i = 1; i <= amountPages; i++) {
      const paginationTemplate = document.querySelector('#pagination').content.querySelector('li');
      const paginationElement = paginationTemplate.cloneNode(true);
      const buttonPage = paginationElement.querySelector('button');
      buttonPage.textContent = i;
      paginationFragment.append(paginationElement);
    }
    paginationList.append(paginationFragment);
  }

  function scrollSlider() {
    sliderButtonPrev.classList.remove('control--nojs');
    sliderButtonNext.classList.remove('control--nojs');
    showCardSlider()
    pages[0].classList.add('pagination__item--current');

    if (counter == 0) {
      disableButton(sliderButtonPrev, true);
    }

    if (sliderCards.length <= AMOUNT) {
      disableButton(sliderButtonPrev, true);
      disableButton(sliderButtonNext, true);
    } else {
      sliderButtonPrev.addEventListener('click', onSliderButtonPrevClick);
      sliderButtonNext.addEventListener('click', onSliderButtonNextClick);

      shiftPage()
    }
  }
  createPagination();
  scrollSlider();
})();

(function () {
  const accordion = document.querySelector('.accordion');
  const accordionTitles = accordion.querySelectorAll('.accordion__title');
  const accordionContents = accordion.querySelectorAll('.accordion__content');

  const ACCORDION_HIDDEN_CLASS = 'accordion__content--hidden';
  const ACCORDION_CURRENT_TITLE_CLASS = 'accordion__title--current';

  function closeAccordionContent() {
    accordionContents.forEach(function (elem) {
      elem.classList.add(ACCORDION_HIDDEN_CLASS);
    })
  }

  function changeAccordionTitle(currentTitle) {
    accordionTitles.forEach(function (title) {
      if (title !== currentTitle) {
        title.classList.remove(ACCORDION_CURRENT_TITLE_CLASS);
      }
    })
  }

  function openAccordion() {
    closeAccordionContent();
    accordionTitles.forEach(function (title) {
      title.addEventListener('click', function () {
        console.log(this);
        changeAccordionTitle(this);
        this.classList.toggle(ACCORDION_CURRENT_TITLE_CLASS);
        const content = this.nextElementSibling;
        accordionContents.forEach(function (elem) {
          if (elem === content) {
            elem.classList.toggle(ACCORDION_HIDDEN_CLASS);
          } else {
            elem.classList.add(ACCORDION_HIDDEN_CLASS);
          }
        })
      })
    })
  }

  openAccordion();
})();

(function () {
  const page = document.body;
  const loginButtons = document.querySelectorAll('.login');
  const loginTemplate = document.querySelector('#login').content.querySelector('.modal');
  const loginModal = loginTemplate.cloneNode(true);
  const closeLoginModalButton = loginModal.querySelector('.modal__close');
  const focusableElements = loginModal.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];
  const emailInput = loginModal.querySelector('input[type=email]');

  const CLASS_PAGE_OPENED_POPUP = 'page-body--opened-modal';

  function closeLoginModal() {
    page.removeChild(loginModal);
    page.classList.remove(CLASS_PAGE_OPENED_POPUP);

    document.removeEventListener('keydown', onDocumentKeydown);
    document.removeEventListener('click', onDocumentClick);
    closeLoginModalButton.removeEventListener('click', onCloseLoginModalButtonClick);
  }

  const onDocumentKeydown = function (evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      closeLoginModal();
    }
  };

  const onDocumentClick = function (evt) {
    loginButtons.forEach(function (button) {
      console.log(evt.target !== button);
      if (evt.target !== loginModal && !evt.target.classList.contains('login') && !loginModal.contains(evt.target)) {
        closeLoginModal();
      }
    })
  };

  const onCloseLoginModalButtonClick = function () {
    closeLoginModal();
  }

  function trapFocus() {
    loginModal.addEventListener('keydown', function (evt) {
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
      console.log(login)
      button.addEventListener('click', function (evt) {
        evt.preventDefault();
        page.prepend(loginModal);

        page.classList.add('page-body--opened-modal');
        emailInput.focus();
        trapFocus()

        document.addEventListener('keydown', onDocumentKeydown);
        document.addEventListener('click', onDocumentClick);
        closeLoginModalButton.addEventListener('click', onCloseLoginModalButtonClick);
      })
    })
  }

  openLoginModal();
})()
