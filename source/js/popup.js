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
