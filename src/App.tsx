import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import styled, { css, keyframes } from 'styled-components';
import useTiles, { Tile, TileSpecial, TileType } from './hooks/useTiles';
import GameObjects from './components/GameObjects';
import ConnectionBtn from './components/ConnectionBtn';
import useSound from 'use-sound';
import startGameSfx from './audio/startGameSfx.mp3';
import obstacleBumpSfx from './audio/obstacleBumpSfx.mp3';

interface ContainerProps {
  shaking: boolean;
}

const shakeAnimation = keyframes`
  0% {
    transform: translate(0, 0);
  }
  10% {
    transform: translate(0, -5px);
  }
  20% {
    transform: translate(0, 5px);
  }
  30% {
    transform: translate(0, -5px);
  }
  40% {
    transform: translate(0, 5px);
  }
  50% {
    transform: translate(0, -5px);
  }
  60% {
    transform: translate(0, 5px);
  }
  70% {
    transform: translate(0, -5px);
  }
  80% {
    transform: translate(0, 5px);
  }
  90% {
    transform: translate(0, -5px);
  }
  100% {
    transform: translate(0, 0);
  }
`;

const Container = styled.div<ContainerProps>`
  ${(props) =>
    props.shaking &&
    css`
      animation: ${shakeAnimation} 0.5s linear;
    `}
`;

const TileRow = styled.div`
  white-space: nowrap;
  line-height: 0;
`;

interface BorderTileProps {
  special?: TileSpecial;
}

const BorderTile = styled.div<BorderTileProps>`
  width: 32px;
  height: 32px;
  display: inline-block;
  position: relative;
  background-color: #000;

  ${(props) =>
    props.special === TileSpecial.ENTRANCE && `background-color: #ff8;`}
  ${(props) => props.special === TileSpecial.EXIT && `background-color: #8f8;`}
`;

const PlainTile = styled.div`
  width: 32px;
  height: 32px;
  display: inline-block;
  position: relative;
  background-color: #fff;
`;

interface PlainTileSpotProps {
  position: { x: number; y: number };
  special?: TileSpecial;
}

const PlainTileSpot = styled.div.attrs((props: PlainTileSpotProps) => ({
  style: {
    top: `${props.position.x}px`,
    left: `${props.position.y}px`,
  },
}))<PlainTileSpotProps>`
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 4px;
  background-color: #eee;
`;

function App() {
  const tiles = useTiles({
    start: { x: 51, y: 102 },
    end: { x: 6, y: 0 },
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [shaking, setShaking] = useState(false);

  const topLeft = useRef<HTMLDivElement>(null);
  const topRight = useRef<HTMLDivElement>(null);
  const bottomLeft = useRef<HTMLDivElement>(null);
  const bottomRight = useRef<HTMLDivElement>(null);
  const entrance = useRef<HTMLDivElement>(null);
  const exit = useRef<HTMLDivElement>(null);
  const [playStartGameSfx] = useSound(startGameSfx);
  const [playobstacleBumpSfx] = useSound(obstacleBumpSfx);

  function scrollTo(ref: React.RefObject<HTMLDivElement>) {
    const e = ref.current!;
    window.scroll(
      e.offsetLeft - window.innerWidth / 2,
      e.offsetTop - window.innerHeight / 2
    );
  }

  useEffect(() => {
    console.log('test')
    playStartGameSfx();
  }, [gameStarted])

  useEffect(() => {
    const scrolls = [
      topRight,
      bottomRight,
      bottomLeft,
      topLeft,
      exit,
      entrance,
    ];

    if (scrolls.filter((x) => !x.current).length) {
      return;
    }

    function scrollAndScroll(scrollIndex: number, lastCallback: () => void) {
      scrollTo(scrolls[scrollIndex]);
      if (scrollIndex === scrolls.length - 1) {
        return setTimeout(lastCallback, 1000);
      }
      setTimeout(() => scrollAndScroll(scrollIndex + 1, lastCallback), 1000);
    }

    scrollAndScroll(0, () => setGameStarted(true));
  }, [tiles, topRight, bottomRight, bottomLeft, topLeft, exit, entrance]);

  function screenShake() {
    setShaking(true);
    playobstacleBumpSfx();
    setTimeout(() => setShaking(false), 500);
  }

  function getRef(tile: Tile) {
    switch (tile.special) {
      case TileSpecial.TOPLEFT:
        return topLeft;
      case TileSpecial.TOPRIGHT:
        return topRight;
      case TileSpecial.BOTTOMLEFT:
        return bottomLeft;
      case TileSpecial.BOTTOMRIGHT:
        return bottomRight;
      case TileSpecial.ENTRANCE:
        return entrance;
      case TileSpecial.EXIT:
        return exit;
      default:
        return null;
    }
  }

  return (
    <Container shaking={shaking}>
      {tiles && <GameObjects tiles={tiles} screenShake={screenShake} />}
      {tiles &&
        tiles.map((row, j) => (
          <TileRow key={j}>
            {row.map((tile, i) =>
              tile.type === TileType.PLAIN ? (
                <PlainTile key={i}>
                  <PlainTileSpot position={tile.spot} ref={getRef(tile)} />
                </PlainTile>
              ) : (
                <BorderTile key={i} ref={getRef(tile)} special={tile.special} />
              )
            )}
          </TileRow>
        ))}
    </Container>
  );
}

export default App;
