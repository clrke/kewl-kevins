import Coordinates from "../models/Coordinates";
import { PUZZLE_HEIGHT, PUZZLE_WIDTH } from "../constants/tiles";

export default function findObstaclePosition(props: {
  playerPosition: Coordinates,
  playerMovement: Coordinates,
  obstacles: Coordinates[],
}) : Coordinates {
  if (props.playerMovement.x === 0 && props.playerMovement.y === 0) {
    throw new Error('Player movement is zero');
  }
  if (props.playerMovement.x > 0) {
    return props.obstacles
      .filter(o => o.y === props.playerPosition.y)
      .filter(o => o.x > props.playerPosition.x)
      .sort((a, b) => b.x - a.x)[0] ?? new Coordinates(PUZZLE_WIDTH + 1, props.playerPosition.y);

  }
  if (props.playerMovement.x < 0) {
    return props.obstacles
      .filter(o => o.y === props.playerPosition.y)
      .filter(o => o.x < props.playerPosition.x)
      .sort((a, b) => a.x - b.x)[0] ?? new Coordinates(0, props.playerPosition.y);
  }
  if (props.playerMovement.y > 0) {
    return props.obstacles
      .filter(o => o.x === props.playerPosition.x)
      .filter(o => o.y > props.playerPosition.y)
      .sort((a, b) => a.y - b.y)[0] ?? new Coordinates(props.playerPosition.x, PUZZLE_HEIGHT + 1);
  }
  return props.obstacles
    .filter(o => o.x === props.playerPosition.x)
      .filter(o => o.y < props.playerPosition.y)
    .sort((a, b) => b.y - a.y)[0] ?? new Coordinates(props.playerPosition.x, 0);
}
