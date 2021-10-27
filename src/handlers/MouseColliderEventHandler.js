module.exports = class MouseColliderEventHandler {
  constructor(server) {
    this.server = server;
  }

  Events = {};

  addListener(event, callBack, id) {
    if (!this.Events[event]) this.Events[event] = {};
    this.Events[event][id] = callBack;
  }

  eventCall(eventConfig, data) {
    if (this.Events[eventConfig.name])
      if (this.Events[eventConfig.name][data.id])
        this.Events[eventConfig.name][data.id]({
          x: data.x,
          y: data.y,
          button: data.button ? data.button : 0,
          eventConfig,
        });
  }
};
