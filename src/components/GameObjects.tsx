import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import findMoveDistance from '../helpers/findMoveDistance';
import findObstaclePosition from '../helpers/findObstaclePosition';
import useTiles, { Tile, TileSpecial, TileType } from '../hooks/useTiles';
import Coordinates from '../models/Coordinates';
import '../App.css';
import ConnectionBtn from './ConnectionBtn';

const Container = styled.div`
  position: absolute;
  width: ${() => `${32 * 103}px`};
  height: ${() => `${32 * 103}px`};
`;

const GameController = styled.div`
  position: fixed;
  z-index: 3;
`;
const ArrowKeys = styled.div`
  text-align: center;
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
}

const Obstacle = styled.div<ObstacleProps>`
  position: absolute;
  top: ${(props) => (props.position.y - 1) * 32}px;
  left: ${(props) => props.position.x * 32}px;
  width: 32px;
  height: 64px;
  background-color: #f88;
  box-sizing: border-box;
  border: 2px solid #000;
  border-radius: 32px;
  z-index: ${(props) => 2 + props.position.y};
`;

const ConnectionBtnContainer = styled.div`
  position: absolute;
`;

export default function GameObjects(props: {
  tiles: Tile[][];
  screenShake: () => void;
}) {
  const [playerPosition, setPlayerPosition] = useState<Coordinates>(
    new Coordinates(51, 102)
  );
  const [moving, setMoving] = useState(false);
  const [moveDistance, setMoveDistance] = useState(1);
  const [obstacles, setObstacles] = useState([
    new Coordinates(51, 35),
    new Coordinates(0, 37),
    new Coordinates(2, 12),
    new Coordinates(40, 14),
    new Coordinates(38, 0),
    new Coordinates(0, 2),
    new Coordinates(2, 0),
    new Coordinates(0, 2),
    new Coordinates(2, 54),
    new Coordinates(0, 52),
    new Coordinates(2, 32),
    new Coordinates(7, 34),
    new Coordinates(5, 42),
    new Coordinates(3, 40),
    new Coordinates(5, 4),
  ]);

  function removeObstacle(obstaclePosition: Coordinates) {
    setObstacles(
      obstacles.filter((obstacle) => !obstacle.equals(obstaclePosition))
    );
  }

  function slide(playerMovement: Coordinates) {
    if (moving) return;

    const obstaclePosition = findObstaclePosition({
      playerPosition,
      playerMovement,
      obstacles,
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
      removeObstacle(obstaclePosition);
    }, (moveDistance + 1) * 50);

    setTimeout(() => {
      setMoving(false);
    }, (moveDistance + 2) * 50);
  }

  return (
    <Container>
      {!moving && (
        <GameController>
          <ArrowKeys>
            <button
              className="game-button"
              onClick={() => slide(new Coordinates(0, -1))}
            >
              U
            </button>
            <button
              className="game-button"
              onClick={() => slide(new Coordinates(0, 1))}
            >
              D
            </button>
            <button
              className="game-button"
              onClick={() => slide(new Coordinates(-1, 0))}
            >
              L
            </button>
            <button
              className="game-button"
              onClick={() => slide(new Coordinates(1, 0))}
            >
              R
            </button>
          </ArrowKeys>
        </GameController>
      )}
      <Player
        position={playerPosition}
        transitionSeconds={moveDistance * 0.049}
      />
      {obstacles.map((obstacle) => (
        <Obstacle position={obstacle} />
      ))}
      <ConnectionBtnContainer>
        <ConnectionBtn />
      </ConnectionBtnContainer>
    </Container>
  );
}
