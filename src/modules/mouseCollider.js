module.exports = class MouseCollider {
  constructor(x, y, width, height, id, moduleHandler) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.on = (event, callBack) => {
      moduleHandler.addEventHandler(id, event, callBack);
    };
  }
};
