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
const WIZARDS_AMOUNT = 4;
const wizardsArray = [];

const userDialog = document.querySelector('.setup');
userDialog.classList.remove('hidden');
const similarListElement = userDialog.querySelector('.setup-similar-list');

function getRandomNumber(max) {
  return Math.floor(Math.random() * max);
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
userDialog.querySelector('.setup-similar').classList.remove('hidden');
