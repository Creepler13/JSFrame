const Server = require("./Server");
const { createCanvas } = require("canvas");

module.exports = class JSFrame {
  constructor(width, height) {
    this.getWidth = () => {
      return width;
    };

    this.getHeight = () => {
      return height;
    };

    this.getCanvas = () => {
      return canvas;
    };

    this.on = (event, callBack) => {
      server.Events[event] = callBack;
    };

    width = width ? width : 500;
    height = height ? height : 500;
    let canvas = createCanvas(width, height);
    let server = new Server(width, height, canvas);
  }
};
