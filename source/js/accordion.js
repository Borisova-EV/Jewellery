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
