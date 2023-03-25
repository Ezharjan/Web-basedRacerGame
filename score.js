function Score() {
  this.initialize = function () {
    this.highScore = 0;
    this.currentScore = 0;
    this.showScore = false;
    this.alpha = 0.0;
    this.alphaText = 0.0;
  };

  this.resetScore = function () {
    this.currentScore = 0;
    this.alpha = 0.0;
    this.alphaText = 0.0;
  };

  this.draw = function (context, pointsPar) {
    this.currentScore = pointsPar;

    Util.drawTextWithShadow(context, "SCORE", 660, 50, "white", 2, 2, "red");
    Util.drawTextWithShadow(
      context,
      this.currentScore,
      660,
      90,
      "yellow",
      2,
      2,
      "red"
    );

    Util.drawTextWithShadow(context, "HIGH", 660, 180, "white", 2, 2, "red");
    Util.drawTextWithShadow(context, "SCORE", 660, 210, "white", 2, 2, "red");

    Util.drawTextWithShadow(
      context,
      this.highScore,
      660,
      250,
      "yellow",
      2,
      2,
      "red"
    );
  };

  this.drawGameOverScreen = function (context) {
    context.save();

    // Show score slowly
    this.alpha = this.alpha >= 0.6 ? this.alpha : this.alpha + 0.01;
    context.globalAlpha = this.alpha;
    context.fillRect(0, 0, Game.canvasWidth, Game.canvasHeight);

    context.fillRect(150, 200, 500, Game.canvasHeight / 3);

    // Show score slowly
    this.alphaText = this.alphaText >= 1 ? 1 : this.alphaText + 0.01;
    context.globalAlpha = this.alphaText;

    context.font = "bold 50px Arial";
    Util.drawTextWithShadow(
      context,
      "GAME OVER",
      250,
      260,
      "red",
      2,
      2,
      "yellow"
    );

    context.font = "46px Arial";
    Util.drawTextWithShadow(context, "SCORE", 237, 320, "white", 2, 2, "red");
    Util.drawTextWithShadow(
      context,
      this.currentScore,
      410,
      320,
      "yellow",
      2,
      2,
      "red"
    );

    context.font = "30px Arial";

    Util.drawTextWithShadow(
      context,
      "HIGH SCORE",
      210,
      380,
      "white",
      2,
      2,
      "red"
    );
    Util.drawTextWithShadow(
      context,
      this.highScore,
      410,
      380,
      "yellow",
      2,
      2,
      "red"
    );

    context.restore();
  };
}
