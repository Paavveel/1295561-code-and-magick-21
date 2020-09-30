"use strict";

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


const renderCloud = function (ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, CLOUD_WIDTH, CLOUD_HEIGHT);
};

const getMaxElement = function (arr) {
  let maxElement = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > maxElement) {
      maxElement = arr[i];
    }
  }

  return maxElement;
};

const getRandomInt = function (max) {
  return Math.floor(Math.random() * Math.floor(max));
};

window.renderStatistics = function (ctx, players, times) {
  renderCloud(ctx, CLOUD_X + GAP, CLOUD_Y + GAP, `rgba(0, 0, 0, 0.7)`);
  renderCloud(ctx, CLOUD_X, CLOUD_Y, `#fff`);

  ctx.fillStyle = `#000`;
  ctx.textBaseline = `hanging`;
  ctx.font = `16px PT Mono`;
  ctx.fillText(`Ура вы победили!`, TEXT_X, TEXT_Y);
  ctx.fillText(`Список результатов:`, TEXT_X, TEXT_Y + TEXT_GAP);

  let maxTime = getMaxElement(times);

  for (let i = 0; i < players.length; i++) {
    let roundedTime = Math.round(times[i]);

    ctx.fillText(players[i], CLOUD_X + COLUMN_GAP + (COLUMN_GAP + BAR_WIDTH) * i, CLOUD_HEIGHT - GAP);

    let currentBarHeight = (BAR_HEIGHT * times[i]) / maxTime;

    ctx.save();
    if (players[i] === `Вы`) {
      ctx.fillStyle = `rgba(255, 0, 0, 1)`;
    } else {
      ctx.fillStyle = `hsl(237, 100%, ${getRandomInt(MAX_COLOR)}%)`;
    }
    ctx.fillRect(CLOUD_X + COLUMN_GAP + (COLUMN_GAP + BAR_WIDTH) * i, CLOUD_HEIGHT - GAP * 2, BAR_WIDTH, -currentBarHeight);
    ctx.restore();

    ctx.fillText(roundedTime, CLOUD_X + COLUMN_GAP + (COLUMN_GAP + BAR_WIDTH) * i, -currentBarHeight + SCORE_HEIGHT);
  }
};
