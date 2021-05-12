(() => {
  'use strict';

  const setup = document.querySelector('.setup');
  const setupOpen = document.querySelector('.setup-open');
  const setupClose = setup.querySelector('.setup-close');
  const setupUserName = setup.querySelector('.setup-user-name');
  const similarListElement = setup.querySelector('.setup-similar-list');
  const form = setup.querySelector('.setup-wizard-form');

  // const wizardsArray = [];
  // for (let i = 0; i < window.data.WIZARDS_AMOUNT; i++) {
  //   wizardsArray.push(
  //     window.util.getRandomArray(
  //       window.data.NAMES,
  //       window.data.SURNAMES,
  //       window.data.COAT_COLORS,
  //       window.data.EYES_COLORS
  //     )
  //   );
  // }

  const wizardTemplate = document
    .querySelector('#similar-wizard-template')
    .content.querySelector('.setup-similar-item');

  const renderWizard = (array) => {
    const wizardElement = wizardTemplate.cloneNode(true);

    wizardElement.querySelector('.setup-similar-label').textContent =
      array.name;
    wizardElement.querySelector('.wizard-coat').style.fill = array.colorCoat;
    wizardElement.querySelector('.wizard-eyes').style.fill = array.colorEyes;

    return wizardElement;
  };

  const successHandler = (array) => {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < window.data.WIZARDS_AMOUNT; i++) {
      fragment.append(renderWizard(array[i]));
    }

    similarListElement.append(fragment);

    setup.querySelector('.setup-similar').classList.remove('hidden');
  };

  const errorHandler = (errorMassage) => {
    const element = document.createElement('div');
    element.style =
      'z-index: 999; margin: 0 auto; text-align: center; bacground-color: red;';
    element.style.position = 'absolute';
    element.style.left = 0;
    element.style.right = 0;
    element.style.fontSize = '30px';

    element.textContent = errorMassage;
    document.body.insertAdjacentElement('afterbegin', element);
  };

  window.backend.load(
    'GET',
    'https://21.javascript.pages.academy/code-and-magick/data',
    successHandler,
    errorHandler
  );

  const submitSuccesHandler = () => {
    setup.classList.add('hidden');
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

  const openUserDialog = () => {
    setup.classList.remove('hidden');
  };
  const closeUserDialog = () => {
    setup.classList.add('hidden');
  };
  const onUserDialogEscPress = (evt) => {
    evt.preventDefault();
    window.util.isEscEvent(evt, closeUserDialog);
    document.removeEventListener('keydown', onUserDialogEscPress);
  };

  setupOpen.addEventListener('click', () => {
    openUserDialog();
    document.addEventListener('keydown', onUserDialogEscPress);
  });
  setupOpen.addEventListener('keydown', (evt) => {
    window.util.isEnterEvent(evt, openUserDialog);
    document.addEventListener('keydown', onUserDialogEscPress);
  });

  setupClose.addEventListener('click', () => {
    closeUserDialog();
    document.removeEventListener('keydown', onUserDialogEscPress);
  });
  setupClose.addEventListener('keydown', (evt) => {
    window.util.isEnterEvent(evt, closeUserDialog);
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
    if (nameLength < window.data.MIN_NAME_LENGTH) {
      setupUserName.setCustomValidity(
        `Еще ${window.data.MIN_NAME_LENGTH - nameLength} симв.`
      );
    } else if (nameLength > window.data.MAX_NAME_LENGTH) {
      setupUserName.setCustomValidity(
        `Удалите лишние ${nameLength - window.data.MAX_NAME_LENGTH} симв.`
      );
    } else {
      setupUserName.setCustomValidity('');
    }
    setupUserName.reportValidity();
  });

  const wizardCoat = setup.querySelector('.setup-wizard .wizard-coat');
  const coatInput = setup.querySelector('input[name=coat-color]');

  const wizardEyes = setup.querySelector('.setup-wizard .wizard-eyes');
  const eyesInput = setup.querySelector('input[name=eyes-color]');

  const fireball = setup.querySelector('.setup-fireball-wrap');
  const fireballInput = setup.querySelector('input[name=fireball-color]');

  window.util.getSequenceColor(
    fireball,
    window.data.FIREBALL_COLORS,
    fireballInput
  );
  window.util.getSequenceColor(wizardCoat, window.data.COAT_COLORS, coatInput);
  window.util.getSequenceColor(wizardEyes, window.data.EYES_COLORS, eyesInput);

  const upload = setup.querySelector('.upload');

  upload.addEventListener('mousedown', (evt) => {
    evt.preventDefault();

    let startCoords = {
      x: evt.clientX,
      y: evt.clientY,
    };

    let dragged = false;

    const onMouseMove = (moveEvt) => {
      moveEvt.preventDefault();

      dragged = true;

      const shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY,
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY,
      };

      setup.style.top = `${setup.offsetTop - shift.y}px`;
      setup.style.left = `${setup.offsetLeft - shift.x}px`;
    };

    const onMouseUp = (upEvt) => {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (dragged) {
        const onClickPreventDefault = (clickEvt) => {
          clickEvt.preventDefault();

          upload.removeEventListener('click', onClickPreventDefault);
        };
        upload.addEventListener('click', onClickPreventDefault);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
