import React, { useReducer, useState } from 'react';
import styled from 'styled-components';
import findMoveDistance from '../helpers/findMoveDistance';
import findObstaclePosition from '../helpers/findObstaclePosition';
import Coordinates from '../models/Coordinates';
import '../App.css';
import useSound from 'use-sound';
import slideSfx from '../audio/slideSfx.mp3';
import ConnectionSection from "./ConnectionSection";
import { PUZZLE_HEIGHT, PUZZLE_WIDTH, TILE_SIZE } from "../constants/tiles";
import Player from "./Player";
import Obstacle, { BumpInfo } from "./Obstacle";
import Direction, { directionToInt } from "./Direction";

const Container = styled.div`
  position: absolute;
  width: ${() => `${TILE_SIZE * (PUZZLE_WIDTH + 2)}px`};
  height: ${() => `${TILE_SIZE * (PUZZLE_HEIGHT + 2)}px`};
`;

const GameActions = styled.div`
  position: fixed;
  top: 24px;
  left: 24px;
  width: 240px;
  height: 180px;
  z-index: 200;
`;

const GameController = styled.div`
  position: fixed;
  bottom: 24px;
  left: 24px;
  width: 240px;
  height: 180px;
  z-index: 200;

  > button {
    position: absolute;
    border-radius: 100%;
    height: 70px;
    width: 70px;
    border: 2px solid #000;
    background-color: #88f;
    color: white;
    cursor: pointer;

    transition: background-color 0.2s ease-in-out;

    :hover {
      background-color: #44f;
    }

    :first-child {
      right: 54px;
    }

    :nth-child(2) {
      top: 54px;
      right: 108px;
    }

    :nth-child(3) {
      top: 54px;
      right: 0;
    }

    :nth-child(4) {
      right: 54px;
      bottom: 0;
    }
  }
`;

const ADD_BUMP = 'ADD_BUMP';
const RESTART_BUMPS = 'RESTART_BUMPS';

type BUMP_ACTIONS = {
  type: typeof ADD_BUMP,
  payload: BumpInfo,
} | {
  type: typeof RESTART_BUMPS,
};

function bumpReducer(state: BumpInfo[], action: BUMP_ACTIONS) {
  switch (action.type) {
    case ADD_BUMP:
      return [...state, action.payload];
    case RESTART_BUMPS:
      return [];
    default:
      return state;
  }
}

function getDirection(movement: Coordinates) {
  if (movement.x < 0) {
    return Direction.LEFT;
  }
  if (movement.x > 0) {
    return Direction.RIGHT;
  }
  if (movement.y > 0) {
    return Direction.DOWN;
  }
  return Direction.UP;
}

export default function GameObjects(props: {
  end: Coordinates,
  obstacles: Coordinates[],
  screenShake: () => void;
  rewardPlayer: (movements: Direction[]) => void;
  gameStarted: boolean;
}) {
  const start = new Coordinates(51, 62);

  const [playerPosition, setPlayerPosition] = useState<Coordinates>(start);
  const [moving, setMoving] = useState(false);
  const [moveDistance, setMoveDistance] = useState(1);
  const [playSlideSfx] = useSound(slideSfx);
  const [playerDirection, setPlayerDirection] = useState(Direction.DOWN);
  const [bumps, bumpDispatch] = useReducer(bumpReducer, []);

  function removeObstacle(position: Coordinates, direction: Coordinates) {
    bumpDispatch({
      type: ADD_BUMP,
      payload: {
        position,
        direction,
        directionInt: directionToInt(direction),
      },
    });
  }

  const existingObstacles = props.obstacles.filter(obstacle => !bumps.map(bump => bump.position).includes(obstacle));

  function restartGame() {
    setPlayerPosition(start);
    setMoving(false);
    setMoveDistance(1);
    setPlayerDirection(Direction.DOWN);
    bumpDispatch({type: RESTART_BUMPS});
    window.scrollTo({
      left: TILE_SIZE * start.x - window.innerWidth / 2,
      top: TILE_SIZE * start.y - window.innerHeight / 2,
      behavior: 'smooth',
    });
  }

  function slide(playerMovement: Coordinates) {
    if (moving) return;

    playSlideSfx();

    const obstaclePosition = findObstaclePosition({
      playerPosition,
      playerMovement,
      obstacles: existingObstacles,
    });

    const newPosition = obstaclePosition.minus(playerMovement);

    const moveDistance = findMoveDistance({
      positionA: playerPosition,
      positionB: newPosition,
    });

    setMoveDistance(moveDistance);
    setPlayerPosition(newPosition);
    setPlayerDirection(getDirection(playerMovement));
    setMoving(true);

    setTimeout(() => {
      window.scrollTo({
        left:
          (TILE_SIZE * (newPosition.x + playerPosition.x)) / 2 - window.innerWidth / 2,
        top:
          (TILE_SIZE * (newPosition.y + playerPosition.y)) / 2 -
          window.innerHeight / 2,
        behavior: 'smooth',
      });
    }, moveDistance * 16);

    setTimeout(() => {
      window.scrollTo({
        left: TILE_SIZE * newPosition.x - window.innerWidth / 2,
        top: TILE_SIZE * newPosition.y - window.innerHeight / 2,
        behavior: 'smooth',
      });
    }, moveDistance * 32);

    setTimeout(() => {
      if (!obstaclePosition.equals(props.end)) {
        setPlayerPosition(
          new Coordinates(newPosition.x, newPosition.y).minus(playerMovement)
        );
        setMoveDistance(1);
        props.screenShake();
        removeObstacle(obstaclePosition, playerMovement);
        return;
      }

      setPlayerPosition(obstaclePosition);
      setMoveDistance(20);

      // reward player.
      props.rewardPlayer(bumps.map(bump => bump.directionInt));
    }, 50 + (moveDistance) * 50);

    setTimeout(() => {
      setMoving(false);
    }, 50 + (moveDistance + 1) * 50);
  }

  // @ts-ignore
  return (
    <Container>
      {props.gameStarted && (
        <GameActions>
          <button onClick={restartGame}>Restart</button>
        </GameActions>
      )}
      {props.gameStarted && !moving && (
        <GameController>
          <button onClick={() => slide(new Coordinates(0, -1))}>
            ▲
          </button>
          <button onClick={() => slide(new Coordinates(-1, 0))}>
            ◀
          </button>
          <button onClick={() => slide(new Coordinates(1, 0))}>
            ▶
          </button>
          <button onClick={() => slide(new Coordinates(0, 1))}>
            ▼
          </button>
        </GameController>
      )}
      <Player
        position={playerPosition}
        transitionSeconds={moveDistance * 0.05}
        direction={playerDirection}
      />
      {props.obstacles.map((obstacle, index) => (
        <Obstacle position={obstacle} key={index} bumpInfo={bumps.filter(bump => bump.position === obstacle)[0]} />
      ))}
      <ConnectionSection />
    </Container>
  );
}
