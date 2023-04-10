const { run } = require("jest");
const EventHandlerInterface = require("./EventHandlerInterFace");

module.exports = class FrameEventHandler extends EventHandlerInterface {
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
                this.runCommand(eventConfig, {
                    bpsa: this.server.averageBufferSizePerSec,
                    maxbpsa: this.server.maxAverageBufferSizePerSec,
                    eventCallsReceived: this.server.EventManager.eventCallsReceived,
                });
                return;
            case "positionChanged":
                let x = parseInt(data.x);
                let y = parseInt(data.y);

                this.server.x = x;
                this.server.y = y;

                this.runCommand(eventConfig, { x, y });

                break;
            case "up":
                this.server.lastUpdateEnd = process.uptime();

                let tooktime = this.server.lastUpdateEnd - this.server.lastUpdateStart;
                this.runCommand(eventConfig, { tooktime });
                return;
        }

        if (eventConfig.name.startsWith("mouse")) {
            this.runCommand(eventConfig, {
                x: parseInt(data.x),
                y: parseInt(data.y),
                button: data.button ? data.button : 0,
            });
        } else if (eventConfig.name.startsWith("key")) {
            this.runCommand(eventConfig, {
                keyCode: data.keyCode,
                key: data.key,
                eventConfig,
            });
        } else {
            this.runCommand(eventConfig, {});
        }
    }
};
