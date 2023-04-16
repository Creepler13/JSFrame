let config = require("../config.json");
const fs = require("fs");
const FrameEventHandler = require("./FrameEventHandler");
const MouseColliderEventHandler = require("./MouseColliderEventHandler");
const Server = require("../Server");
const EventHandlerInterface = require("./EventHandlerInterFace");
const DebugEventHandler = require("./DebugEventHandler");

module.exports = class EventHandlerManager  {
    handlers = {};

    eventCallsReceived = {};

    /**
     *
     * @param {Server} server
     */
    constructor(server) {
        this.server = server;
        this.handlers.frame = new FrameEventHandler(server);
        this.handlers.mouseCollider = new MouseColliderEventHandler(server);
        this.handlers.debug=new DebugEventHandler(server);
    }

    /**
     *
     * @param {String} type
     * @param {String} event
     * @param {Function} callBack
     * @param {*} option
     */
    addListener(type, event, callBack, option) {
        if (event == "event") this.eventEventListener.push(callBack);
        else if (this.handlers[type]) {
            this.handlers[type].addListener(event, callBack, option);
            this.server.write(["activateEvent", event]);
        }
    }

    eventEventListener = [];

    /**
     *
     * @param {Object} eventConfig eventConfig
     *    @param {String} eventConfig.type type
     *    @param {String} eventConfig.name name
     *
     * @param {Object} data data
     *    @param {*} data.*
     */

    eventCall(eventConfig, data) {
        this.eventEventListener.forEach((element) => {
           if(!data)data={};
            data.eventConfig = eventConfig;
            element(data);
        });

        switch (eventConfig.type) {
            case "bufferfix":
                if (!this.eventCallsReceived["bufferfix"])
                    //debug
                    this.eventCallsReceived["bufferfix"] = 0; //debug
                this.eventCallsReceived["bufferfix"]++; //debug

                config.buffersize = data;
                fs.writeFileSync(__dirname + "/../config.json", JSON.stringify(config));
                return;
        }

        if (this.handlers[eventConfig.type]) {
            if (!this.eventCallsReceived[eventConfig.type])
                this.eventCallsReceived[eventConfig.type] = {}; //debug
            if (!this.eventCallsReceived[eventConfig.type][eventConfig.name])
                this.eventCallsReceived[eventConfig.type][eventConfig.name] = 0;
            this.eventCallsReceived[eventConfig.type][eventConfig.name]++; //debug

            this.handlers[eventConfig.type].eventCall(eventConfig, data);
        }
    }
};
