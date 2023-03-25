function LevelController() {
  this.initialize = function (speed) {
    this.currentSpeed = speed;
  };

  this.increaseSpeed = function () {
    this.currentSpeed += GameConfig.level.amountIncrease;
    return this.currentSpeed;
  };
}
