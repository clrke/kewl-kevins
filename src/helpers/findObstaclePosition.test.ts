'use strict';

import Coordinates from "../models/Coordinates";
import findObstaclePosition from "./findObstaclePosition";

test('Given player movement is left, when obstacles there are no obstacles, then coordinates should be left border', () => {
  const playerPosition = new Coordinates(20, 10);
  const playerMovement = new Coordinates(-1, 0);
  const obstacles = [
    new Coordinates(30, 10),
    new Coordinates(20, 20),
  ];

  const obstaclePosition = findObstaclePosition({ playerPosition, playerMovement, obstacles });

  expect(obstaclePosition).toEqual(new Coordinates(0, 10));
});

test('Given player movement is left, when obstacles there is an obstacle, then coordinates should be that obstacle', () => {
  const playerPosition = new Coordinates(20, 10);
  const playerMovement = new Coordinates(-1, 0);
  const obstacles = [
    new Coordinates(30, 10),
    new Coordinates(20, 20),
    new Coordinates(10, 10),
  ];

  const obstaclePosition = findObstaclePosition({ playerPosition, playerMovement, obstacles });

  expect(obstaclePosition).toEqual(new Coordinates(10, 10));
});

test('Given player movement is right, when obstacles there are no obstacles, then coordinates should be right border', () => {
  const playerPosition = new Coordinates(20, 10);
  const playerMovement = new Coordinates(1, 0);
  const obstacles = [
    new Coordinates(20, 20),
    new Coordinates(10, 10),
  ];

  const obstaclePosition = findObstaclePosition({ playerPosition, playerMovement, obstacles });

  expect(obstaclePosition).toEqual(new Coordinates(102, 10));
});

test('Given player movement is right, when obstacles there is an obstacle, then coordinates should be that obstacle', () => {
  const playerPosition = new Coordinates(20, 10);
  const playerMovement = new Coordinates(1, 0);
  const obstacles = [
    new Coordinates(30, 10),
    new Coordinates(20, 20),
    new Coordinates(10, 10),
  ];

  const obstaclePosition = findObstaclePosition({ playerPosition, playerMovement, obstacles });

  expect(obstaclePosition).toEqual(new Coordinates(30, 10));
});

test('Given player movement is up, when obstacles there are no obstacles, then coordinates should be top border', () => {
  const playerPosition = new Coordinates(20, 10);
  const playerMovement = new Coordinates(0, -1);
  const obstacles = [
    new Coordinates(20, 20),
    new Coordinates(10, 10),
  ];

  const obstaclePosition = findObstaclePosition({ playerPosition, playerMovement, obstacles });

  expect(obstaclePosition).toEqual(new Coordinates(20, 0));
});

test('Given player movement is up, when obstacles there is an obstacle, then coordinates should be that obstacle', () => {
  const playerPosition = new Coordinates(20, 10);
  const playerMovement = new Coordinates(0, -1);
  const obstacles = [
    new Coordinates(30, 10),
    new Coordinates(20, 5),
    new Coordinates(20, 20),
    new Coordinates(10, 10),
  ];

  const obstaclePosition = findObstaclePosition({ playerPosition, playerMovement, obstacles });

  expect(obstaclePosition).toEqual(new Coordinates(20, 5));
});

test('Given player movement is down, when obstacles there are no obstacles, then coordinates should be bottom border', () => {
  const playerPosition = new Coordinates(20, 10);
  const playerMovement = new Coordinates(0, 1);
  const obstacles = [
    new Coordinates(20, 5),
    new Coordinates(10, 10),
  ];

  const obstaclePosition = findObstaclePosition({ playerPosition, playerMovement, obstacles });

  expect(obstaclePosition).toEqual(new Coordinates(20, 102));
});

test('Given player movement is down, when obstacles there is an obstacle, then coordinates should be that obstacle', () => {
  const playerPosition = new Coordinates(20, 10);
  const playerMovement = new Coordinates(0, 1);
  const obstacles = [
    new Coordinates(30, 10),
    new Coordinates(20, 5),
    new Coordinates(20, 20),
    new Coordinates(10, 10),
  ];

  const obstaclePosition = findObstaclePosition({ playerPosition, playerMovement, obstacles });

  expect(obstaclePosition).toEqual(new Coordinates(20, 20));
});
