let config = require("../config.json");
const fs = require("fs");
const FrameEventHandler = require("./FrameEventHandler");
const MouseColliderEventHandler = require("./MouseColliderEventHandler");
const TextAreaEventHandler = require("./TextAreaEventHandler");
module.exports = class EventHandlerManager {
  handlers = {};

  constructor(server) {
    this.server = server;
    this.handlers.frame = new FrameEventHandler(server);
    this.handlers.mouseCollider = new MouseColliderEventHandler(server);
    this.handlers.textArea = new TextAreaEventHandler(server);
  }

  addListener(type, event, callBack, option) {
    if (this.handlers[type])
      this.handlers[type].addListener(event, callBack, option);
  }

  eventCall(data) {
    let split = (data + "").trim().split(",");
    let type = split.shift();

    switch (type) {
      case "port":
        this.server.socket.connect(parseInt(split[0]));
        break;
      case "bufferfix":
        config.buffersize = parseInt(split[0]);
        fs.writeFileSync(__dirname + "/../config.json", JSON.stringify(config));
        break;
    }

    if (this.handlers[type])
      this.handlers[type].eventCall(split, {
        event: { type: type, name: split[0] },
      });
  }
};
