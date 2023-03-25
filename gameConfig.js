var GameConfig = {
  debug: {},
  collision: {},
  scenario: {},
  traffic: {},
  level: {},
  obstacle: {},
  player: {},
};

GameConfig.debug.showCollisionArea = false;
GameConfig.debug.showCarId = false;
GameConfig.debug.showGuideLines = false;

GameConfig.collision.nearDistanceX = 10;
GameConfig.collision.nearDistanceY = 100;

GameConfig.scenario.numberOfLanes = 4;
GameConfig.scenario.lanesSize = 120;

GameConfig.traffic.minCarSpeed = 0.4;
GameConfig.traffic.maxCarSpeed = 0.9;
GameConfig.traffic.numCars = 5;

GameConfig.level.amountIncrease = 0.05;

GameConfig.obstacle.pointsLossOnPothole = 20;
GameConfig.obstacle.pothole = 1;
GameConfig.obstacle.oil = 2;

/* CAR TYPES
	0 = Ambulance
	1 = Audi
	2 = Black_viper
	3 = Car
	4 = Mini_truck
	5 = Mini_van
	6 = Police
	7 = Taxi
	8 = Truck
*/
GameConfig.player.carType = 1;
GameConfig.player.yPosition = 500;
GameConfig.player.carId = 99;
