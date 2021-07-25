const { spawn } = require("child_process");
let config = require("./config.json");
const dgram = require("dgram");
const EventHandlerManager = require("./handlers/EventHandlerManager");

module.exports = class Server {
  constructor(width, height, canvas, hideOnReady) {
    this.width = width ? width : 500;
    this.height = height ? height : 500;
    this.bufferSize = config.buffersize;

    this.socket = dgram.createSocket("udp4");

    this.EventManager = new EventHandlerManager(this);

    this.socket.on("listening", () => {
      this.ls = spawn("java", [
        "-jar",
        __dirname + "/JSFrame.jar",
        this.socket.address().port,
        this.bufferSize,
        this.width,
        this.height,
        hideOnReady ? "True" : "False",
      ]);

      this.ls.stdout.on("data", (data) => {
        console.log("Debug:" + data);
      });

      this.ls.stderr.on("data", (data) => {
        console.error("" + data);
      });

      this.ls.on("error", (error) => {
        console.error("" + error);
      });
    });

    this.socket.on("message", (msg, rinfo) => {
      if (rinfo.port != this.socket.address().port)
        (msg+"").split("%").forEach(message => {
          this.EventManager.eventCall(message);
        });
    });

    this.socket.on("connect", () => {
      this.interval = setInterval(() => {
        this.EventManager.eventCall("frame,update");
        this.writeImg(canvas.toBuffer());
      }, 16);
      this.EventManager.eventCall("frame,ready");
    });

    this.socket.bind();
  }

  writeImg(buffer) {
    this.socket.send(Buffer.concat([Buffer.from([0]), buffer]), this.port);
  }

  write(msg) {
    this.socket.send(
      Buffer.concat([
        Buffer.from([1]),
        Buffer.from(msg.join(",")),
        Buffer.from(";"),
      ]),
      this.port
    );
  }
};
