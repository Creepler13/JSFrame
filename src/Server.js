const { spawn } = require("child_process");
const dgram = require("dgram");
const server = dgram.createSocket("udp4");

module.exports = class Server {
  constructor(port, width, height, bufferSize, frame, startet) {
    this.frame = frame;
    this.startet = startet;
    this.port = port ? port : 8080;
    this.width = width ? width : 500;
    this.height = height ? height : 500;
    this.bufferSize = bufferSize ? bufferSize : 15000;

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
        console.log(`stderr: ${data}`);
      });

      this.ls.on("error", (error) => {
        console.log(`error: ${error.message}`);
      });
    });

    server.on("message", (msg, rinfo) => {
      if (rinfo.port != this.port) this.message(msg);
    });

    server.on("connect", () => {
      this.startet();
      if (this.KEvents.ready) this.KEvents.ready();
    });

    server.bind();
  }

  MEvents = {};
  KEvents = {};
  message(data) {
    let split = (data + "").trim().split(",");
    if (this.KEvents[split[0]]) {
      this.KEvents[split[0]]({ keyCode: split[1], key: split[2] });
    } else if (this.MEvents[split[0]]) {
      this.MEvents[split[0]]({ x: split[1], y: split[2] });
    } else {
      switch (split[0]) {
        case "closed":
          clearInterval(this.frame.interval);
          this.ls.kill();
          this.kill();
          if (this.KEvents.closed) this.KEvents.closed();
          break;
        case "port":
          server.connect(parseInt(split[1]));
          break;
      }
    }
  }

  write(buffer, callBack) {
    server.send(buffer, this.port);
  }

  kill() {
    server.close();
  }
};
