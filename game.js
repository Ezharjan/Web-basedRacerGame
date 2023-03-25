var Game = {};
var scenario = new Scenario();
var player = new Car();
var levelController = new LevelController();
var traffic = new Traffic();
var score = new Score();
var totalPoints;
var lastPoints;

Game.canvasHeight = 600;
Game.canvasWidth = 800;

Game.initialFps = 100;
Game.fps = Game.initialFps;
Game.skipTicks = 1000 / Game.fps;

var position = 0;
var leftArrowKeyCode = 37;
var rightArrowKeyCode = 39;

var isGameOver = false;
var gameStarted = false;

var gameThemeSound = new Audio("sounds/game_theme.mp3");
var gameOverThemeSound = new Audio("sounds/gameOver_theme.mp3");

Game.initialize = function () {
  this.entities = [];
  this.canvas = document.getElementById("canvas");
  this.context = canvas.getContext("2d");

  // Defaulf Font
  this.context.font = "30px Arial";

  Game.showStartScreen();

  document.addEventListener(
    "keydown",
    function (event) {
      if (event.keyCode == leftArrowKeyCode) {
        player.moveToLeft();
      } else if (event.keyCode == rightArrowKeyCode) {
        player.moveToRight();
      }

      if (!gameStarted) {
        gameStarted = true;
        isGameOver = false;
        Game.startGame();
      }
    },
    false
  );
};

Game.showStartScreen = function () {
  levelController.initialize(Game.fps);
  scenario.initialize(canvas);
  traffic.initialize(this.canvas, scenario);
  score.initialize();
  gameOverThemeSound.play();

  gameThemeSound.pause();
  gameThemeSound.currentTime = 0;
};

Game.startGame = function () {
  gameThemeSound.currentTime = 0;
  gameThemeSound.play();

  gameThemeSound.addEventListener(
    "ended",
    function () {
      this.currentTime = 2.5;
      this.play();
    },
    false
  );

  gameOverThemeSound.pause();
  gameOverThemeSound.currentTime = 0;

  totalPoints = 0;
  lastPoints = 0;

  Game.fps = Game.initialFps;
  Game.skipTicks = 1000 / Game.fps;

  levelController.initialize(Game.fps);
  player.initialize(
    GameConfig.player.yPosition,
    GameConfig.player.carType,
    GameConfig.player.carId
  );
  scenario.initialize(canvas);
  traffic.initialize(this.canvas, scenario, player);
  score.resetScore();
};

Game.gameOver = function () {
  isGameOver = true;
  gameStarted = false;
  gameThemeSound.pause();
  gameThemeSound.currentTime = 0;
  gameOverThemeSound.play();
};

Game.draw = function (points) {
  this.context.clearRect(0, 0, Game.canvasWidth, Game.canvasHeight);

  // Your code goes here

  scenario.drawRoad(this.context);
  traffic.draw(this.context);

  if (gameStarted) {
    player.drawCar(this.context);
    totalPoints = (lastPoints / 10).toFixed(0);
    score.draw(this.context, totalPoints);
  } else if (isGameOver) {
    score.currentPoints = totalPoints;
    score.highScore =
      score.currentPoints > score.highScore
        ? score.currentPoints
        : score.highScore;
    score.draw(this.context, totalPoints);
    score.drawGameOverScreen(this.context);
    Util.drawPressAnyKey(this.context);
  } else {
    Util.drawPressAnyKey(this.context);
    score.draw(this.context, 0);
  }

  if (GameConfig.debug.showGuideLines) {
    Util.drawGuidelines(this.context);
  }
};

Game.update = function () {
  // Your code goes here

  scenario.updateRoad(traffic.emptyLane);
  traffic.update(this.context);

  if (gameStarted) {
    player.update();

    if (player.passedOnPothole) {
      lastPoints = lastPoints - GameConfig.obstacle.pointsLossOnPothole;
      if (lastPoints < 0) {
        lastPoints = 0;
      }
      player.passedOnPothole = false;
    }

    Game.fps = levelController.increaseSpeed();
    lastPoints++;
  }
};
