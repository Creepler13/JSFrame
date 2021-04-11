const { spawn } = require("child_process");
const config = require("./config.json");
const dgram = require("dgram");
const fs = require("fs");
const server = dgram.createSocket("udp4");

module.exports = class Server {
  constructor(width, height, canvas) {
    this.width = width ? width : 500;
    this.height = height ? height : 500;
    this.bufferSize = config.buffersize;

    server.on("listening", () => {
      this.ls = spawn("java", [
        "-jar",
        __dirname + "/JSFrame.jar",
        server.address().port,
        this.bufferSize,
        this.width,
        this.height,
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

    server.on("message", (msg, rinfo) => {
      if (rinfo.port != server.address().port) this.message(msg);
    });

    server.on("connect", () => {
      this.interval = setInterval(() => {
        this.writeImg(canvas.toBuffer());
      }, 16);
      if (this.Events.ready) this.Events.ready();
    });

    server.bind();
  }

  Events = {};
  message(data) {
    let split = (data + "").trim().split(",");
    if (split[0].startsWith("key")) this.write(data + "");
    if (this.Events[split[0]]) {
      if (split[0].startsWith("mouse"))
        this.Events[split[0]]({
          x: parseInt(split[1]),
          y: parseInt(split[2]),
          button: split[3] ? parseInt(split[3]) : 0,
        });
      if (split[0].startsWith("key"))
        this.Events[split[0]]({ keyCode: parseInt(split[1]), key: split[2] });
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
      case "bufferfix":
        config.buffersize = parseInt(split[1]);
        fs.writeFileSync(__dirname + "/config.json", JSON.stringify(config));
        break;
    }
  }

  writeImg(buffer) {
    server.send(Buffer.concat([Buffer.from([0]), buffer]), this.port);
  }

  write(msg) {
    server.send(
      Buffer.concat([Buffer.from([1]), Buffer.from(msg), Buffer.from(";")]),
      this.port
    );
  }
};
