module.exports = class FrameEventHandler {
  constructor(server) {
    this.server = server;
  }

  Events = {};

  addListener(event, callBack, option) {
    this.Events[event] = callBack;
  }

  eventCall(split, event) {
    switch (split[0]) {
      case "close":
        clearInterval(this.server.interval);
        this.server.ls.kill();
        this.server.socket.close();
        if (this.Events.closed) this.Events.closed(event);
        return;
      case "bpsa":
        this.Events[split[0]]({
          bpsa: parseFloat(split[1]),
          event,
        });
        return;
    }

    if (this.Events[split[0]]) {
      if (split[0].startsWith("mouse")) {
        this.Events[split[0]]({
          x: parseInt(split[1]),
          y: parseInt(split[2]),
          button: split[3] ? parseInt(split[3]) : 0,
          event,
        });
      } else if (split[0].startsWith("key")) {
        this.Events[split[0]]({
          keyCode: parseInt(split[1]),
          key: split[2],
          event,
        });
      } else {
        this.Events[split[0]](event);
      }
    }
  }
};
