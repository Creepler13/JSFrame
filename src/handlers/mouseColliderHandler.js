const MC = require("../modules/mouseCollider.js");

module.exports = class MouseColliderHandler {
  mouseColliderEvents = {};

  constructor(server) {
    this.server = server;
  }

  addEventHandler(id, event, callBack) {
    if(this.modules[event])
    this.modules[event][id] = callBack;
  }

  id = 0;

  createMouseCollider(x, y, width, height) {
    id++;
    this.server.write(["addMouseCollider", id - 1, x, y, width, height]);
    return new MC(x, y, width, height, id - 1, this);
  }

  callEvent(id, event, x, y) {
    if (this.modules[event])
      if (this.modules[event][id]) this.modules[event][id]({ x: x, y: y });
  }
};
