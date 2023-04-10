const EventHandlerInterface = require("./EventHandlerInterFace");

module.exports = class MouseColliderEventHandler extends EventHandlerInterface {
    addListener(event, callBack, id) {
        if (!this.Events[event]) this.Events[event] = {};
        if (!this.Events[event][id]) this.Events[event][id] = [];
        this.Events[event][id].push(callBack);
    }

    runCommand(eventConfig, data) {
        if (this.Events[eventConfig.name])
            if (this.Events[eventConfig.name][eventConfig.mouseColliderID])
                this.Events[eventConfig.name][eventConfig.mouseColliderID].forEach((element) => {
                    data.eventConfig = eventConfig;
                    element(data);
                });
    }

    eventCall(eventConfig, data) {
        eventConfig.mouseColliderID = data.id;
        this.runCommand(eventConfig, {
            x: data.x,
            y: data.y,
            button: data.button ? data.button : 0,
        });
    }
};
