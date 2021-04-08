const Server = require("./Server");
const { createCanvas } = require("canvas");

module.exports = class JSFrame {
  constructor(width, height) {
    this.width = width ? width : 500
    this.height= height ? height : 500
    this.canvas = createCanvas(this.width, this.height);
    let server = new Server(width, height, this);

    this.on = (event, callBack) => {
      server.Events[event] = callBack;
    };
  }
};
