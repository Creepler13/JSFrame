const { spawn } = require("child_process");
let config = require("./config.json");
const dgram = require("dgram");
const path = require("path");
const { createCanvas } = require("canvas");
const net = require("node:net");
const EventHandlerManager = require("./handlers/EventHandlerManager");

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
        this.hideOnReady = hideOnReady;
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

        this.frameUpdateTime = process.uptime();
        this.fps = 15;
        this.frameUpdateDone = true;

        this.EventManager = new EventHandlerManager(this);

        this.EventManager.addListener("frame", "up", (e) => {
            this.frameUpdateDone = true;
        });

        this.EventManager.addListener("frame", "ready", (e) => {
            console.log(e);

            this.serverClock();
        });

        this.createMsgServer();
    }

    createMsgServer() {
        this.msgServerPort = 3333;

        net.createServer((e) => {
            this.socket = e;
            this.socket.on("data", (msg) => {
                console.log("Msg From Frame: " + msg + "");
                (msg + "").split("%").forEach((message) => {
                    let jso = JSON.parse(message);
                    this.EventManager.eventCall(jso.config, jso.data);
                });
            });
            console.log("socket Connected");
            this.writePreReadyBuffer();
            this.createIPCServer();
        }).listen(this.msgServerPort);

        this.startFrame();
    }

    createIPCServer() {
        let pipePath = "//./pipe/imgPipe";
        net.createServer((e) => {
            this.ipcPipe = e;
            console.log("pipe Connected");
            //both serversConnected
            this.EventManager.eventCall({ type: "frame", name: "ready" });
            this.ready = true;
        }).listen(pipePath);

        this.write(["pipeReady", pipePath]);
    }

    startFrame() {
        this.ls = spawn("java", [
            "-jar",
            __dirname + "/JSFrame.jar",
            this.msgServerPort, //this.socket.address().port,
            this.bufferSize,
            this.x,
            this.y,
            this.width,
            this.height,
            this.hideOnReady ? "True" : "False",
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
    }

    async serverClock() {
        while (true) {
            let currTime = process.uptime();
            if (this.frameUpdateDone) console.log(currTime - this.frameUpdateTime);
            if (
                (this.frameUpdateDone && currTime - this.frameUpdateTime > 1 / this.fps) ||
                currTime - this.frameUpdateTime > 1
            ) {
                this.frameUpdateTime = currTime;
                this.frameUpdateDone = false;
                this.update(this);
            }
        }
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
        this.ipcPipe.write("TEst\n");
        // this.ipcPipe.write(Buffer.concat([Buffer.from([0]), buffer]) + "\n");
        //   this.socket.send(Buffer.concat([Buffer.from([0]), buffer]), this.port);
    }

    writePreReadyBuffer() {
        this.preReadyBuffer.forEach((e) => {
            this.write(e);
        });
    }

    write(msg) {
        if (this.socket) {
            this.socket.write(msg.join(",") + "\n");

            /*    this.socket.send(
                Buffer.concat([Buffer.from([1]), Buffer.from(msg.join(",")), Buffer.from(";")]),
                this.port
            );
        */
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
