'use strict';

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

const createErrorMassage = (massage) => {
  const element = document.createElement('div');
  element.style =
    'z-index: 999; margin: 0 auto; text-align: center; background-color: red;';
  element.style.position = 'absolute';
  element.style.left = 0;
  element.style.right = 0;
  element.style.fontSize = '30px';

  element.textContent = massage;
  document.body.insertAdjacentElement('afterbegin', element);
};

const DEBOUNCE_INTERVAL = 500;

const debounce = (cb) => {
  let lastTimeout = null;

  return (...parameters) => {
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }
    lastTimeout = setTimeout(() => {
      cb(...parameters);
    }, DEBOUNCE_INTERVAL);
  };
};

window.util = {
  isEscEvent,
  isEnterEvent,
  sequenceNumber,
  createErrorMassage,
  debounce,
};
