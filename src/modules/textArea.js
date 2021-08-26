module.exports = class TextArea {
  constructor(x, y, width, height, id, EventManager) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.id = id;
    this.height = height;
    let isOn = true;

    this.type = "textArea";

    let getDataCall;

    EventManager.addListener(
      this.type,
      "getData",
      (e) => {
        if (getDataCall != undefined) getDataCall.res(e);
        getDataCall = undefined;
      },
      [id]
    );

    this.enabled = (bool) => {
      EventManager.server.write([this.type, "setState", this.id, bool]);
      isOn = bool;
    };

    this.isEnabled = () => {
      return this.isOn;
    };

    this.on = (event, callBack) => {
      EventManager.addListener(this.type, event, callBack, [id]);
    };

    this.setSize = (width, height) => {
      EventManager.server.write([this.type, "size", this.id, width, height]);
    };

    this.setPosition = (x, y) => {
      EventManager.server.write([this.type, "position", this.id, x, y]);
    };

    this.getData = () => {
      if (getDataCall != undefined) return getDataCall.promise;
      getDataCall = {};
      getDataCall.promise = new Promise((res, rej) => {
        getDataCall.res = res;
      });
      EventManager.server.write([this.type, "getData", this.id]);
      return getDataCall.promise;
    };
  }
};
