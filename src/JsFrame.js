const Server = require("./Server");
const { createCanvas } = require("canvas");
const MouseCollider = require("./modules/mouseCollider");

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
      server.EventManager.addListener("frame", event, callBack);
    };

    let MouseColliderIds = 0;
    this.createMouseCollider = (x, y, width, height) => {
      MouseColliderIds++;
      server.write([
        "mouseCollider",
        "add",
        MouseColliderIds - 1,
        x,
        y,
        width,
        height,
      ]);
      return new MouseCollider(
        x,
        y,
        width,
        height,
        MouseColliderIds - 1,
        server.EventManager
      );
    };

    this.removeMouseCollider = (mouseCollider) => {
      server.write(["mouseCollider","remove", mouseCollider.id]);
    };

    width = width ? width : 500;
    height = height ? height : 500;
    let canvas = createCanvas(width, height);
    let server = new Server(width, height, canvas);
  }
};
