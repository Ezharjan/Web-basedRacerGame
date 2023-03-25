var Util = {};

Util.getRandomIntBetweenInterval = function (min, max) {
  var value = Math.floor(Math.random() * (max - min + 1)) + min;
  return value;
};

Util.drawGuidelines = function (context) {
  var initialPosition = 100;

  // Horizontal lines
  for (var i = 0; i < 5; i++) {
    context.beginPath();
    context.moveTo(0, initialPosition);
    context.lineTo(800, initialPosition);
    context.stroke();
    initialPosition += 100;
  }

  initialPosition = 160;

  // Vertical lines
  for (var i = 0; i < 5; i++) {
    context.beginPath();
    context.moveTo(initialPosition, 0);
    context.lineTo(initialPosition, 600);
    context.stroke();
    initialPosition += GameConfig.scenario.lanesSize;
  }
};

Util.drawLog = function (context, text) {
  context.fillText(text, 680, 50);
};

Util.drawTextWithShadow = function (
  context,
  text,
  x,
  y,
  textColor,
  shadowOffsetX,
  shadowOffsetY,
  shadowColor
) {
  context.save();
  context.fillStyle = shadowColor;
  context.fillText(text, x + shadowOffsetX, y + shadowOffsetY);

  context.fillStyle = textColor;
  context.fillText(text, x, y);
  context.restore();
};

Util.drawPressAnyKey = function (context) {
  context.save();

  context.globalAlpha = 0.5;
  context.fillRect(185, 470, 430, 40);

  context.globalAlpha = 1;
  Util.drawTextWithShadow(
    context,
    "PRESS ANY KEY TO START!",
    200,
    500,
    "yellow",
    2,
    2,
    "red"
  );

  context.restore();
};
