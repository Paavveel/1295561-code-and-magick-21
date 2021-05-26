'use strict';

let wizards = [];

const getRank = (wizard) => {
  let rank = 0;

  if (wizard.colorCoat === window.data.coatColor) {
    rank += 2;
  }
  if (wizard.colorEyes === window.data.eyesColor) {
    rank += 1;
  }

  return rank;
};

const namesComparator = (left, right) => {
  if (left > right) {
    return 1;
  } else if (left < right) {
    return -1;
  } else {
    return 0;
  }
};

const updateWizards = () => {
  window.render.render(
    wizards.filter((left, right) => {
      let rankDiff = getRank(right) - getRank(left);
      if (rankDiff === 0) {
        rankDiff = namesComparator(left.name, right.name);
      }
      return rankDiff;
    })
  );
};

const successHandler = (data) => {
  wizards = data;
  updateWizards();
};

const errorHandler = (errorMassage) => {
  window.util.createErrorMassage(errorMassage);
};

window.backend.load(
  'GET',
  'https://21.javascript.pages.academy/code-and-magick/data',
  successHandler,
  errorHandler
);

const form = document.querySelector('.setup-wizard-form');

const submitSuccesHandler = () => {
  document.querySelector('.setup').classList.add('hidden');
};

const submitHandler = (evt) => {
  evt.preventDefault();

  window.backend.load(
    'POST',
    'https://21.javascript.pages.academy/code-and-magick',
    submitSuccesHandler,
    errorHandler,
    new FormData(form)
  );
};

form.addEventListener('submit', submitHandler);

window.script = {
  updateWizards,
};
