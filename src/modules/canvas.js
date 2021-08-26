const { createCanvas } = require("canvas");

module.exports = class Canvas {
  constructor(x, y, width, height, id, EventManager) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.id = id;
    this.height = height;
    let isOn = true;

    this.type = "canvas";

    let clientCanvas = createCanvas(width, height);
    let serverCanvas = createCanvas(width, height);

    this.enabled = (bool) => {
      EventManager.server.write([this.type, "setState", this.id, bool]);
      isOn = bool;
    };

    this.isEnabled = () => {
      return this.isOn;
    };

    this.on = (event, callBack) => {
      EventManager.addListener(this.type, event, callBack, [id]);
    };

    this.setSize = (width, height) => {
      EventManager.server.write([this.type, "size", this.id, width, height]);
    };

    this.setPosition = (x, y) => {
      EventManager.server.write([this.type, "position", this.id, x, y]);
    };

    let update = () => {
      Server.EventManager.eventCall("frame,update");

      let currentFrame = Server.g.getImageData(
        0,
        0,
        Server.canvas.width,
        Server.canvas.height
      );
      let frameDiff = Server.gS.createImageData(currentFrame);

      for (let i = 0; i < currentFrame.data.length; i = i + 4) {
        if (
          currentFrame.data[i] != Server.lastFrame.data[i] ||
          currentFrame.data[i + 1] != Server.lastFrame.data[i + 1] ||
          currentFrame.data[i + 2] != Server.lastFrame.data[i + 2] ||
          currentFrame.data[i + 3] != Server.lastFrame.data[i + 3]
        ) {
          frameDiff.data[i] = currentFrame.data[i];
          frameDiff.data[i + 1] = currentFrame.data[i + 1];
          frameDiff.data[i + 2] = currentFrame.data[i + 2];
          frameDiff.data[i + 3] = currentFrame.data[i + 3];
        }
      }

      Server.gS.putImageData(frameDiff, 0, 0);

      let buffer = Server.serverCanvas.toBuffer();

      let secs = process.hrtime()[0];

      if (secs != Server.lastAverageBufferSizePerSecReset) {
        if (Server.maxAverageBufferSizePerSec < Server.averageBufferSizePerSec)
          Server.maxAverageBufferSizePerSec = Server.averageBufferSizePerSec;
        Server.EventManager.eventCall(
          "frame,bpsa," +
            Server.averageBufferSizePerSec +
            "," +
            Server.maxAverageBufferSizePerSec
        );
        Server.averageBufferSizePerSec = buffer.length;
        Server.lastAverageBufferSizePerSecReset = secs;
      } else {
        Server.averageBufferSizePerSec =
          (Server.averageBufferSizePerSec + buffer.length) / 2;
      }

      Server.writeImg(buffer);

      Server.lastFrame = currentFrame;
    };
  }
};
