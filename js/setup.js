(() => {
  'use strict';

  const setup = document.querySelector('.setup');
  const setupOpen = document.querySelector('.setup-open');
  const setupClose = setup.querySelector('.setup-close');
  const setupUserName = setup.querySelector('.setup-user-name');

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

  function getSequenceColor(element, color, input) {
    const colorCounter = window.util.sequenceNumber(0, color.length - 1);

    const [firstColor] = color;

    switch (element) {
      case wizardCoat:
        window.data.coatColor = firstColor;
        break;

      case wizardEyes:
        window.data.eyesColor = firstColor;

        break;
      default:
        break;
    }

    element.addEventListener('click', () => {
      const currentIndex = color[colorCounter()];

      if (element.tagName === 'DIV') {
        element.style.background = currentIndex;
      } else {
        element.style.fill = currentIndex;
      }

      switch (element) {
        case wizardCoat:
          window.data.coatColor = currentIndex;
          break;

        case wizardEyes:
          window.data.eyesColor = currentIndex;

          break;
        default:
          break;
      }

      input.value = currentIndex;
      window.script.updateWizards();
    });
  }

  getSequenceColor(fireball, window.data.FIREBALL_COLORS, fireballInput);
  getSequenceColor(wizardCoat, window.data.COAT_COLORS, coatInput);
  getSequenceColor(wizardEyes, window.data.EYES_COLORS, eyesInput);

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
