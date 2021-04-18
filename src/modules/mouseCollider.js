module.exports = class MouseCollider {
  constructor(x, y, width, height, id, EventManager) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.id = id;
    this.height = height;
    let isOn = true;

    this.enabled = (bool) => {
      EventManager.server.write(["mouseCollider", "setState", this.id, bool]);
      isOn = bool;
    };

    this.isEnabled = () => {
      return this.isOn;
    };

    this.on = (event, callBack) => {
      EventManager.addListener("mouseCollider", event, callBack, [id]);
    };
  }
};
