import styled from "styled-components";
import Coordinates from "../models/Coordinates";
import { TILE_SIZE } from "../constants/tiles";

interface PlayerProps {
  position: Coordinates;
  direction: Direction;
  transitionSeconds: number;
}

const Container = styled.div<PlayerProps>`
  position: absolute;
  top: ${(props) => (props.position.y - 1) * TILE_SIZE}px;
  left: ${(props) => props.position.x * TILE_SIZE}px;
  width: ${TILE_SIZE}px;
  height: ${TILE_SIZE * 2}px;
  z-index: ${(props) => 2 + props.position.y};
  transition: all ${(props) => props.transitionSeconds}s linear;
`;

const Skin = styled.ellipse`
  stroke: rgb(0, 0, 0);
  fill: rgb(0, 204, 105);
`;

const Sclera = styled.ellipse`
  stroke: rgb(0, 0, 0);
  fill: rgb(255, 255, 255);
`;

const Iris = styled.ellipse`
  stroke: rgb(0, 0, 0);
`;

const Teeth = styled.rect`
  stroke: rgb(0, 0, 0);
  fill: rgb(255, 205, 27);
`;

const Brain = styled.ellipse`
  stroke: rgb(0, 0, 0);
  fill: rgb(255, 89, 255);
`;

const Shirt = styled.rect`
  stroke: rgb(0, 0, 0);
  fill: rgb(130, 52, 37);
`;

const Wound = styled.ellipse`
  stroke: rgb(0, 0, 0);
  fill: rgb(251, 37, 34);
`;

const Pants = styled.rect`
  stroke: rgb(0, 0, 0);
  fill: rgb(0, 101, 255);
`;

const PlayerSvg = styled.svg.attrs({
  version: '1.1',
  xmlns: 'http://www.w3.org/2000/svg',
  xmlnsXlink: 'http://www.w3.org/1999/xlink',
})`
  width: ${TILE_SIZE}px;
  height: ${TILE_SIZE * 2}px;
`;

export enum Direction {
  UP,
  LEFT,
  RIGHT,
  DOWN,
}

function PlayerSprite(props: PlayerProps) {
  return (
    <PlayerSvg viewBox="0 0 250 500" width="250" height="500">
      <Skin cx="120" cy="120" rx="100" ry="100">
        <title>Head</title>
      </Skin>
      <g transform="matrix(1, 0, 0, 1, 1, 0)">
        <title>Face</title>
        {[Direction.LEFT, Direction.DOWN].includes(props.direction) && (
          <g>
            <title>Left</title>
            <Sclera cx="80" cy="100" rx="25" ry="25" />
            <Iris cx="70" cy="110" rx="10" ry="10" />
            <Teeth x="60" y="150" width="25" height="25.03" />
            <Teeth x="105" y="150" width="20" height="15" />
          </g>
        )}
        {[Direction.RIGHT, Direction.DOWN].includes(props.direction) && (
          <g>
            <title>Right</title>
            <Sclera cx="160" cy="100" rx="25" ry="25" />
            <Iris cx="170" cy="90" rx="10" ry="10" />
            <Teeth x="140" y="150" width="20" height="25.026" />
            <Teeth x="170" y="150" width="20" height="30" />
          </g>
        )}
      </g>
      <Brain cx="79.692" cy="40" rx="50" ry="25"
             transform="matrix(0.927184, -0.374607, 0.374607, 0.927184, -18.149019, 34.675785)">
        <title>Brain</title>
      </Brain>
      <Shirt x="20" y="202" width="200" height="150">
        <title>Shirt</title>
      </Shirt>
      <Wound cx="79.692" cy="40" rx="50" ry="25"
             transform="matrix(-0.777146, -0.62932, 0.62932, -0.777146, 197.420609, 344.853119)">
        <title>Wound</title>
      </Wound>
      <Pants x="25" y="340" width="95" height="110" />
      <Pants x="130" y="335" width="90" height="120" />
      <Skin x="25" y="430" width="95" height="55" />
      <Skin x="130" y="430" width="90" height="50" />
    </PlayerSvg>
  )
}

export default function Player(props: PlayerProps) {
  return (
    <Container {...props}>
      <PlayerSprite {...props} />
    </Container>
  )
}
