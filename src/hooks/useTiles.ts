import { useEffect, useState } from "react";
import { PUZZLE_HEIGHT, PUZZLE_WIDTH } from "../constants/tiles";

export enum TileSpecial {
  TOPLEFT,
  TOPRIGHT,
  BOTTOMLEFT,
  BOTTOMRIGHT,
  ENTRANCE,
  EXIT,
}

export enum TileType {
  BORDER,
  PLAIN,
}

export type Tile = {
  type: TileType.PLAIN,
  spot: { x: number, y: number },
  special?: TileSpecial,
} | {
  type: TileType.BORDER
  special?: TileSpecial,
};

export default function useTiles(props: {
  start: { x: number, y: number },
  end: { x: number, y: number },
}) {
  const [tiles, setTiles] = useState<Tile[][] | undefined>();

  useEffect(() => {
    const newTiles = [Array(PUZZLE_WIDTH + 2).fill({ type: TileType.BORDER })]
      .concat(Array(PUZZLE_HEIGHT).fill([]).map(() =>
        [{ type: TileType.BORDER }].concat(Array(PUZZLE_WIDTH).fill({})
          .map(() => ({
            type: TileType.PLAIN,
            spot: {
              x: Math.floor(Math.random() * 28),
              y: Math.floor(Math.random() * 28),
            }
          }))).concat([{ type: TileType.BORDER }])
      )).concat([Array(PUZZLE_WIDTH + 2).fill({ type: TileType.BORDER })])
      .map((row, y) => row.map((tile, x) => {
        if (x === 0 && y === 0) {
          return {
            type: TileType.BORDER,
            special: TileSpecial.TOPLEFT,
          };
        }
        if (x === (PUZZLE_WIDTH + 1) && y === 0) {
          return {
            type: TileType.BORDER,
            special: TileSpecial.TOPRIGHT,
          };
        }
        if (x === 0 && y === (PUZZLE_HEIGHT + 1)) {
          return {
            type: TileType.BORDER,
            special: TileSpecial.BOTTOMLEFT,
          };
        }
        if (x === (PUZZLE_WIDTH + 1) && y === (PUZZLE_HEIGHT + 1)) {
          return {
            type: TileType.BORDER,
            special: TileSpecial.BOTTOMRIGHT,
          };
        }
        if (x === props.start.x && y === props.start.y) {
          return {
            type: TileType.BORDER,
            special: TileSpecial.ENTRANCE,
          };
        }
        if (x === props.end.x && y === props.end.y) {
          return {
            type: TileType.BORDER,
            special: TileSpecial.EXIT,
          };
        }
        return tile;
      }));
    setTiles(newTiles);
  }, []);

  return tiles;
}
