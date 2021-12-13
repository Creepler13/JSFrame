const JSFrame = require("../JsFrame");

module.exports = class Button {
  /**
   *
   * @param {JSFrame} frame
   */
  constructor(x, y, width, height, frame) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    let mouseCollider = frame.createMouseCollider(x, y, width, height);

    this.mouseCollider.on("mouseEntered", (e) => {
      this.currentColor = this.hoverColor;
    });
    this.mouseCollider.on("mouseExited", (e) => {
      this.currentColor = this.defaultColor;
    });
    this.mouseCollider.on("mousePressed", (e) => {
      this.currentColor = this.onClickColor;
    });
    this.mouseCollider.on("mouseReleased", (e) => {
      this.currentColor = this.hoverColor;
    });

    this.draw = () => {
      let ctx = frame.getCanvas().getContext("2d");
      let colorTemp = ctx.fillStyle;
      ctx.fillStyle = this.currentColor;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = colorTemp;
    };
  }

  currentColor;
  defaultColor;
  hoverColor;
  onClickColor;

  x;
  y;
  width;
  height;
};
