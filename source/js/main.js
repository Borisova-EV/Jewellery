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
  const pages = document.querySelectorAll('.pagination__item');

  let smallDevice = window.matchMedia("(max-width: 1023px)");

  let counter = 0;
  let almost = smallDevice.matches ? 2 : 4;
  let position = 0;


  const GAP_CARDS = 30;

  const almostPages = sliderCards.length / almost;

  function disableButton(button) {
    button.setAttribute('disabled', 'disabled');
  }

  function activateButton(button) {
    button.removeAttribute('disabled', 'disabled');
  }


  function changeStatusButton() {
    if (counter == 0) {
      disableButton(sliderButtonPrev);
      activateButton(sliderButtonNext);
    } else if (counter > 0 && counter < (almostPages - 1)) {
      activateButton(sliderButtonNext);
      activateButton(sliderButtonPrev)
    } else {
      disableButton(sliderButtonNext);
    }
  }

  function changeCurrentPage(index) {
    pages[index].classList.remove('pagination__item--current');
    pages[counter].classList.add('pagination__item--current');
  }

  const onSliderButtonPrevClick = function () {
    if (counter == 0) {
      disableButton(sliderButtonPrev);
    } else {
      counter--;
      position += (slider.offsetWidth + GAP_CARDS);
      slider.style.marginLeft = position + 'px';

      const previousIndex = counter + 1;
      changeCurrentPage(previousIndex);

      if (counter < (almostPages - 1)) {
        activateButton(sliderButtonNext);
        activateButton(sliderButtonPrev);
      }
    }
  }

  const onSliderButtonNextClick = function () {
    counter++;
    position -= (slider.offsetWidth + GAP_CARDS);
    slider.style.marginLeft = position + 'px';
    if (counter > 0) {
      activateButton(sliderButtonPrev);
    }

    const previousIndex = counter - 1;
    changeCurrentPage(previousIndex);

    if (counter >= (almostPages - 1)) {
      disableButton(sliderButtonNext);
    }
  }


  function shiftPage() {
    pages.forEach(function (page) {
      page.addEventListener('click', function (evt) {
        evt.preventDefault();
        pages.forEach((page) => page.classList.remove('pagination__item--current'));
        this.classList.add('pagination__item--current');
        counter = this.textContent - 1;
        position = -(slider.offsetWidth + GAP_CARDS) * counter;
        slider.style.marginLeft = position + 'px';
        changeStatusButton();
      })
    })
  }

  function scrollSlider() {
    sliderButtonPrev.classList.remove('control--nojs');
    sliderButtonNext.classList.remove('control--nojs');
    slider.classList.remove('slider__list--nojs');

    if (counter == 0) {
      disableButton(sliderButtonPrev);
    }

    if (sliderCards.length <= almost) {
      disableButton(sliderButtonPrev);
      disableButton(sliderButtonNext);
    } else {
      sliderButtonPrev.addEventListener('click', onSliderButtonPrevClick);
      sliderButtonNext.addEventListener('click', onSliderButtonNextClick);

      shiftPage()
    }
  }

  scrollSlider();
  window.addEventListener('resize', () => scrollSlider());
})()
