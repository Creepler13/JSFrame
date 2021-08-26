const { spawn } = require("child_process");
let config = require("./config.json");
const dgram = require("dgram");
const { createCanvas } = require("canvas");
const EventHandlerManager = require("./handlers/EventHandlerManager");

module.exports = class Server {
  constructor(x, y, width, height, hideOnReady) {
    this.width = width ? width : 500;
    this.height = height ? height : 500;
    this.x = x ? x : 0;
    this.y = y ? y : 0;
    this.bufferSize = config.buffersize;
    this.ready = false;
    this.preReadyBuffer = [];
    this.canvas = createCanvas(this.width, this.height);
    this.serverCanvas = createCanvas(this.width, this.height);
    this.g = this.canvas.getContext("2d");
    this.gS = this.serverCanvas.getContext("2d");
    this.lastFrame = this.g.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    this.averageBufferSizePerSec = 0;
    this.maxAverageBufferSizePerSec = 0;
    this.lastAverageBufferSizePerSecReset = 0;

    this.socket = dgram.createSocket("udp4");

    this.EventManager = new EventHandlerManager(this);

    this.socket.on("listening", () => {
      this.ls = spawn("java", [
        "-jar",
        __dirname + "/JSFrame.jar",
        this.socket.address().port,
        this.bufferSize,
        this.x,
        this.y,
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
        (msg + "").split("%").forEach((message) => {
        
          this.EventManager.eventCall(message);
        });
    });

    this.socket.on("connect", () => {
      this.interval = setInterval(() => {
        this.update(this);
      }, 16);
      this.EventManager.eventCall("frame,ready");
      this.ready = true;
      this.writePreReadyBuffer();
    });

    this.socket.bind();
  }

  update(Server) {
    Server.EventManager.eventCall("frame,update");

    let currentFrame = Server.g.getImageData(
      0,
      0,
      Server.canvas.width,
      Server.canvas.height
    );
    let frameDiff = Server.gS.createImageData(currentFrame);

    for (let i = 0; i < currentFrame.data.length; i = i + 4) {
      if (
        currentFrame.data[i] != Server.lastFrame.data[i] ||
        currentFrame.data[i + 1] != Server.lastFrame.data[i + 1] ||
        currentFrame.data[i + 2] != Server.lastFrame.data[i + 2] ||
        currentFrame.data[i + 3] != Server.lastFrame.data[i + 3]
      ) {
        frameDiff.data[i] = currentFrame.data[i];
        frameDiff.data[i + 1] = currentFrame.data[i + 1];
        frameDiff.data[i + 2] = currentFrame.data[i + 2];
        frameDiff.data[i + 3] = currentFrame.data[i + 3];
      }
    }

    Server.gS.putImageData(frameDiff, 0, 0);

    let buffer = Server.serverCanvas.toBuffer();

    let secs = process.hrtime()[0];

    if (secs != Server.lastAverageBufferSizePerSecReset) {
      if (Server.maxAverageBufferSizePerSec < Server.averageBufferSizePerSec)
        Server.maxAverageBufferSizePerSec = Server.averageBufferSizePerSec;
      Server.EventManager.eventCall(
        "frame,bpsa," +
          Server.averageBufferSizePerSec +
          "," +
          Server.maxAverageBufferSizePerSec
      );
      Server.averageBufferSizePerSec = buffer.length;
      Server.lastAverageBufferSizePerSecReset = secs;
    } else {
      Server.averageBufferSizePerSec =
        (Server.averageBufferSizePerSec + buffer.length) / 2;
    }

    Server.writeImg(buffer);

    Server.lastFrame = currentFrame;
  }

  writeImg(buffer) {
    this.socket.send(Buffer.concat([Buffer.from([0]), buffer]), this.port);
  }

  writePreReadyBuffer() {
    this.preReadyBuffer.forEach((e) => {
      this.write(e);
    });
  }

  write(msg) {
    if (this.ready) {
      this.socket.send(
        Buffer.concat([
          Buffer.from([1]),
          Buffer.from(msg.join(",")),
          Buffer.from(";"),
        ]),
        this.port
      );
    } else {
      this.preReadyBuffer.push(msg);
    }
  }
};
