const Server = require("./Server");
const { loadImage } = require("canvas");
const fs = require("fs");

const { componentFunctions, init } = require("./handlers/moduleHandler");
module.exports = class JSFrame {
  constructor(x, y, width, height, hide) {
    this.loadImage = loadImage;

    this.getWidth = () => {
      return server.canvas.width;
    };

    this.getHeight = () => {
      return server.canvas.height;
    };

    this.getCanvas = () => {
      return server.canvas;
    };

    this.on = (event, callBack) => {
      server.EventManager.addListener("frame", event, callBack);
    };

    this.update = () => {
      if (server.interval) clearInterval(server.interval);
      server.update(server);
    };

    this.setPosition = (x, y) => {
      server.write(["position", x, y]);
    };

    this.setSize = (width, height) => {
      server.write(["size", width, height]);
      server.canvas.width = width;
      server.canvas.height = height;
      server.serverCanvas.width = width;
      server.serverCanvas.height = height;
    };

    this.setIcon = (path) => {
      if (fs.existsSync(path)) {
        server.write(["icon", fs.realpathSync(path)]);
      }
    };

    this.show = () => {
      server.write(["show"]);
    };

    this.components = componentFunctions;

    let server = new Server(x, y, width, height, hide);
    init(server);
  }
};
