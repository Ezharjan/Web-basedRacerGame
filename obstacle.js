function Obstacle() {
  this.width = 80;
  this.height = 70;
  this.x;
  this.y;
  this.isOnRoad;
  this.lane;
  this.type;

  var self = this;

  var image = new Image();

  this.initialize = function (emptyLane, type) {
    this.type = type;

    if (this.type == GameConfig.obstacle.oil) {
      image.src = "sprites/obstacles/oil.png";
    } else {
      image.src = this.getRandomPotholeImageSrc();
    }

    this.x = this.newXPosition(emptyLane);
    this.y = -this.height;
    this.isOnRoad = true;

    this.collisionArea = {
      x: self.x,
      y: self.y,
      /* reduce collision area in order to let car's front wheels pass onto the pothole 
			before indicate a collision (this behavior is more realist) */
      height: self.height - 60,
      width: self.width,
    };
  };

  this.draw = function (context) {
    context.drawImage(image, this.x, this.y, this.width, this.height);

    if (GameConfig.debug.showCollisionArea) {
      context.strokeRect(
        this.collisionArea.x,
        this.collisionArea.y,
        this.collisionArea.width,
        this.collisionArea.height
      );
    }
  };

  this.update = function (maxY) {
    this.y += 1;
    if (this.y >= maxY) {
      this.isOnRoad = false;
    } else {
      this.isOnRoad = true;
    }
    this.collisionArea.x = this.x;
    this.collisionArea.y = this.y;
  };

  this.newXPosition = function (emptyLane) {
    var newRandom = Util.getRandomIntBetweenInterval(
      0,
      GameConfig.scenario.numberOfLanes - 1
    );
    while (newRandom == emptyLane) {
      newRandom = Util.getRandomIntBetweenInterval(
        0,
        GameConfig.scenario.numberOfLanes - 1
      );
    }

    this.lane = newRandom;

    return 180 + GameConfig.scenario.lanesSize * newRandom;
  };

  // This function is only for Pothole
  this.getRandomPotholeImageSrc = function () {
    var imageSrcArray = [];

    imageSrcArray[0] = "sprites/obstacles/pothole1.png";
    imageSrcArray[1] = "sprites/obstacles/pothole2.png";
    imageSrcArray[2] = "sprites/obstacles/pothole3.png";

    var index = Util.getRandomIntBetweenInterval(0, imageSrcArray.length - 1);

    return imageSrcArray[index];
  };
}
