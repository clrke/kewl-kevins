import React, { useEffect, useReducer, useState } from 'react';
import styled from 'styled-components';
import findMoveDistance from '../helpers/findMoveDistance';
import findObstaclePosition from '../helpers/findObstaclePosition';
import { Tile } from '../hooks/useTiles';
import Coordinates from '../models/Coordinates';
import '../App.css';
import useSound from 'use-sound';
import slideSfx from '../audio/slideSfx.mp3';
import ConnectionSection from './ConnectionSection';
import { PUZZLE_HEIGHT, PUZZLE_WIDTH, TILE_SIZE } from '../constants/tiles';
import Player, { Direction } from './Player';
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';

const Container = styled.div`
  position: absolute;
  width: ${() => `${TILE_SIZE * (PUZZLE_WIDTH + 2)}px`};
  height: ${() => `${TILE_SIZE * (PUZZLE_HEIGHT + 2)}px`};
`;
const PuzzleCoordinateContainer = styled.div`
  position: absolute;
  bottom: 24px;
  right: 24px;
  width: 240px;
  height: 280px;
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

interface ObstacleProps {
  position: Coordinates;
  bumpInfo?: BumpInfo;
}

const Obstacle = styled.div<ObstacleProps>`
  position: absolute;
  top: ${(props) =>
    (props.position.y - 1 + (props.bumpInfo?.direction.y || 0)) * TILE_SIZE}px;
  left: ${(props) =>
    (props.position.x + (props.bumpInfo?.direction.x || 0)) * TILE_SIZE}px;
  opacity: ${(props) => (props.bumpInfo ? 0 : 1)};
  width: ${TILE_SIZE}px;
  height: ${TILE_SIZE * 2}px;
  background-color: #f88;
  box-sizing: border-box;
  border: 2px solid #000;
  border-radius: ${TILE_SIZE}px;
  z-index: ${(props) => 2 + props.position.y};
  transition: all 0.5s ease-out;
`;

type BumpInfo = {
  position: Coordinates;
  direction: Coordinates;
};

const ADD_BUMP = 'ADD_BUMP';
type BUMP_ACTIONS = typeof ADD_BUMP;

function bumpReducer(
  state: BumpInfo[],
  action: { type: BUMP_ACTIONS; payload: BumpInfo }
) {
  switch (action.type) {
    case ADD_BUMP:
      return [...state, action.payload];
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
  tiles: Tile[][];
  screenShake: () => void;
  gameStarted: boolean;
}) {
  const [playerPosition, setPlayerPosition] = useState<Coordinates>(
    new Coordinates(51, 62)
  );
  //Moralis
  const { authenticate, isAuthenticated, isAuthenticating, Moralis } =
    useMoralis();

  //Web3
  const web3 = useWeb3ExecuteFunction();

  const [moving, setMoving] = useState(false);
  const [moveDistance, setMoveDistance] = useState(1);
  const [playSlideSfx] = useSound(slideSfx);
  const [playerDirection, setPlayerDirection] = useState(Direction.DOWN);

  const [obstacles, setObstacles] = useState(
    [
      new Coordinates(50, 9),
      new Coordinates(58, 11),
      new Coordinates(56, 18),
      new Coordinates(57, 16),
      new Coordinates(55, 40),
      new Coordinates(25, 38),
      new Coordinates(27, 14),
      new Coordinates(42, 16),
      new Coordinates(40, 33),
      new Coordinates(16, 31),
      new Coordinates(18, 25),
      new Coordinates(24, 27),
      new Coordinates(22, 48),
      new Coordinates(19, 46),
      new Coordinates(21, 10),
      new Coordinates(4, 12),
      new Coordinates(6, 2),
      new Coordinates(9, 4),
      new Coordinates(7, 26),
      new Coordinates(4, 24),
      new Coordinates(6, 12),
      new Coordinates(2, 14),
      new Coordinates(4, 9),
      new Coordinates(2, 11),
      new Coordinates(4, 9),
      new Coordinates(52, 11),
      new Coordinates(50, 34),
      new Coordinates(40, 32),
      new Coordinates(42, 25),
      new Coordinates(51, 27),
      new Coordinates(49, 26),
      new Coordinates(53, 28),
      new Coordinates(51, 38),
      new Coordinates(44, 36),
      new Coordinates(46, 59),
      new Coordinates(51, 57),
      new Coordinates(49, 28),
      new Coordinates(60, 30),
      new Coordinates(58, 54),
      new Coordinates(4, 52),
      new Coordinates(6, 19),
      new Coordinates(33, 21),
      new Coordinates(31, 4),
      new Coordinates(47, 6),
      new Coordinates(45, 3),
      new Coordinates(38, 5),
      new Coordinates(40, 38),
      new Coordinates(29, 36),
      new Coordinates(31, 30),
      new Coordinates(32, 32),
      new Coordinates(30, 3),
      new Coordinates(12, 5),
      new Coordinates(14, 19),
      new Coordinates(33, 17),
      new Coordinates(31, 6),
      new Coordinates(2, 8),
      new Coordinates(4, 5),
      new Coordinates(2, 7),
      new Coordinates(4, 29),
      new Coordinates(55, 27),
      new Coordinates(53, 24),
      new Coordinates(59, 26),
      new Coordinates(57, 60),
      new Coordinates(30, 58),
    ].map((c) => new Coordinates(c.x + 1, c.y + 1))
  );

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

  const existingObstacles = obstacles.filter(
    (obstacle) => !bumps.map((bump) => bump.position).includes(obstacle)
  );

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
          (TILE_SIZE * (newPosition.x + playerPosition.x)) / 2 -
          window.innerWidth / 2,
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
      setPlayerPosition(
        new Coordinates(newPosition.x, newPosition.y).minus(playerMovement)
      );
      setMoveDistance(1);
      props.screenShake();
      removeObstacle(obstaclePosition, playerMovement);
    }, 50 + moveDistance * 50);

    setTimeout(() => {
      setMoving(false);
    }, 50 + (moveDistance + 1) * 50);
  }

  return (
    <Container>
      {props.gameStarted && !moving && (
        <GameController>
          <button onClick={() => slide(new Coordinates(0, -1))}>▲</button>
          <button onClick={() => slide(new Coordinates(-1, 0))}>◀</button>
          <button onClick={() => slide(new Coordinates(1, 0))}>▶</button>
          <button onClick={() => slide(new Coordinates(0, 1))}>▼</button>
        </GameController>
      )}

      <Player
        position={playerPosition}
        transitionSeconds={moveDistance * 0.05}
        direction={playerDirection}
      />
      {obstacles.map((obstacle, index) => (
        <Obstacle
          position={obstacle}
          key={index}
          bumpInfo={bumps.filter((bump) => bump.position === obstacle)[0]}
        />
      ))}
      <ConnectionSection />
      <PuzzleCoordinateContainer>
        <input
          type="text"
          onChange={(e) => setSize(parseInt(e.target.value))}
        />
        <button className="game-button-box" onClick={handleClickSize}>
          Submit
        </button>
      </PuzzleCoordinateContainer>
    </Container>
  );
}
