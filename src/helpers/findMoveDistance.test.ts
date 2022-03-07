'use strict';

import Coordinates from "../models/Coordinates";
import findMoveDistance from "./findMoveDistance";

test('Given position a, when position b equal to a, then distance should be 0', () => {
  const positionA = new Coordinates(20, 20);
  const positionB = new Coordinates(20, 20);
  
  const distance = findMoveDistance({positionA, positionB});

  expect(distance).toEqual(0);
});

test('Given position a, when position b that is 5 steps down of a, then distance should be 5', () => {
  const positionA = new Coordinates(20, 20);
  const positionB = new Coordinates(20, 25);
  
  const distance = findMoveDistance({positionA, positionB});

  expect(distance).toEqual(5);
});

test('Given position a, when position b that is 5 steps up of a, then distance should be 5', () => {
  const positionA = new Coordinates(20, 20);
  const positionB = new Coordinates(20, 15);
  
  const distance = findMoveDistance({positionA, positionB});

  expect(distance).toEqual(5);
});

test('Given position a, when position b that is 5 steps left of a, then distance should be 5', () => {
  const positionA = new Coordinates(20, 20);
  const positionB = new Coordinates(15, 20);
  
  const distance = findMoveDistance({positionA, positionB});

  expect(distance).toEqual(5);
});

test('Given position a, when position b that is 5 steps right of a, then distance should be 5', () => {
  const positionA = new Coordinates(20, 20);
  const positionB = new Coordinates(25, 20);
  
  const distance = findMoveDistance({positionA, positionB});

  expect(distance).toEqual(5);
});

test('Given position a, when position b that is 5 steps right of a, then distance should be 5', () => {
  const positionA = new Coordinates(20, 20);
  const positionB = new Coordinates(25, 20);
  
  const distance = findMoveDistance({positionA, positionB});

  expect(distance).toEqual(5);
});

test('Given position a, when position b that is 5 steps right and 5 steps top of a, then distance should be 10', () => {
  const positionA = new Coordinates(20, 20);
  const positionB = new Coordinates(25, 25);
  
  const distance = findMoveDistance({positionA, positionB});

  expect(distance).toEqual(10);
});