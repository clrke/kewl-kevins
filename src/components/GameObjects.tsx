import React, { useEffect, useRef, useState } from 'react';
import styled from "styled-components";
import findMoveDistance from '../helpers/findMoveDistance';
import findObstaclePosition from '../helpers/findObstaclePosition';
import useTiles, { Tile, TileSpecial, TileType } from '../hooks/useTiles';
import Coordinates from '../models/Coordinates';

const Container = styled.div`
  position: absolute;
  width: ${() => `${32 * 103}px`};
  height: ${() => `${32 * 103}px`};
`;

const GameController = styled.div`
  position: fixed;
  z-index: 3;
`;

interface PlayerProps {
  position: Coordinates;
  transitionSeconds: number;
}

const Player = styled.div<PlayerProps>`
  position: absolute;
  top: ${props => (props.position.y - 1) * 32}px;
  left: ${props => props.position.x * 32}px;
  width: 32px;
  height: 64px;
  background-color: #8f8;
  box-sizing: border-box;
  border: 2px solid #000;
  border-radius: 32px;
  z-index: 2;
  transition: all ${props => props.transitionSeconds}s linear;
`;

export default function GameObjects(props: {tiles: Tile[][], screenShake: () => void}) {
  const [playerPosition, setPlayerPosition] = useState<Coordinates>(new Coordinates(51, 102));
  const [moving, setMoving] = useState(false);
  const [moveDistance, setMoveDistance] = useState(1);

  function slide(playerMovement: Coordinates) {
    if (moving) return;

    const newPosition = findObstaclePosition({
      playerPosition,
      playerMovement,
      obstacles: [],
    }).minus(playerMovement);

    const moveDistance = findMoveDistance({
      positionA: playerPosition,
      positionB: newPosition,
    })

    setMoveDistance(moveDistance);
    setPlayerPosition(newPosition);
    setMoving(true);

    setTimeout(() => {
      window.scrollTo({
        left: 32 * (newPosition.x + playerPosition.x) / 2 - window.innerWidth / 2,
        top: 32 * (newPosition.y + playerPosition.y) / 2 - window.innerHeight / 2,
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
      setPlayerPosition(new Coordinates(newPosition.x, newPosition.y).minus(playerMovement));
      setMoveDistance(1);
      props.screenShake();
    }, (moveDistance + 1) * 50);

    setTimeout(() => {
      setMoving(false);
    }, (moveDistance + 2) * 50);
  }

  return (
    <Container>
      {!moving && (
        <GameController>
          <button onClick={() => slide(new Coordinates(0, -1))}>Up</button>
          <button onClick={() => slide(new Coordinates(0, 1))}>Down</button>
          <button onClick={() => slide(new Coordinates(-1, 0))}>Left</button>
          <button onClick={() => slide(new Coordinates(1, 0))}>Right</button>
        </GameController>
      )}
      <Player
        position={playerPosition}
        transitionSeconds={moveDistance * 0.049}
      />
    </Container>
  )
}