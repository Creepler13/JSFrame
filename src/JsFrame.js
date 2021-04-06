const Server = require("./Server");
const { createCanvas } = require("canvas");

module.exports = class JSFrame {
  onKeyPressed(callBack) {
    this.server.KEvents.kp = callBack;
  }
  onKeyReleased(callBack) {
    this.server.KEvents.kr = callBack;
  }
  onMouseClicked(callBack) {
    this.server.MEvents.mc = callBack;
  }
  onMousePressed(callBack) {
    this.server.MEvents.mp = callBack;
  }
  onMouseReleased(callBack) {
    this.server.MEvents.mr = callBack;
  }

  onReady(callBack) {
    this.server.KEvents.ready = callBack;
  }

  onClosed(callBack) {
    this.server.KEvents.closed = callBack;
  }

  constructor(width, height, port) {
    this.canvas = createCanvas(width ? width : 500, height ? height : 500);
    this.server = new Server(port, width, height, 50000, this, () => {
      this.interval = setInterval(() => {
        this.server.write(this.canvas.toBuffer());
      }, 50);
    });
  }
};
