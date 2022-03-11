export default class Coordinates {
  constructor(readonly x: number, readonly y: number) { }

  times(n: number): any {
    return new Coordinates(this.x * n, this.y * n);
  }

  minus(subtrahend: Coordinates): Coordinates {
    return new Coordinates(this.x - subtrahend.x, this.y - subtrahend.y);
  }

  equals(b: Coordinates) {
    return this.x === b.x && this.y === b.y;
  }
}