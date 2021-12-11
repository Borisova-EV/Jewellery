(function () {
  const accordion = document.querySelector('.accordion');

  const ACCORDION_HIDDEN_CLASS = 'accordion__content--hidden';
  const ACCORDION_CURRENT_TITLE_CLASS = 'accordion__title--current';

  function closeAccordionContent(content) {
    content.forEach(function (elem) {
      elem.classList.add(ACCORDION_HIDDEN_CLASS);
    })
  }

  function openAccordion() {
    if (accordion) {
      const accordionTitles = accordion.querySelectorAll('.accordion__title');
      const accordionContents = accordion.querySelectorAll('.accordion__content');

      closeAccordionContent(accordionContents);
      accordionTitles.forEach(function (title) {
        title.addEventListener('click', function () {
          this.classList.toggle(ACCORDION_CURRENT_TITLE_CLASS);
          const content = this.nextElementSibling;
          accordionContents.forEach(function (elem) {
            if (elem === content) {
              elem.classList.toggle(ACCORDION_HIDDEN_CLASS);
            }
          })
        })
      })
    }
  }

  openAccordion();
})();
