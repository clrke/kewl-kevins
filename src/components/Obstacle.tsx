import styled from "styled-components";
import Coordinates from "../models/Coordinates";
import { TILE_SIZE } from "../constants/tiles";
import { useEffect, useState } from "react";

export type BumpInfo = {
  position: Coordinates,
  direction: Coordinates,
}

interface ObstacleProps {
  position: Coordinates;
  bumpInfo?: BumpInfo;
}

const Container = styled.div<ObstacleProps>`
  position: absolute;
  top: ${(props) => (props.position.y - 1 + (props.bumpInfo?.direction.y || 0)) * TILE_SIZE}px;
  left: ${(props) => (props.position.x + (props.bumpInfo?.direction.x || 0)) * TILE_SIZE}px;
  opacity: ${props => props.bumpInfo ? 0 : 1};
  width: ${TILE_SIZE}px;
  height: ${TILE_SIZE * 2}px;
  z-index: ${(props) => 2 + props.position.y};
  transition: all 0.5s ease-out;
`;

const Skin = styled.ellipse`
  stroke: rgb(0, 0, 0);
  fill: rgb(149, 185, 238);
`;

const Eye = styled.ellipse`
  stroke: rgb(0, 0, 0);
`;

const Carrot = styled.path.attrs({
  "bx:shape": "triangle 145.499 110 100 40 0.5 0 1@450343e3",
})`
  stroke: rgb(0, 0, 0);
  fill: rgb(255, 136, 0);
`;

const ObstacleSvg = styled.svg.attrs({
  version: '1.1',
  xmlns: 'http://www.w3.org/2000/svg',
  xmlnsXlink: 'http://www.w3.org/1999/xlink',
})`
  width: ${TILE_SIZE}px;
  height: ${TILE_SIZE * 2}px;
`;

enum ObstacleType {
  SNOWMAN,
  ROCK,
  BUSH,
}

function Snowman() {
  return (
    <ObstacleSvg
      viewBox="0 0 250 500"
      width="250" height="500"
      // transform={[Direction.LEFT].includes(props.direction) ? "scale(-1, 1)" : ""}
    >
      <Skin cx="125" cy="355" rx="125" ry="125" />
      <Skin cx="125" cy="220" rx="75" ry="75"/>
      <Skin cx="125" cy="120" rx="100" ry="100" />
      <Carrot d="M 195 110 L 245 150 L 145 150 L 195 110 Z" />
      <Eye cx="115" cy="110" rx="15" ry="25.09" />
      <Eye cx="185" cy="80" rx="10" ry="21.023" />
    </ObstacleSvg>
  );
}

const RockContainer = styled.path.attrs({
  "bx:shape": "n-gon 125 271.115 131.433 221.115 5 0 1@3af73838",
})`
  stroke: rgb(0, 0, 0);
  fill: rgb(239, 66, 109);
`;

const RockCorner = styled.line`
  fill: rgb(216, 216, 216);
  stroke: rgb(0, 0, 0);
`;

const RockDent = styled.path`
  stroke: rgb(0, 0, 0);
  fill: none;
`;

function Rock() {
  return (
    <ObstacleSvg
      viewBox="0 0 250 500"
      width="250" height="500"
      // transform={[Direction.LEFT].includes(props.direction) ? "scale(-1, 1)" : ""}
    >
      <RockContainer d="M 125 50 L 250 202 L 202 450 L 47 450 L 0 202 Z" />
      <RockCorner x1="120" y1="70" x2="220" y2="350"/>
      <RockDent d="M 75 175 C 70 182 138 159 134 235"/>
    </ObstacleSvg>
  );
}

const BushContainer = styled.ellipse`
  stroke: rgb(0, 0, 0);
  fill: rgb(238, 238, 238);
`;

const Leaves = styled.path`
  stroke: rgb(0, 0, 0);
  fill: rgb(13, 174, 71);
`;

function Bush() {
  return (
    <ObstacleSvg
      viewBox="0 0 250 500"
      width="250" height="500"
      // transform={[Direction.LEFT].includes(props.direction) ? "scale(-1, 1)" : ""}
    >
      <BushContainer cx="125" cy="250" rx="125" ry="200" />
      <Leaves d="M 30 189 C -30 134 2 65 70 125"/>
      <Leaves d="M 183 450 C 262 468 253 330 219 376"/>
      <Leaves d="M 70 31 C 86 0 112 21 110 87"/>
      <Leaves d="M 200 128 C 216 93 242 119 240 185"/>
      <Leaves d="M 32 400 C -28 344 4 275 71 336"/>
      <Leaves d="M 119 366 C 198 385 189 247 155 293"/>
    </ObstacleSvg>
  );
}

function ObstacleSprite() {
  const [sprite, setSprite] = useState<ObstacleType | null>(null);

  useEffect(() => {
    const values = Object.values(ObstacleType);
    setSprite(values[(values.length / 2) + Math.floor(Math.random() * values.length / 2)] as ObstacleType);
  }, []);

  switch (sprite) {
    case ObstacleType.SNOWMAN:
      return (
        <Snowman />
      );
    case ObstacleType.ROCK:
      return (
        <Rock />
      );
    case ObstacleType.BUSH:
      return (
        <Bush />
      );
    default:
      console.log("Unknown sprite", sprite);
      return <Snowman />;
  }
}

export default function Obstacle(props: ObstacleProps) {
  return (
    <Container {...props}>
      <ObstacleSprite />
    </Container>
  )
}
