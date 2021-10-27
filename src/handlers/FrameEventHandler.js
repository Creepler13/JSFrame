module.exports = class FrameEventHandler {
  constructor(server) {
    this.server = server;
  }

  Events = {};

  addListener(event, callBack) {
    this.Events[event] = callBack;
  }

  eventCall(eventConfig, data) {
    switch (eventConfig.name) {
      case "close":
        clearInterval(this.server.interval);
        this.server.ls.kill();
        this.server.socket.close();
        if (this.Events.closed) this.Events.closed(eventConfig);
        return;
      case "port":
        this.server.socket.connect(data.port);
        return;
      case "debug":
        if (this.Events[eventConfig.name])
          this.Events[eventConfig.name]({
            bpsa: this.server.averageBufferSizePerSec,
            maxbpsa: this.server.maxAverageBufferSizePerSec,
            eventCallsReceived: this.server.EventManager.eventCallsReceived,
          });
        return;
    }

    if (this.Events[eventConfig.name]) {
      if (eventConfig.name.startsWith("mouse")) {
        this.Events[eventConfig.name]({
          x: parseInt(data.x),
          y: parseInt(data.y),
          button: data.button ? data.button : 0,
          eventConfig,
        });
      } else if (eventConfig.name.startsWith("key")) {
        this.Events[eventConfig.name]({
          keyCode: data.keyCode,
          key: data.key,
          eventConfig,
        });
      } else {
        this.Events[eventConfig.name](eventConfig);
      }
    }
  }
};
