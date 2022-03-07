import Coordinates from "../models/Coordinates";

export default function findMoveDistance(props: {
  positionA: Coordinates,
  positionB: Coordinates,
}) : number {
  return Math.abs(props.positionB.x - props.positionA.x) +
    Math.abs(props.positionB.y - props.positionA.y);
}