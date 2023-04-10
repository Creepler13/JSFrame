const { spawn } = require("child_process");
let config = require("./config.json");
const dgram = require("dgram");
const { createCanvas } = require("canvas");
const EventHandlerManager = require("./handlers/EventHandlerManager");
const { Console } = require("console");

module.exports = class Server {
    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {Boolean} hideOnReady
     */
    constructor(x, y, width, height, hideOnReady) {
        this.width = width ? width : 500;
        this.height = height ? height : 500;
        this.x = x ? x : 0;
        this.y = y ? y : 0;
        this.bufferSize = config.buffersize;
        this.ready = false;
        this.preReadyBuffer = [];
        this.setCanvasSize(this.width, this.height);
        this.lastFrame = this.g.getImageData(0, 0, this.canvas.width, this.canvas.height);

        this.averageBufferSizePerSec = 0;
        this.maxAverageBufferSizePerSec = 0;
        this.lastAverageBufferSizePerSecReset = 0;

        this.lastUpdateStart = 0;
        this.lastUpdateEnd = 0;

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
                console.log("Frame log:" + data);
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
                    let jso = JSON.parse(message);
                    this.EventManager.eventCall(jso.config, jso.data);
                });
        });

        this.socket.on("connect", () => {
            this.interval = setInterval(() => {
                this.update(this);
            }, 16);
            this.EventManager.eventCall({ type: "frame", name: "ready" });
            this.ready = true;
            this.writePreReadyBuffer();
        });

        this.socket.bind();
    }

    update(server) {
        this.lastUpdateStart = process.uptime();
        
        server.EventManager.eventCall({ type: "frame", name: "update" });

        let currentFrame = server.g.getImageData(0, 0, server.canvas.width, server.canvas.height);
        let frameDiff = server.gS.createImageData(currentFrame);

        for (let i = 0; i < currentFrame.data.length; i = i + 4) {
            if (
                currentFrame.data[i] != server.lastFrame.data[i] ||
                currentFrame.data[i + 1] != server.lastFrame.data[i + 1] ||
                currentFrame.data[i + 2] != server.lastFrame.data[i + 2] ||
                currentFrame.data[i + 3] != server.lastFrame.data[i + 3]
            ) {
                frameDiff.data[i] = currentFrame.data[i];
                frameDiff.data[i + 1] = currentFrame.data[i + 1];
                frameDiff.data[i + 2] = currentFrame.data[i + 2];
                frameDiff.data[i + 3] = currentFrame.data[i + 3];
            }
        }

        server.gS.putImageData(frameDiff, 0, 0);

        let buffer = server.serverCanvas.toBuffer();

        let secs = process.hrtime()[0];

        if (secs != server.lastAverageBufferSizePerSecReset) {
            if (server.maxAverageBufferSizePerSec < server.averageBufferSizePerSec)
                server.maxAverageBufferSizePerSec = server.averageBufferSizePerSec;
            server.EventManager.eventCall({ type: "frame", name: "debug" });
            server.averageBufferSizePerSec = buffer.length;
            server.lastAverageBufferSizePerSecReset = secs;
        } else {
            server.averageBufferSizePerSec = (server.averageBufferSizePerSec + buffer.length) / 2;
        }

        server.writeImg(buffer);

        server.lastFrame = currentFrame;
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
                Buffer.concat([Buffer.from([1]), Buffer.from(msg.join(",")), Buffer.from(";")]),
                this.port
            );
        } else {
            this.preReadyBuffer.push(msg);
        }
    }

    setCanvasSize(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.canvas = createCanvas(this.canvasWidth, this.canvasHeight);
        this.serverCanvas = createCanvas(this.canvasWidth, this.canvasHeight);
        this.g = this.canvas.getContext("2d");
        this.gS = this.serverCanvas.getContext("2d");
    }
};
