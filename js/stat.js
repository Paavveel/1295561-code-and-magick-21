"use strict";

let CLOUD_WIDTH = 420;
let CLOUD_HEIGHT = 270;
let CLOUD_X = 100;
let CLOUD_Y = 10;
let GAP = 10;
let COLUMN_GAP = 40;
let BAR_WIDTH = 40;
let BAR_HEIGHT = 150;

const COLORS = [`#ff0000`, `#98d9d9`, `#98d9d9`, `#98d9d9`];

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

window.renderStatistics = function (ctx, players, times) {
  renderCloud(ctx, CLOUD_X + GAP, CLOUD_Y + GAP, `rgba(0, 0, 0, 0.7)`);
  renderCloud(ctx, CLOUD_X, CLOUD_Y, `#fff`);

  ctx.fillStyle = `#000`;
  ctx.textBaseline = `hanging`;
  ctx.font = `16px PT Mono`;
  ctx.fillText(`Ура вы победили!`, 120, 30);
  ctx.fillText(`Список результатов:`, 120, 50);

  let maxTime = getMaxElement(times);

  for (let i = 0; i < players.length; i++) {
    ctx.fillText(players[i], CLOUD_X + COLUMN_GAP + (COLUMN_GAP + BAR_WIDTH) * i, CLOUD_HEIGHT - GAP);

    let currentBarHeight = (BAR_HEIGHT * times[i]) / maxTime;

    ctx.save();
    ctx.fillStyle = COLORS[i];
    ctx.fillRect(CLOUD_X + COLUMN_GAP + (COLUMN_GAP + BAR_WIDTH) * i, CLOUD_HEIGHT - GAP * 2, BAR_WIDTH, -currentBarHeight);
    ctx.restore();

    ctx.fillText(Math.round(times[i]), CLOUD_X + COLUMN_GAP + (COLUMN_GAP + BAR_WIDTH) * i, -currentBarHeight + 230);
  }
};
