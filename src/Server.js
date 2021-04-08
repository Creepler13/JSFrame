const { spawn } = require("child_process");
const dgram = require("dgram");
const server = dgram.createSocket("udp4");

module.exports = class Server {
  constructor(width, height, frame) {
    this.frame = frame;
    this.width = width ? width : 500;
    this.height = height ? height : 500;
    this.bufferSize = 15000;

    server.on("listening", () => {
      this.ls = spawn("java", [
        "-jar",
        "node_modules/jsframe.jar/src/JSFrame.jar",
        server.address().port,
        this.bufferSize,
        this.width,
        this.height,
      ]);

      this.ls.stdout.on("data", (data) => {
        console.log("Debug:" + data);
      });

      this.ls.stderr.on("data", (data) => {
        console.error(""+data);
      });

      this.ls.on("error", (error) => {
        console.error(""+error);
      });
    });

    server.on("message", (msg, rinfo) => {
      if (rinfo.port != server.address().port) this.message(msg);
    });

    server.on("connect", () => {
      this.interval = setInterval(() => {
        this.write(this.frame.canvas.toBuffer());
      }, 16);
      if (this.Events.ready) this.Events.ready();
    });

    server.bind();
  }

  Events = {};
  message(data) {
    let split = (data + "").trim().split(",");
    if (this.Events[split[0]]) {
      if (split[0].startsWith("mouse"))
        this.Events[split[0]]({ x: split[1], y: split[2] });
      if (split[0].startsWith("key"))
        this.Events[split[0]]({ keyCode: split[1], key: split[2] });
    }
    switch (split[0]) {
      case "closed":
        clearInterval(this.interval);
        this.ls.kill();
        server.close();
        if (this.Events.closed) this.Events.closed();
        break;
      case "port":
        server.connect(parseInt(split[1]));
        break;
    }
  }

  write(buffer, callBack) {
    server.send(buffer, this.port);
  }
};
