import { useEffect, useState } from "react";
import { PUZZLE_HEIGHT, PUZZLE_WIDTH } from "../constants/tiles";
import Coordinates from "../models/Coordinates";
import Moralis from "moralis";
import { KKP_CONTRACT_ABI, KKP_CONTRACT_ADDRESS } from "../constants/moralisConstants";

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

export default function useTiles(Moralis: Moralis, tokenId: number | undefined) {
  const [tiles, setTiles] = useState<Tile[][] | undefined>();
  const [obstacles, setObstacles] = useState<Coordinates[]>();
  const [start, setStart] = useState<Coordinates>();
  const [end, setEnd] = useState<Coordinates>();

  useEffect(() => {
    if (!tokenId) return;

    (async () => {
      const puzzleDetails: [number, {x: number, y: number}[], number, number] = (await Moralis.executeFunction({
        contractAddress: KKP_CONTRACT_ADDRESS,
        functionName: "puzzle",
        abi: KKP_CONTRACT_ABI,
        params: {
          tokenId,
        },
      })) as [number, {x: number, y: number}[], number, number];
      const start = new Coordinates(51, PUZZLE_HEIGHT + 1 );
      const end = new Coordinates(+puzzleDetails[3] + 1, 0);
      const newObstacles = puzzleDetails[1].slice(0, +puzzleDetails[2]).map(c => new Coordinates(+c.x, +c.y));

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
  }, [Moralis, tokenId]);

  return {
    tiles,
    obstacles,
    start,
    end,
  };
}
