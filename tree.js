function Tree() {
  this.width = 80;
  this.height = 80;
  this.x;
  this.y;
  this.isOnScreen;
  this.side;

  var self = this;

  var image = new Image();

  this.initialize = function (initialPosition, sidePar) {
    this.side = sidePar;

    image.src = this.getRandomTreeImageSrc();

    this.x = this.newXPosition();
    this.y = (-60 - this.height) * initialPosition;
    this.isOnScreen = true;
  };

  this.draw = function (context) {
    context.drawImage(image, this.x, this.y, this.width, this.height);
  };

  this.update = function (maxY) {
    this.y += 1;
    if (this.y >= maxY) {
      this.isOnScreen = false;
      this.y = -this.height;
      this.x = this.newXPosition();
    } else {
      this.isOnScreen = true;
    }
  };

  this.newXPosition = function () {
    if (this.side == 0) {
      return Math.random() * (170 - this.width);
    } else {
      return 650 + Math.random() * (160 - this.width);
    }
  };

  this.getRandomTreeImageSrc = function () {
    var imageSrcArray = [];

    imageSrcArray[0] = "sprites/scenario/tree1.png";
    imageSrcArray[1] = "sprites/scenario/tree2.png";

    var index = Util.getRandomIntBetweenInterval(0, imageSrcArray.length - 1);

    return imageSrcArray[index];
  };
}
