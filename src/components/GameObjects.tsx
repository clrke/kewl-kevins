import React, { useReducer, useState } from 'react';
import styled from 'styled-components';
import findMoveDistance from '../helpers/findMoveDistance';
import findObstaclePosition from '../helpers/findObstaclePosition';
import { Tile } from '../hooks/useTiles';
import Coordinates from '../models/Coordinates';
import '../App.css';
import useSound from 'use-sound';
import slideSfx from '../audio/slideSfx.mp3';
import ConnectionSection from "./ConnectionSection";
import { PUZZLE_HEIGHT, PUZZLE_WIDTH } from "../constants/tiles";

const Container = styled.div`
  position: absolute;
  width: ${() => `${32 * (PUZZLE_WIDTH + 2)}px`};
  height: ${() => `${32 * (PUZZLE_HEIGHT + 2)}px`};
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

interface PlayerProps {
  position: Coordinates;
  transitionSeconds: number;
}

const Player = styled.div<PlayerProps>`
  position: absolute;
  top: ${(props) => (props.position.y - 1) * 32}px;
  left: ${(props) => props.position.x * 32}px;
  width: 32px;
  height: 64px;
  background-color: #8f8;
  box-sizing: border-box;
  border: 2px solid #000;
  border-radius: 32px;
  z-index: ${(props) => 2 + props.position.y};
  transition: all ${(props) => props.transitionSeconds}s linear;
`;

interface ObstacleProps {
  position: Coordinates;
  bumpInfo?: BumpInfo;
}

const Obstacle = styled.div<ObstacleProps>`
  position: absolute;
  top: ${(props) => (props.position.y - 1 + (props.bumpInfo?.direction.y || 0)) * 32}px;
  left: ${(props) => (props.position.x + (props.bumpInfo?.direction.x || 0)) * 32}px;
  opacity: ${props => props.bumpInfo ? 0 : 1};
  width: 32px;
  height: 64px;
  background-color: #f88;
  box-sizing: border-box;
  border: 2px solid #000;
  border-radius: 32px;
  z-index: ${(props) => 2 + props.position.y};
  transition: all 0.5s ease-out;
`;

type BumpInfo = {
  position: Coordinates,
  direction: Coordinates,
}

const ADD_BUMP = 'ADD_BUMP';
type BUMP_ACTIONS = typeof ADD_BUMP;

function bumpReducer(state: BumpInfo[], action: { type: BUMP_ACTIONS; payload: BumpInfo }) {
  switch (action.type) {
    case ADD_BUMP:
      return [...state, action.payload];
    default:
      return state;
  }
}

export default function GameObjects(props: {
  tiles: Tile[][];
  screenShake: () => void;
}) {
  const [playerPosition, setPlayerPosition] = useState<Coordinates>(
    new Coordinates(51, 62)
  );
  const [moving, setMoving] = useState(false);
  const [moveDistance, setMoveDistance] = useState(1);
  const [playSlideSfx] = useSound(slideSfx);

  const [obstacles, setObstacles] = useState([
    new Coordinates(51, 36), // up
    new Coordinates(1, 38), // left
    new Coordinates(3, 13), // up
    new Coordinates(41, 15), // right
    new Coordinates(39, 1), // up
    new Coordinates(1, 3), // left
    new Coordinates(3, 1), // up
    new Coordinates(1, 3), // left (don't do)
    new Coordinates(3, 55), // down
    new Coordinates(1, 53), // left
    new Coordinates(3, 33), // up
    new Coordinates(8, 35), // right
    new Coordinates(6, 43), // down
    new Coordinates(4, 41), // left
    new Coordinates(6, 5), // up
  ]);

  const [bumps, bumpDispatch] = useReducer(bumpReducer, []);

  function removeObstacle(position: Coordinates, direction: Coordinates) {
    bumpDispatch({
      type: ADD_BUMP,
      payload: {
        position,
        direction,
      },
    });
  }

  const existingObstacles = obstacles.filter(obstacle => !bumps.map(bump => bump.position).includes(obstacle));

  function slide(playerMovement: Coordinates) {
    if (moving) return;

    playSlideSfx()

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
    setMoving(true);

    setTimeout(() => {
      window.scrollTo({
        left:
          (32 * (newPosition.x + playerPosition.x)) / 2 - window.innerWidth / 2,
        top:
          (32 * (newPosition.y + playerPosition.y)) / 2 -
          window.innerHeight / 2,
        behavior: 'smooth',
      });
    }, moveDistance * 16);

    setTimeout(() => {
      window.scrollTo({
        left: 32 * newPosition.x - window.innerWidth / 2,
        top: 32 * newPosition.y - window.innerHeight / 2,
        behavior: 'smooth',
      });
    }, moveDistance * 32);

    setTimeout(() => {
      setPlayerPosition(
        new Coordinates(newPosition.x, newPosition.y).minus(playerMovement)
      );
      setMoveDistance(1);
      props.screenShake();
      removeObstacle(obstaclePosition, playerMovement);
    }, 50 + (moveDistance) * 50);

    setTimeout(() => {
      setMoving(false);
    }, 50 + (moveDistance + 1) * 50);
  }

  // @ts-ignore
  return (
    <Container>
      {!moving && (
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
      />
      {obstacles.map((obstacle, index) => (
        <Obstacle position={obstacle} key={index} bumpInfo={bumps.filter(bump => bump.position === obstacle)[0]} />
      ))}
      <ConnectionSection />
    </Container>
  );
}
