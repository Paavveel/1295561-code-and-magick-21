'use strict';

const NAMES = [
  'Иван',
  'Хуан',
  'Себастьян',
  'Мария',
  'Кристоф',
  'Виктор',
  'Юлия',
  'Люпита',
  'Вашингтон',
];
const SURNAMES = [
  'да Марья',
  'Верон',
  'Мирабелла',
  'Вальц',
  'Онопко',
  'Топольницкая',
  'Нионго',
  'Ирвинг',
];
const COAT_COLORS = [
  'rgb(101, 137, 164)',
  'rgb(241, 43, 107)',
  'rgb(146, 100, 161)',
  'rgb(56, 159, 117)',
  'rgb(215, 210, 55)',
  'rgb(0, 0, 0)',
];
const EYES_COLORS = ['black', 'red', 'blue', 'yellow', 'green'];
const FIREBALL_COLORS = ['#ee4830', '#30a8ee', '#5ce6c0', '#e848d5', '#e6e848'];
const WIZARDS_AMOUNT = 4;
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 25;
const wizardsArray = [];

const setup = document.querySelector('.setup');
const setupOpen = document.querySelector('.setup-open');
const setupClose = setup.querySelector('.setup-close');
const setupUserName = setup.querySelector('.setup-user-name');

const similarListElement = setup.querySelector('.setup-similar-list');

function getRandomNumber(max) {
  return Math.floor(Math.random() * max);
}
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

function getRandomArray(names, surnames, coat, eyes) {
  const randomName = getRandomNumber(names.length);
  const randomSurname = getRandomNumber(surnames.length);
  const randomCoat = getRandomNumber(coat.length);
  const randomEye = getRandomNumber(eyes.length);

  const randomObject = {};

  randomObject.name = `${names[randomName]} ${surnames[randomSurname]}`;
  randomObject.coatColor = coat[randomCoat];
  randomObject.eyesColor = eyes[randomEye];

  return randomObject;
}

for (let i = 0; i < WIZARDS_AMOUNT; i++) {
  wizardsArray.push(getRandomArray(NAMES, SURNAMES, COAT_COLORS, EYES_COLORS));
}

const wizardTemplate = document
  .querySelector('#similar-wizard-template')
  .content.querySelector('.setup-similar-item');

const renderWizard = (array) => {
  const wizardElement = wizardTemplate.cloneNode(true);

  wizardElement.querySelector('.setup-similar-label').textContent = array.name;
  wizardElement.querySelector('.wizard-coat').style.fill = array.coatColor;
  wizardElement.querySelector('.wizard-eyes').style.fill = array.eyesColor;

  return wizardElement;
};

function getFragment(array, func) {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < array.length; i++) {
    fragment.append(func(array[i]));
  }
  return fragment;
}

const wizardsFragment = getFragment(wizardsArray, renderWizard);
similarListElement.append(wizardsFragment);
setup.querySelector('.setup-similar').classList.remove('hidden');

const openUserDialog = () => {
  setup.classList.remove('hidden');
};
const closeUserDialog = () => {
  setup.classList.add('hidden');
};
const onUserDialogEscPress = (evt) => {
  evt.preventDefault();
  isEscEvent(evt, closeUserDialog);
  document.removeEventListener('keydown', onUserDialogEscPress);
};

setupOpen.addEventListener('click', () => {
  openUserDialog();
  document.addEventListener('keydown', onUserDialogEscPress);
});
setupOpen.addEventListener('keydown', (evt) => {
  isEnterEvent(evt, openUserDialog);
  document.addEventListener('keydown', onUserDialogEscPress);
});

setupClose.addEventListener('click', () => {
  closeUserDialog();
  document.removeEventListener('keydown', onUserDialogEscPress);
});
setupClose.addEventListener('keydown', (evt) => {
  isEnterEvent(evt, closeUserDialog);
  document.removeEventListener('keydown', onUserDialogEscPress);
});

setupUserName.addEventListener('focus', () => {
  document.removeEventListener('keydown', onUserDialogEscPress);
});
setupUserName.addEventListener('blur', () => {
  document.addEventListener('keydown', onUserDialogEscPress);
});

setupUserName.addEventListener('input', () => {
  const nameLength = setupUserName.value.length;
  if (nameLength < MIN_NAME_LENGTH) {
    setupUserName.setCustomValidity(
      `Еще ${MIN_NAME_LENGTH - nameLength} симв.`
    );
  } else if (nameLength > MAX_NAME_LENGTH) {
    setupUserName.setCustomValidity(
      `Удалите лишние ${nameLength - MAX_NAME_LENGTH} симв.`
    );
  } else {
    setupUserName.setCustomValidity('');
  }
  setupUserName.reportValidity();
});

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
const wizardCoat = setup.querySelector('.setup-wizard .wizard-coat');
const coatInput = setup.querySelector('input[name=coat-color]');

const wizardEyes = setup.querySelector('.setup-wizard .wizard-eyes');
const eyesInput = setup.querySelector('input[name=eyes-color]');

const fireball = setup.querySelector('.setup-fireball-wrap');
const fireballInput = setup.querySelector('input[name=fireball-color]');

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

getSequenceColor(fireball, FIREBALL_COLORS, fireballInput);
getSequenceColor(wizardCoat, COAT_COLORS, coatInput);
getSequenceColor(wizardEyes, EYES_COLORS, eyesInput);
