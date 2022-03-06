import { useEffect, useState } from "react";

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

export default function useTiles() {
  const [tiles, setTiles] = useState<Tile[][] | undefined>();

  useEffect(() => {
    const newTiles = [Array(103).fill({type: TileType.BORDER})].concat(Array(101).fill([])
      .map(() =>
        [{ type: TileType.BORDER }].concat(Array(101).fill([1, 2])
          .map(() => ({
            type: TileType.PLAIN,
            spot: {
              x: Math.floor(Math.random() * 28),
              y: Math.floor(Math.random() * 28),
            }
          }))).concat([{ type: TileType.BORDER }])
      )).concat([Array(103).fill({type: TileType.BORDER})])
      .map((row, y) => row.map((tile, x) => {
        if (x === 0 && y === 0) {
          return {
            type: TileType.BORDER,
            special: TileSpecial.TOPLEFT,
          };
        }
        if (x === 102 && y === 0) {
          return {
            type: TileType.BORDER,
            special: TileSpecial.TOPRIGHT,
          };
        }
        if (x === 0 && y === 102) {
          return {
            type: TileType.BORDER,
            special: TileSpecial.BOTTOMLEFT,
          };
        }
        if (x === 102 && y === 102) {
          return {
            type: TileType.BORDER,
            special: TileSpecial.BOTTOMRIGHT,
          };
        }
        if (x === 51 && y === 102) {
          return {
            type: TileType.BORDER,
            special: TileSpecial.ENTRANCE,
          };
        }
        if (x === 71 && y === 0) {
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