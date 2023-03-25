var CollisionDetection = {};

CollisionDetection.isCollide = function (obj1, obj2) {
  return (
    CollisionDetection.isCollideY(obj1, obj2) &&
    CollisionDetection.isCollideX(obj1, obj2)
  );
};

CollisionDetection.isCollideX = function (obj1, obj2) {
  return CollisionDetection.isNearX(obj1, obj2, -1);
};

CollisionDetection.isCollideY = function (obj1, obj2) {
  return CollisionDetection.isNearY(obj1, obj2, -1);
};

CollisionDetection.isNear = function (obj1, obj2) {
  return (
    CollisionDetection.isNearY(
      obj1,
      obj2,
      GameConfig.collision.nearDistanceY
    ) &&
    CollisionDetection.isNearX(obj1, obj2, GameConfig.collision.nearDistanceX)
  );
};

CollisionDetection.isNearY = function (obj1, obj2, nearDistanceY) {
  var distance = nearDistanceY;

  if (distance < 0) {
    distance = 0;
  }

  if (obj1.y <= obj2.y && obj1.y + obj1.height + distance >= obj2.y) {
    return true;
  } else if (obj2.y <= obj1.y && obj2.y + obj2.height + distance >= obj1.y) {
    return true;
  } else {
    return false;
  }
};

CollisionDetection.isNearX = function (obj1, obj2, nearDistanceX) {
  var distance = nearDistanceX;

  if (distance < 0) {
    distance = 0;
  }

  if (obj1.x <= obj2.x && obj1.x + obj1.width + distance >= obj2.x) {
    return true;
  } else if (obj2.x <= obj1.x && obj2.x + obj2.width + distance >= obj1.x) {
    return true;
  } else {
    return false;
  }
};
