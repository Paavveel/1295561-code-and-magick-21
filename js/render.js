'use strict';

const wizardTemplate = document
  .querySelector('#similar-wizard-template')
  .content.querySelector('.setup-similar-item');

const renderWizard = (array) => {
  const wizardElement = wizardTemplate.cloneNode(true);

  wizardElement.querySelector('.setup-similar-label').textContent = array.name;
  wizardElement.querySelector('.wizard-coat').style.fill = array.colorCoat;
  wizardElement.querySelector('.wizard-eyes').style.fill = array.colorEyes;

  return wizardElement;
};

const similar = document.querySelector('.setup-similar');
const similarList = document.querySelector('.setup-similar-list');

const render = (array) => {
  const fragment = document.createDocumentFragment();
  const takeNumber =
    array.length > window.data.WIZARDS_AMOUNT
      ? window.data.WIZARDS_AMOUNT
      : array.length;

  for (let i = 0; i < takeNumber; i++) {
    fragment.append(renderWizard(array[i]));
  }
  similarList.innerHTML = '';
  similarList.append(fragment);

  similar.classList.remove('hidden');
};

window.render = {
  render,
};
