import styled from "styled-components";
import Coordinates from "../models/Coordinates";
import { TILE_SIZE } from "../constants/tiles";
import Direction from "./Direction";
import KewlKevin from "../models/KewlKevin";

interface PlayerProps {
  position: Coordinates;
  direction: Direction;
  transitionSeconds: number;
  nft: KewlKevin;
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

interface Fillable {
  fill: string;
}

const Skin = styled.ellipse<Fillable>`
  stroke: rgb(0, 0, 0);
  fill: #${props => props.fill};
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

const Brain = styled.ellipse<Fillable>`
  stroke: rgb(0, 0, 0);
  fill: #${props => props.fill};
`;

const Shirt = styled.rect<Fillable>`
  stroke: rgb(0, 0, 0);
  fill: #${props => props.fill};
`;

const Wound = styled.ellipse<Fillable>`
  stroke: rgb(0, 0, 0);
  fill: #${props => props.fill};
`;

const Pants = styled.rect<Fillable>`
  stroke: rgb(0, 0, 0);
  fill: #${props => props.fill};
`;

const Feet = styled.rect<Fillable>`
  stroke: rgb(0, 0, 0);
  fill: #${props => props.fill};
`;

const PlayerSvg = styled.svg.attrs({
  version: '1.1',
  xmlns: 'http://www.w3.org/2000/svg',
  xmlnsXlink: 'http://www.w3.org/1999/xlink',
})`
  width: ${TILE_SIZE}px;
  height: ${TILE_SIZE * 2}px;
`;

function PlayerSprite(props: PlayerProps) {
  return (
    <PlayerSvg
      viewBox="0 0 250 500"
      width="250" height="500"
      transform={[Direction.LEFT , Direction.RIGHT].includes(props.direction) ? "scale(-1, 1)" : ""}
    >
      <Skin fill={props.nft.metadata.attributes[0].value} cx="120" cy="120" rx="100" ry="100">
        <title>Head</title>
      </Skin>
      <g transform="matrix(1, 0, 0, 1, 1, 0)">
        <title>Face</title>
        {[Direction.RIGHT, Direction.DOWN].includes(props.direction) && (
          <g>
            <title>Left</title>
            <Sclera cx="80" cy="100" rx="25" ry="25" />
            <Iris cx="70" cy="110" rx="10" ry="10" />
            <Teeth x="60" y="150" width="25" height="25.03" />
            <Teeth x="105" y="150" width="20" height="15" />
          </g>
        )}
        {[Direction.LEFT, Direction.DOWN].includes(props.direction) && (
          <g>
            <title>Right</title>
            <Sclera cx="160" cy="100" rx="25" ry="25" />
            <Iris cx="170" cy="90" rx="10" ry="10" />
            <Teeth x="140" y="150" width="20" height="25.026" />
            <Teeth x="170" y="150" width="20" height="30" />
          </g>
        )}
      </g>
      <Brain fill={props.nft.metadata.attributes[1].value} cx="79.692" cy="40" rx="50" ry="25"
             transform="matrix(0.927184, -0.374607, 0.374607, 0.927184, -18.149019, 34.675785)">
        <title>Brain</title>
      </Brain>
      <Shirt fill={props.nft.metadata.attributes[3].value} x="20" y="202" width="200" height="150">
        <title>Shirt</title>
      </Shirt>
      <Wound fill={props.nft.metadata.attributes[4].value} cx="79.692" cy="40" rx="50" ry="25"
             transform="matrix(-0.777146, -0.62932, 0.62932, -0.777146, 197.420609, 344.853119)">
        <title>Wound</title>
      </Wound>
      <Pants fill={props.nft.metadata.attributes[5].value} x="25" y="340" width="95" height="110" />
      <Pants fill={props.nft.metadata.attributes[5].value} x="130" y="335" width="90" height="120" />
      <Feet fill={props.nft.metadata.attributes[0].value} x="25" y="430" width="95" height="55" />
      <Feet fill={props.nft.metadata.attributes[0].value} x="130" y="430" width="90" height="50" />
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
