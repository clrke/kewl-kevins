import Coordinates from "../models/Coordinates";

enum Direction {
  UP,
  RIGHT,
  DOWN,
  LEFT,
}

export function directionToInt(direction: Coordinates) {
  if (direction.y < 0) {
    return Direction.UP;
  }
  if (direction.y > 0) {
    return Direction.DOWN;
  }
  if (direction.x < 0) {
    return Direction.LEFT;
  }
  return Direction.RIGHT;
}

export default Direction;
