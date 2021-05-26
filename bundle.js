/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!********************!*\
  !*** ./js/game.js ***!
  \********************/
/* eslint-disable indent */


let fireballSize = 22;
let getFireballSpeed = function (isMovingLeft) {
  return isMovingLeft ? 2 : 5;
};
let wizardWidth = 70;
let getWizardHeight = function () {
  return 1.337 * wizardWidth;
};
let wizardSpeed = 3;
let getWizardX = function (gameFieldWidth) {
  return (gameFieldWidth - wizardWidth) / 2;
};
let getWizardY = function (gameFieldHeight) {
  return gameFieldHeight / 3;
};

window.GameConstants = {
  Fireball: {
    size: fireballSize || 24,
    speed: getFireballSpeed || function (movingLeft) {
      return movingLeft ? 2 : 5;
    }
  },
  Wizard: {
    speed: wizardSpeed || 2,
    width: wizardWidth || 61,
    getHeight: getWizardHeight || function (width) {
      return 1.377 * width;
    },
    getX: getWizardX || function (width) {
      return width / 3;
    },
    getY: getWizardY || function (height) {
      return height - 100;
    }
  }
};

window.Game = (function () {
  /**
   * @const
   * @type {number}
   */
  let HEIGHT = 300;

  /**
   * @const
   * @type {number}
   */
  let WIDTH = 700;

  /**
   * ID уровней.
   * @enum {number}
   */
  let Level = {
    INTRO: 0,
    MOVE_LEFT: 1,
    MOVE_RIGHT: 2,
    LEVITATE: 3,
    HIT_THE_MARK: 4
  };

  let NAMES = [`Кекс`, `Катя`, `Игорь`];

  /**
   * Порядок прохождения уровней.
   * @type {Array.<Level>}
   */
  let LevelSequence = [
    Level.INTRO
  ];

  /**
   * Начальный уровень.
   * @type {Level}
   */
  let INITIAL_LEVEL = LevelSequence[0];

  /**
   * Допустимые виды объектов на карте.
   * @enum {number}
   */
  let ObjectType = {
    ME: 0,
    FIREBALL: 1
  };

  /**
   * Допустимые состояния объектов.
   * @enum {number}
   */
  let ObjectState = {
    OK: 0,
    DISPOSED: 1
  };

  /**
   * Коды направлений.
   * @enum {number}
   */
  let Direction = {
    NULL: 0,
    LEFT: 1,
    RIGHT: 2,
    UP: 4,
    DOWN: 8
  };

  /**
   * Карта спрайтов игры.
   * @type {Object.<ObjectType, Object>}
   */
  let SpriteMap = {};
  let REVERSED = `-reversed`;

  SpriteMap[ObjectType.ME] = {
    width: 61,
    height: 84,
    url: `img/wizard.gif`
  };

  // TODO: Find a clever way
  SpriteMap[ObjectType.ME + REVERSED] = {
    width: 61,
    height: 84,
    url: `img/wizard-reversed.gif`
  };

  SpriteMap[ObjectType.FIREBALL] = {
    width: 24,
    height: 24,
    url: `img/fireball.gif`
  };

  /**
   * Правила перерисовки объектов в зависимости от состояния игры.
   * @type {Object.<ObjectType, function(Object, Object, number): Object>}
   */
  let ObjectsBehaviour = {};

  /**
   * Обновление движения мага. Движение мага зависит от нажатых в данный момент
   * стрелок. Маг может двигаться одновременно по горизонтали и по вертикали.
   * На движение мага влияет его пересечение с препятствиями.
   * @param {Object} object
   * @param {Object} state
   * @param {number} timeframe
   */
  ObjectsBehaviour[ObjectType.ME] = function (object, state, timeframe) {
    // Пока зажата стрелка вверх, маг сначала поднимается, а потом левитирует
    // в воздухе на определенной высоте.
    // NB! Сложность заключается в том, что поведение описано в координатах
    // канваса, а не координатах, относительно нижней границы игры.
    if (state.keysPressed.UP && object.y > 0) {
      object.direction = object.direction & ~Direction.DOWN;
      object.direction = object.direction | Direction.UP;
      object.y -= object.speed * timeframe * 2;
    }

    // Если стрелка вверх не зажата, а маг находится в воздухе, он плавно
    // опускается на землю.
    if (!state.keysPressed.UP) {
      if (object.y < HEIGHT - object.height) {
        object.direction = object.direction & ~Direction.UP;
        object.direction = object.direction | Direction.DOWN;
        object.y += object.speed * timeframe / 3;
      }
    }

    // Если зажата стрелка влево, маг перемещается влево.
    if (state.keysPressed.LEFT) {
      object.direction = object.direction & ~Direction.RIGHT;
      object.direction = object.direction | Direction.LEFT;
      object.x -= object.speed * timeframe;
    }

    // Если зажата стрелка вправо, маг перемещается вправо.
    if (state.keysPressed.RIGHT) {
      object.direction = object.direction & ~Direction.LEFT;
      object.direction = object.direction | Direction.RIGHT;
      object.x += object.speed * timeframe;
    }

    // Ограничения по перемещению по полю. Маг не может выйти за пределы поля.
    if (object.y < 0) {
      object.y = 0;
    }

    if (object.y > HEIGHT - object.height) {
      object.y = HEIGHT - object.height;
    }

    if (object.x < 0) {
      object.x = 0;
    }

    if (object.x > WIDTH - object.width) {
      object.x = WIDTH - object.width;
    }
  };

  /**
   * Обновление движения файрбола. Файрбол выпускается в определенном направлении
   * и после этого неуправляемо движется по прямой в заданном направлении. Если
   * он пролетает весь экран насквозь, он исчезает.
   * @param {Object} object
   * @param {Object} _state
   * @param {number} timeframe
   */
  ObjectsBehaviour[ObjectType.FIREBALL] = function (object, _state, timeframe) {
    if (object.direction & Direction.LEFT) {
      object.x -= object.speed * timeframe;
    }

    if (object.direction & Direction.RIGHT) {
      object.x += object.speed * timeframe;
    }

    if (object.x < 0 || object.x > WIDTH) {
      object.state = ObjectState.DISPOSED;
    }
  };

  /**
   * ID возможных ответов функций, проверяющих успех прохождения уровня.
   * CONTINUE говорит о том, что раунд не закончен и игру нужно продолжать,
   * WIN о том, что раунд выигран, FAIL — о поражении. PAUSE о том, что игру
   * нужно прервать.
   * @enum {number}
   */
  let Verdict = {
    CONTINUE: 0,
    WIN: 1,
    FAIL: 2,
    PAUSE: 3,
    INTRO: 4
  };

  /**
   * Правила завершения уровня. Ключами служат ID уровней, значениями функции
   * принимающие на вход состояние уровня и возвращающие true, если раунд
   * можно завершать или false если нет.
   * @type {Object.<Level, function(Object):boolean>}
   */
  let LevelsRules = {};

  /**
   * Уровень считается пройденным, если был выпущен файлболл и он улетел
   * за экран.
   * @param {Object} state
   * @return {Verdict}
   */
  LevelsRules[Level.INTRO] = function (state) {
    let deletedFireballs = state.garbage.filter(function (object) {
      return object.type === ObjectType.FIREBALL;
    });

    let fenceHit = deletedFireballs.filter(function (fireball) {
      // Did we hit the fence?
      return fireball.x < 10 && fireball.y > 240;
    })[0];

    return fenceHit ? Verdict.WIN : Verdict.CONTINUE;
  };

  /**
   * Начальные условия для уровней.
   * @enum {Object.<Level, function>}
   */
  let LevelsInitialize = {};

  /**
   * Первый уровень.
   * @param {Object} state
   * @return {Object}
   */
  LevelsInitialize[Level.INTRO] = function (state) {
    state.objects.push(
      // Установка персонажа в начальное положение. Он стоит в крайнем левом
      // углу экрана, глядя вправо. Скорость перемещения персонажа на этом
      // уровне равна 2px за кадр.
      {
        direction: Direction.RIGHT,
        height: window.GameConstants.Wizard.getHeight(window.GameConstants.Wizard.width),
        speed: window.GameConstants.Wizard.speed,
        sprite: SpriteMap[ObjectType.ME],
        state: ObjectState.OK,
        type: ObjectType.ME,
        width: window.GameConstants.Wizard.width,
        x: window.GameConstants.Wizard.getX(WIDTH),
        y: window.GameConstants.Wizard.getY(HEIGHT)
      }
    );

    return state;
  };

  /**
   * Конструктор объекта Game. Создает canvas, добавляет обработчики событий
   * и показывает приветственный экран.
   * @param {Element} container
   * @constructor
   */
  let Game = function (container) {
    this.container = container;
    this.canvas = document.createElement(`canvas`);
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
    this.container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext(`2d`);

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._pauseListener = this._pauseListener.bind(this);

    this.setDeactivated(false);
  };

  Game.prototype = {
    /**
     * Текущий уровень игры.
     * @type {Level}
     */
    level: INITIAL_LEVEL,

    /** @param {boolean} deactivated */
    setDeactivated(deactivated) {
      if (this._deactivated === deactivated) {
        return;
      }

      this._deactivated = deactivated;

      if (deactivated) {
        this._removeGameListeners();
      } else {
        this._initializeGameListeners();
      }
    },

    /**
     * Состояние игры. Описывает местоположение всех объектов на игровой карте
     * и время проведенное на уровне и в игре.
     * @return {Object}
     */
    getInitialState() {
      return {
        // Статус игры. Если CONTINUE, то игра продолжается.
        currentStatus: Verdict.CONTINUE,

        // Объекты, удаленные на последнем кадре.
        garbage: [],

        // Время с момента отрисовки предыдущего кадра.
        lastUpdated: null,

        // Состояние нажатых клавиш.
        keysPressed: {
          ESC: false,
          LEFT: false,
          RIGHT: false,
          SPACE: false,
          UP: false
        },

        // Время начала прохождения уровня.
        levelStartTime: null,

        // Все объекты на карте.
        objects: [],

        // Время начала прохождения игры.
        startTime: null
      };
    },

    /**
     * Начальные проверки и запуск текущего уровня.
     * @param {boolean=} restart
     */
    initializeLevelAndStart(restart) {
      restart = typeof restart === `undefined` ? true : restart;

      if (restart || !this.state) {
        // сбросить кэш при перезагрузке уровня
        this._imagesArePreloaded = void 0;

        // При перезапуске уровня, происходит полная перезапись состояния
        // игры из изначального состояния.
        this.state = this.getInitialState();
        this.state = LevelsInitialize[this.level](this.state);
      } else {
        // При продолжении уровня состояние сохраняется, кроме записи о том,
        // что состояние уровня изменилось с паузы на продолжение игры.
        this.state.currentStatus = Verdict.CONTINUE;
      }

      // Запись времени начала игры и времени начала уровня.
      this.state.levelStartTime = Date.now();
      if (!this.state.startTime) {
        this.state.startTime = this.state.levelStartTime;
      }

      this._preloadImagesForLevel(function () {
        // Предварительная отрисовка игрового экрана.
        this.render();

        // Установка обработчиков событий.
        this._initializeGameListeners();

        // Запуск игрового цикла.
        this.update();
      }.bind(this));
    },

    /**
     * Временная остановка игры.
     * @param {Verdict=} verdict
     */
    pauseLevel(verdict) {
      if (verdict) {
        this.state.currentStatus = verdict;
      }

      this.state.keysPressed.ESC = false;
      this.state.lastUpdated = null;

      this._removeGameListeners();
      window.addEventListener(`keydown`, this._pauseListener);

      this._drawPauseScreen();
    },

    /**
     * Обработчик событий клавиатуры во время паузы.
     * @param {KeyboardsEvent} evt
     * @private
     * @private
     */
    _pauseListener(evt) {
      if (evt.keyCode === 32 && !this._deactivated) {
        evt.preventDefault();
        let needToRestartTheGame = this.state.currentStatus === Verdict.WIN ||
          this.state.currentStatus === Verdict.FAIL;
        this.initializeLevelAndStart(needToRestartTheGame);

        window.removeEventListener(`keydown`, this._pauseListener);
      }
    },

    /**
     * Отрисовка экрана паузы.
     */
    _drawPauseScreen() {
      let message;
      switch (this.state.currentStatus) {
        case Verdict.WIN:
          if (window.renderStatistics) {
            let statistics = this._generateStatistics(new Date() - this.state.startTime);
            let keys = this._shuffleArray(Object.keys(statistics));
            window.renderStatistics(this.ctx, keys, keys.map(function (it) {
              return statistics[it];
            }));
            return;
          }
          message = `Вы победили Газебо!\nУра!`;
          break;
        case Verdict.FAIL:
          message = `Вы проиграли!`;
          break;
        case Verdict.PAUSE:
          message = `Игра на паузе!\nНажмите Пробел, чтобы продолжить`;
          break;
        case Verdict.INTRO:
          message = `Добро пожаловать!\nНажмите Пробел для начала игры`;
          break;
      }

      this._drawMessage(message);
    },

    _generateStatistics(time) {
      let generationIntervalSec = 3000;
      let minTimeInSec = 1000;

      let statistic = {
        'Вы': time
      };

      for (let i = 0; i < NAMES.length; i++) {
        let diffTime = Math.random() * generationIntervalSec;
        let userTime = time + (diffTime - generationIntervalSec / 2);
        if (userTime < minTimeInSec) {
          userTime = minTimeInSec;
        }
        statistic[NAMES[i]] = userTime;
      }

      return statistic;
    },

    _shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    },

    _drawMessage(message) {
      let ctx = this.ctx;

      let drawCloud = function (x, y, width, heigth) {
        let offset = 10;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + offset, y + heigth / 2);
        ctx.lineTo(x, y + heigth);
        ctx.lineTo(x + width / 2, y + heigth - offset);
        ctx.lineTo(x + width, y + heigth);
        ctx.lineTo(x + width - offset, y + heigth / 2);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width / 2, y + offset);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();
        ctx.fill();
      };

      ctx.fillStyle = `rgba(0, 0, 0, 0.7)`;
      drawCloud(190, 40, 320, 100);

      ctx.fillStyle = `rgba(256, 256, 256, 1.0)`;
      drawCloud(180, 30, 320, 100);

      ctx.fillStyle = `#000`;
      ctx.font = `16px PT Mono`;
      message.split(`\n`).forEach(function (line, i) {
        ctx.fillText(line, 200, 80 + 20 * i);
      });
    },

    /**
     * Предзагрузка необходимых изображений для уровня.
     * @param {function} callback
     * @private
     */
    _preloadImagesForLevel(callback) {
      if (typeof this._imagesArePreloaded === `undefined`) {
        this._imagesArePreloaded = [];
      }

      if (this._imagesArePreloaded[this.level]) {
        callback();
        return;
      }

      let keys = Object.keys(SpriteMap);
      let imagesToGo = keys.length;

      let self = this;

      let loadSprite = function (sprite) {
        let image = new Image(sprite.width, sprite.height);
        image.onload = function () {
          sprite.image = image;
          if (--imagesToGo === 0) {
            self._imagesArePreloaded[self.level] = true;
            callback();
          }
        };
        image.src = sprite.url;
      };

      for (let i = 0; i < keys.length; i++) {
        loadSprite(SpriteMap[keys[i]]);
      }
    },

    /**
     * Обновление статуса объектов на экране. Добавляет объекты, которые должны
     * появиться, выполняет проверку поведения всех объектов и удаляет те, которые
     * должны исчезнуть.
     * @param {number} delta Время, прошеднее с отрисовки прошлого кадра.
     */
    updateObjects(delta) {
      // Персонаж.
      let me = this.state.objects.filter(function (object) {
        return object.type === ObjectType.ME;
      })[0];

      // Добавляет на карту файрбол по нажатию на Shift.
      if (this.state.keysPressed.SHIFT) {
        this.state.objects.push({
          direction: me.direction,
          height: window.GameConstants.Fireball.size,
          speed: window.GameConstants.Fireball.speed(!!(me.direction & Direction.LEFT)),
          sprite: SpriteMap[ObjectType.FIREBALL],
          type: ObjectType.FIREBALL,
          width: window.GameConstants.Fireball.size,
          x: me.direction & Direction.RIGHT ? me.x + me.width : me.x - window.GameConstants.Fireball.size,
          y: me.y + me.height / 2
        });

        this.state.keysPressed.SHIFT = false;
      }

      this.state.garbage = [];

      // Убирает в garbage не используемые на карте объекты.
      let remainingObjects = this.state.objects.filter(function (object) {
        ObjectsBehaviour[object.type](object, this.state, delta);

        if (object.state === ObjectState.DISPOSED) {
          this.state.garbage.push(object);
          return false;
        }

        return true;
      }, this);

      this.state.objects = remainingObjects;
    },

    /**
     * Проверка статуса текущего уровня.
     */
    checkStatus() {
      // Нет нужны запускать проверку, нужно ли останавливать уровень, если
      // заранее известно, что да.
      if (this.state.currentStatus !== Verdict.CONTINUE) {
        return;
      }

      if (!this.commonRules) {
        // Проверки, не зависящие от уровня, но влияющие на его состояние.
        this.commonRules = [

          /**
           * Если персонаж мертв, игра прекращается.
           * @param {Object} state
           * @return {Verdict}
           */
          function (state) {
            let me = state.objects.filter(function (object) {
              return object.type === ObjectType.ME;
            })[0];

            return me.state === ObjectState.DISPOSED ?
              Verdict.FAIL :
              Verdict.CONTINUE;
          },

          /**
           * Если нажата клавиша Esc игра ставится на паузу.
           * @param {Object} state
           * @return {Verdict}
           */
          function (state) {
            return state.keysPressed.ESC ? Verdict.PAUSE : Verdict.CONTINUE;
          },

          /**
           * Игра прекращается если игрок продолжает играть в нее два часа подряд.
           * @param {Object} state
           * @return {Verdict}
           */
          function (state) {
            return Date.now() - state.startTime > 3 * 60 * 1000 ?
              Verdict.FAIL :
              Verdict.CONTINUE;
          }
        ];
      }

      // Проверка всех правил влияющих на уровень. Запускаем цикл проверок
      // по всем универсальным проверкам и проверкам конкретного уровня.
      // Цикл продолжается до тех пор, пока какая-либо из проверок не вернет
      // любое другое состояние кроме CONTINUE или пока не пройдут все
      // проверки. После этого состояние сохраняется.
      let allChecks = this.commonRules.concat(LevelsRules[this.level]);
      let currentCheck = Verdict.CONTINUE;
      let currentRule;

      while (currentCheck === Verdict.CONTINUE && allChecks.length) {
        currentRule = allChecks.shift();
        currentCheck = currentRule(this.state);
      }

      this.state.currentStatus = currentCheck;
    },

    /**
     * Принудительная установка состояния игры. Используется для изменения
     * состояния игры от внешних условий, например, когда необходимо остановить
     * игру, если она находится вне области видимости и установить вводный
     * экран.
     * @param {Verdict} status
     */
    setGameStatus(status) {
      if (this.state.currentStatus !== status) {
        this.state.currentStatus = status;
      }
    },

    /**
     * Отрисовка всех объектов на экране.
     */
    render() {
      // Удаление всех отрисованных на странице элементов.
      this.ctx.clearRect(0, 0, WIDTH, HEIGHT);

      // Выставление всех элементов, оставшихся в this.state.objects согласно
      // их координатам и направлению.
      this.state.objects.forEach(function (object) {
        if (object.sprite) {
          let reversed = object.direction & Direction.LEFT;
          let sprite = SpriteMap[object.type + (reversed ? REVERSED : ``)] || SpriteMap[object.type];
          this.ctx.drawImage(sprite.image, object.x, object.y, object.width, object.height);
        }
      }, this);
    },

    /**
     * Основной игровой цикл. Сначала проверяет состояние всех объектов игры
     * и обновляет их согласно правилам их поведения, а затем запускает
     * проверку текущего раунда. Рекурсивно продолжается до тех пор, пока
     * проверка не вернет состояние FAIL, WIN или PAUSE.
     */
    update() {
      if (!this.state.lastUpdated) {
        this.state.lastUpdated = Date.now();
      }

      let delta = (Date.now() - this.state.lastUpdated) / 10;
      this.updateObjects(delta);
      this.checkStatus();

      switch (this.state.currentStatus) {
        case Verdict.CONTINUE:
          this.state.lastUpdated = Date.now();
          this.render();
          requestAnimationFrame(function () {
            this.update();
          }.bind(this));
          break;

        case Verdict.WIN:
        case Verdict.FAIL:
        case Verdict.PAUSE:
        case Verdict.INTRO:
          this.pauseLevel();
          break;
      }
    },

    /**
     * @param {KeyboardEvent} evt [description]
     * @private
     */
    _onKeyDown(evt) {
      switch (evt.keyCode) {
        case 37:
          this.state.keysPressed.LEFT = true;
          break;
        case 39:
          this.state.keysPressed.RIGHT = true;
          break;
        case 38:
          this.state.keysPressed.UP = true;
          break;
        case 27:
          this.state.keysPressed.ESC = true;
          break;
      }

      if (evt.shiftKey) {
        this.state.keysPressed.SHIFT = true;
      }
    },

    /**
     * @param {KeyboardEvent} evt [description]
     * @private
     */
    _onKeyUp(evt) {
      switch (evt.keyCode) {
        case 37:
          this.state.keysPressed.LEFT = false;
          break;
        case 39:
          this.state.keysPressed.RIGHT = false;
          break;
        case 38:
          this.state.keysPressed.UP = false;
          break;
        case 27:
          this.state.keysPressed.ESC = false;
          break;
      }

      if (evt.shiftKey) {
        this.state.keysPressed.SHIFT = false;
      }
    },

    /** @private */
    _initializeGameListeners() {
      window.addEventListener(`keydown`, this._onKeyDown);
      window.addEventListener(`keyup`, this._onKeyUp);
    },

    /** @private */
    _removeGameListeners() {
      window.removeEventListener(`keydown`, this._onKeyDown);
      window.removeEventListener(`keyup`, this._onKeyUp);
    }
  };

  Game.Verdict = Verdict;

  let game = new Game(document.querySelector(`.demo`));

  window.restartGame = function (wizardRightImage, wizardLeftImage) {
    SpriteMap[ObjectType.ME].url = wizardRightImage;
    SpriteMap[ObjectType.ME + REVERSED].url = wizardLeftImage;

    game.initializeLevelAndStart();
    game.setGameStatus(Verdict.INTRO);
  };

  window.restartGame(`img/wizard.gif`, `img/wizard-reversed.gif`);

  return game;
})();

})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!********************!*\
  !*** ./js/stat.js ***!
  \********************/


const CLOUD_WIDTH = 420;
const CLOUD_HEIGHT = 270;
const CLOUD_X = 100;
const CLOUD_Y = 10;
const TEXT_X = 120;
const TEXT_Y = 30;
const GAP = 10;
const TEXT_GAP = 20;
const COLUMN_GAP = 40;
const BAR_WIDTH = 40;
const BAR_HEIGHT = 150;
const SCORE_HEIGHT = 230;
const MAX_COLOR = 100;

const renderCloud = (ctx, x, y, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, CLOUD_WIDTH, CLOUD_HEIGHT);
};

const getMaxElement = (arr) => {
  let maxElement = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > maxElement) {
      maxElement = arr[i];
    }
  }

  return maxElement;
};

const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

window.renderStatistics = (ctx, players, times) => {
  renderCloud(ctx, CLOUD_X + GAP, CLOUD_Y + GAP, 'rgba(0, 0, 0, 0.7)');
  renderCloud(ctx, CLOUD_X, CLOUD_Y, '#fff');

  ctx.fillStyle = '#000';
  ctx.textBaseline = 'hanging';
  ctx.font = '16px PT Mono';
  ctx.fillText('Ура вы победили!', TEXT_X, TEXT_Y);
  ctx.fillText('Список результатов:', TEXT_X, TEXT_Y + TEXT_GAP);

  const maxTime = getMaxElement(times);

  for (let i = 0; i < players.length; i++) {
    const roundedTime = Math.round(times[i]);

    ctx.fillText(
      players[i],
      CLOUD_X + COLUMN_GAP + (COLUMN_GAP + BAR_WIDTH) * i,
      CLOUD_HEIGHT - GAP
    );

    const currentBarHeight = (BAR_HEIGHT * times[i]) / maxTime;

    ctx.save();
    if (players[i] === 'Вы') {
      ctx.fillStyle = 'rgba(255, 0, 0, 1)';
    } else {
      ctx.fillStyle = `hsl(237, 100%, ${getRandomInt(MAX_COLOR)}%)`;
    }
    ctx.fillRect(
      CLOUD_X + COLUMN_GAP + (COLUMN_GAP + BAR_WIDTH) * i,
      CLOUD_HEIGHT - GAP * 2,
      BAR_WIDTH,
      -currentBarHeight
    );
    ctx.restore();

    ctx.fillText(
      roundedTime,
      CLOUD_X + COLUMN_GAP + (COLUMN_GAP + BAR_WIDTH) * i,
      -currentBarHeight + SCORE_HEIGHT
    );
  }
};

})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!********************!*\
  !*** ./js/data.js ***!
  \********************/


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

let coatColor;
let eyesColor;

window.data = {
  COAT_COLORS,
  EYES_COLORS,
  FIREBALL_COLORS,
  WIZARDS_AMOUNT,
  MIN_NAME_LENGTH,
  MAX_NAME_LENGTH,
  coatColor,
  eyesColor,
};

})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!********************!*\
  !*** ./js/util.js ***!
  \********************/


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

})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***********************!*\
  !*** ./js/backend.js ***!
  \***********************/


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

})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/


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

})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*********************!*\
  !*** ./js/setup.js ***!
  \*********************/


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
  const debouncer = window.util.debounce(window.script.updateWizards);

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

    debouncer();
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

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./js/render.js ***!
  \**********************/


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

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************!*\
  !*** ./js/avatar.js ***!
  \**********************/
'use stcrict';

const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

const fileChooser = document.querySelector('.upload input[type=file]');
const preview = document.querySelector('.setup-user-pic');

fileChooser.addEventListener('change', () => {
  const [file] = fileChooser.files;
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((type) => fileName.endsWith(type));

  if (matches) {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.addEventListener('load', () => {
      preview.src = reader.result;
    });
  }
});

})();

/******/ })()
;