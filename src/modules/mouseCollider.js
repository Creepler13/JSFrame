module.exports = class MouseCollider {
  constructor(x, y, width, height, id, EventManager) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.id = id;
    this.height = height;

    this.on = (event, callBack) => {
      EventManager.addListener("mouseCollider", event, callBack, [id]);
    };
  }
};
