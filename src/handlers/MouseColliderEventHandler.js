module.exports = class MouseColliderEventHandler {
  constructor(server) {
    this.server = server;
  }

  Events = {};

  addListener(event, callBack, option) {
    if (!this.Events[event]) this.Events[event] = {};
    this.Events[event][option[0]] = callBack;
  }

  eventCall(split, event) {
    if (this.Events[split[0]])
      if (this.Events[split[0]][split[1]])
        this.Events[split[0]][split[1]]({
          x: parseInt(split[2]),
          y: parseInt(split[3]),
          button: split[4] ? parseInt(split[4]) : 0,
         event,
        });
  }
};
