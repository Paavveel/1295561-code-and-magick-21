(() => {
  'use strict';

  // function getRandomNumber(max) {
  //   return Math.floor(Math.random() * max);
  // }
  function isEscEvent(evt, action) {
    if (evt.key === 'Escape') {
      action();
    }
  }
  function isEnterEvent(evt, action) {
    if (evt.key === 'Enter') {
      action();
    }
  }

  // function getRandomArray(names, surnames, coat, eyes) {
  //   const randomName = getRandomNumber(names.length);
  //   const randomSurname = getRandomNumber(surnames.length);
  //   const randomCoat = getRandomNumber(coat.length);
  //   const randomEye = getRandomNumber(eyes.length);

  //   const randomObject = {};

  //   randomObject.name = `${names[randomName]} ${surnames[randomSurname]}`;
  //   randomObject.coatColor = coat[randomCoat];
  //   randomObject.eyesColor = eyes[randomEye];

  //   return randomObject;
  // }

  // function getFragment(array, func) {
  //   const fragment = document.createDocumentFragment();
  //   for (let i = 0; i < window.WIZARDS_AMOUNT; i++) {
  //     fragment.append(func(array[i]));
  //   }
  //   return fragment;
  // }

  function sequenceNumber(start, end) {
    let number = start;
    return () => {
      if (number < end) {
        number++;
      } else {
        number = start;
      }
      return number;
    };
  }

  function getSequenceColor(element, color, input) {
    const colorCounter = sequenceNumber(0, color.length - 1);

    element.addEventListener('click', () => {
      const currentIndex = color[colorCounter()];
      if (element.tagName === 'DIV') {
        element.style.background = currentIndex;
      } else {
        element.style.fill = currentIndex;
      }

      input.value = currentIndex;
    });
  }

  window.util = {
    isEscEvent,
    isEnterEvent,
    getSequenceColor,
  };
})();
