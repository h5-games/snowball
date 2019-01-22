/// <reference path="Ball.d.ts"/>

export default class Ball {
  position: {
    x: number,
    y: number
  };
  direction: boolean;
  radius: number;
  space: number;
  color: string;

  constructor(config: config) {
    console.log(config);
  }
}
