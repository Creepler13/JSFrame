module.exports=class EventHandlerInterface {
    
    constructor(server) {
        this.server = server;
    }

    Events = {};

    addListener(event, callBack) {
        if (!this.Events[event]) this.Events[event] = [];
        this.Events[event].push(callBack);
    }

    runCommand(eventConfig, data) {
        if (this.Events[eventConfig.name])
            this.Events[eventConfig.name].forEach((element) => {
                data.eventConfig = eventConfig;
                element(data);
            });
    }

}