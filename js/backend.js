'use strict';

const StatusCode = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
};

const TIMEOUT = 10000;

const load = (requestMethod, url, onLoad, onError, data) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.timeout = TIMEOUT;
  xhr.open(requestMethod, url);

  if (requestMethod === 'GET') {
    xhr.send();
  } else if (requestMethod === 'POST') {
    xhr.send(data);
  }

  xhr.addEventListener('load', () => {
    let error;

    switch (xhr.status) {
      case StatusCode.OK:
        onLoad(xhr.response);
        break;
      case StatusCode.BAD_REQUEST:
        error = 'Неверный запрос';
        break;
      case StatusCode.UNAUTHORIZED:
        error = 'Пользователь не авторизован';
        break;
      case StatusCode.NOT_FOUND:
        error = 'Ничего не найдено';
        break;

      default:
        error = `Cтатус ответа: : ${xhr.status} ${xhr.statusText}`;
        break;
    }

    if (error) {
      onError(error);
    }
  });

  xhr.addEventListener('error', () => {
    onError('Произошла ошибка соединения');
  });

  xhr.addEventListener('timeout', () => {
    onError(`Запрос не успел выполниться за ${xhr.timeout}мс`);
  });
};

window.backend = {
  load,
};
