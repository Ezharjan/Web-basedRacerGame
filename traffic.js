function Traffic() {
  var context;
  var initialCarsYPosition = -100;

  var cars = [];
  var totalCreatedCars = 0;

  var carPlayer;

  this.emptyLane;
  this.nextEmptyLane;

  var crashAudio = new Audio("sounds/crash.mp3");
  var playedCrash;

  this.initialize = function (canvas, scenario, carPlayerPar) {
    playedCrash = false;
    this.canvas = canvas;
    context = canvas.getContext("2d");

    carPlayer = carPlayerPar;

    this.scenario = scenario;

    this.nextEmptyLane = Util.getRandomIntBetweenInterval(
      0,
      GameConfig.scenario.numberOfLanes - 1
    );
    this.emptyLane = this.nextEmptyLane;

    this.createCars();
  };

  this.createCars = function () {
    for (var i = 0; i < GameConfig.traffic.numCars; i++) {
      cars[i] = this.tryCreateCar(i);
    }
  };

  this.createCar = function (idCar, lanePar) {
    var c = new Car();
    var carTypesNumber = c.getCarTypeNumber() - 1;
    var carType = Util.getRandomIntBetweenInterval(0, carTypesNumber);

    c.initialize(initialCarsYPosition, carType, idCar);
    c.setCurrentLane(lanePar);
    c.setCarSpeed(Math.random());

    var carsInLaneTemp = this.carsInLane(lanePar);
    var maxSpeed = 0;

    for (var i = 0; i < carsInLaneTemp.length; i++) {
      if (carsInLaneTemp[i].getCarSpeed() > maxSpeed) {
        maxSpeed = carsInLaneTemp[i].getCarSpeed();
      }
    }

    while (c.getCarSpeed() < maxSpeed - 0.1) {
      c.setCarSpeed(Math.random());
    }

    return c;
  };

  this.tryCreateCar = function (idCar) {
    var currentLane = Util.getRandomIntBetweenInterval(
      0,
      GameConfig.scenario.numberOfLanes - 1
    );
    while (currentLane == this.emptyLane || currentLane == this.nextEmptyLane) {
      currentLane = Util.getRandomIntBetweenInterval(
        0,
        GameConfig.scenario.numberOfLanes - 1
      );
    }

    if (this.canCreateCarInLane(currentLane)) {
      totalCreatedCars++;
      return this.createCar(idCar, currentLane);
    } else {
      return undefined;
    }
  };

  this.canCreateCarInLane = function (lanePar) {
    var carsInCurrentLane = this.carsInLane(lanePar);

    for (var i = 0; i < carsInCurrentLane.length; i++) {
      if (carsInCurrentLane[i].y < 120) {
        return false;
      }
    }

    return true;
  };

  this.draw = function (context) {
    for (var i = 0; i < cars.length; i++) {
      if (cars[i]) {
        cars[i].drawCar(context);
      }
    }
  };

  this.update = function () {
    for (var i = 0; i < cars.length; i++) {
      var currentCar = cars[i];
      if (currentCar) {
        currentCar.update();
        var newPosition = currentCar.getY() + currentCar.carSpeed;

        currentCar.setY(newPosition);

        // "Remove" car if it is out of canvas
        if (currentCar.getY() > this.canvas.height) {
          cars[i] = undefined;
        }
      } else {
        cars[i] = this.tryCreateCar(i);
      }
    }

    for (var i = 0; i < GameConfig.scenario.numberOfLanes; i++) {
      var carsInCurrentLane = this.carsInLane(i);
      this.verifyColisionInLane(carsInCurrentLane);
    }

    if (carPlayer) {
      this.verifyPlayerCollision();
      this.verifyCollisionWithObstacles();
    }

    this.startChangingEmptyLane();
    this.tryChangeEmptyLane();
  };

  this.startChangingEmptyLane = function () {
    var changeEmptyLaneProbability = Math.random();

    if (changeEmptyLaneProbability < 0.002) {
      if (this.nextEmptyLane == this.emptyLane) {
        this.nextEmptyLane = Util.getRandomIntBetweenInterval(
          0,
          GameConfig.scenario.numberOfLanes - 1
        );
        while (this.nextEmptyLane == this.emptyLane) {
          this.nextEmptyLane = Util.getRandomIntBetweenInterval(
            0,
            GameConfig.scenario.numberOfLanes - 1
          );
        }
      }
    }
  };

  this.tryChangeEmptyLane = function () {
    if (this.nextEmptyLane != this.emptyLane) {
      // if has nothing on lane change the empty lane
      if (!this.hasSomethingOnLane(this.nextEmptyLane)) {
        this.emptyLane = this.nextEmptyLane;
      }
    }
  };

  this.hasObstaclesInLane = function (lanePar) {
    if (this.scenario) {
      return (
        (this.scenario.oil && this.scenario.oil.lane == lanePar) ||
        (this.scenario.pothole && this.scenario.pothole.lane == lanePar)
      );
    } else {
      return false;
    }
  };

  this.hasSomethingOnLane = function (lanePar) {
    var hasObjs = this.hasObstaclesInLane(lanePar);
    var carsInlaneTemp = this.carsInLane(lanePar);
    var hasCars = carsInlaneTemp.length > 0;

    return hasObjs || hasCars;
  };

  this.carsInLane = function (lanePar) {
    var carsInLane = [];
    var index = 0;
    for (var i = 0; i < cars.length; i++) {
      if (cars[i]) {
        if (cars[i].getCurrentLane() == lanePar) {
          carsInLane[index] = cars[i];
          index++;
        }
      }
    }

    return carsInLane;
  };

  this.verifyColisionInLane = function (carsInCurrentLane) {
    if (carsInCurrentLane.length > 1) {
      var collisionCars = this.createCollisionMap(carsInCurrentLane.length);

      // Reset near status for each car in lane
      for (var i = 0; i < carsInCurrentLane.length; i++) {
        carsInCurrentLane[i].carNearMyFront = undefined;
        carsInCurrentLane[i].carNearMyBack = undefined;
      }

      // Test collision on symmetric matrix only
      for (var i = 0; i < carsInCurrentLane.length; i++) {
        for (var j = i + 1; j < carsInCurrentLane.length; j++) {
          if (
            CollisionDetection.isNear(
              carsInCurrentLane[i].collisionArea,
              carsInCurrentLane[j].collisionArea
            )
          ) {
            // store the car that is in the front
            if (carsInCurrentLane[i].y < carsInCurrentLane[j].y) {
              carsInCurrentLane[i].carNearMyBack = carsInCurrentLane[j];
              carsInCurrentLane[j].carNearMyFront = carsInCurrentLane[i];
            } else {
              carsInCurrentLane[j].carNearMyBack = carsInCurrentLane[i];
              carsInCurrentLane[i].carNearMyFront = carsInCurrentLane[j];
            }
          }

          if (
            CollisionDetection.isCollide(
              carsInCurrentLane[i].collisionArea,
              carsInCurrentLane[j].collisionArea
            )
          ) {
            collisionCars[i] = 1;
            collisionCars[j] = 1;
          }
        }
      }

      this.setWillCollideCars(carsInCurrentLane, collisionCars);
    }
  };

  this.verifyPlayerCollision = function () {
    carPlayer.setIsColliding(false);
    carPlayer.carNearMyFront = undefined;

    for (var i = 0; i < cars.length; i++) {
      if (cars[i]) {
        if (
          CollisionDetection.isCollide(
            carPlayer.collisionArea,
            cars[i].collisionArea
          )
        ) {
          carPlayer.setIsColliding(true);

          Game.gameOver();

          if (!playedCrash) {
            crashAudio.volume = 0.5;
            crashAudio.play();
            playedCrash = true;
          }

          return;
        }

        if (
          CollisionDetection.isNear(
            carPlayer.collisionArea,
            cars[i].collisionArea
          )
        ) {
          carPlayer.carNearMyFront = cars[i];
        }
      }
    }
  };

  this.verifyCollisionWithObstacles = function () {
    if (this.scenario && carPlayer) {
      if (
        this.scenario.oil &&
        CollisionDetection.isCollide(
          carPlayer.collisionArea,
          this.scenario.oil.collisionArea
        )
      ) {
        carPlayer.isSliding = true;
      }

      if (
        this.scenario.pothole &&
        CollisionDetection.isCollide(
          carPlayer.collisionArea,
          this.scenario.pothole.collisionArea
        )
      ) {
        carPlayer.passedOnPothole = true;
      }
    }
  };

  this.setWillCollideCars = function (carsArray, collisionCars) {
    for (var i = 0; i < collisionCars.length; i++) {
      if (collisionCars[i] == 1) {
        carsArray[i].setIsColliding(true);
      } else {
        carsArray[i].setIsColliding(false);
      }
    }
  };

  this.createCollisionMap = function (size) {
    var map = [];

    for (var i = 0; i < size; i++) {
      map[i] = 0;
    }

    return map;
  };
}
