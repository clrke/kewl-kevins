import { useEffect, useState } from "react";
import { PUZZLE_HEIGHT, PUZZLE_WIDTH } from "../constants/tiles";
import Coordinates from "../models/Coordinates";

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

export default function useTiles(tokenId?: number) {
  const [tiles, setTiles] = useState<Tile[][] | undefined>();
  const [obstacles, setObstacles] = useState<Coordinates[]>();
  const [start, setStart] = useState<Coordinates>();
  const [end, setEnd] = useState<Coordinates>();

  useEffect(() => {
    if (!tokenId) return;

    (async () => {
      const start = new Coordinates(51, PUZZLE_HEIGHT + 1 );
      const end = new Coordinates(32, 0);
      const newObstacles = [
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
      ];

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
          if (x === start.x && y === start.y) {
            return {
              type: TileType.BORDER,
              special: TileSpecial.ENTRANCE,
            };
          }
          if (x === end.x && y === end.y) {
            return {
              type: TileType.BORDER,
              special: TileSpecial.EXIT,
            };
          }
          return tile;
        }));
      setTiles(newTiles);
      setObstacles(newObstacles.map(c => new Coordinates(c.x + 1, c.y + 1)));
      setStart(start);
      setEnd(end);
    })();
  }, [tokenId]);

  return {
    tiles,
    obstacles,
    start,
    end,
  };
}
