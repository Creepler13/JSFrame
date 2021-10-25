const Server = require("./Server");
const { loadImage } = require("canvas");
const test = require("canvas");
const fs = require("fs");
const MouseCollider = require("./modules/mouseCollider");
module.exports = class JSFrame {
  /**
   *
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   * @param {Boolean?} hide
   */
  constructor(x, y, width, height, hide) {
    this.loadImage = loadImage;

    /**
     *
     * @returns {number}
     */
    this.getWidth = () => {
      return server.canvas.width;
    };

    /**
     * @returns {number}
     */
    this.getHeight = () => {
      return server.canvas.height;
    };

    /**
     * @returns {test.Canvas}
     */
    this.getCanvas = () => {
      return server.canvas;
    };

    /**
     * @param {number} newCanvasWidth
     * @param {number} newCanvasHeight
     */
    this.setCanvasSize = (newCanvasWidth, newCanvasHeight) => {
      server.setCanvasSize(newCanvasWidth, newCanvasHeight);
    };

    /**
     *
     * @param {"ready"|"closed"|"update"|"minimized"|"normalized"|"keyPressed"|"keyReleased"|"mousePressed"|"mouseReleased"|"mouseExited"|"mouseEntered"|"mouseMoved"|"mouseDragged"} event
     * @param {*} callBack
     */
    this.on = (event, callBack) => {
      server.EventManager.addListener("frame", event, callBack);
    };

    this.update = () => {
      if (server.interval) clearInterval(server.interval);
      server.update(server);
    };

    /**
     * @param {number} x
     * @param {number} y
     */
    this.setPosition = (x, y) => {
      server.write(["position", x, y]);
    };

    /**
     *
     * @param {number} width
     * @param {number} height
     * @param {Boolean} [canvasSize=false]
     */
    this.setSize = (width, height,canvasSize) => {
      server.write(["size", width, height]);
   if(canvasSize) server.setCanvasSize(width,height);
    };

    /**
     *
     * @param {fs.PathLike} path
     */
    this.setIcon = (path) => {
      if (fs.existsSync(path)) {
        server.write(["icon", fs.realpathSync(path)]);
      }
    };

    this.show = () => {
      server.write(["show"]);
    };

    let MouseColliderIds = 0;
    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @returns {MouseCollider} MouseCollider
     */
    this.createMouseCollider = (x, y, width, height) => {
      MouseColliderIds++;
      server.write([
        "mouseCollider",
        "add",
        MouseColliderIds - 1,
        x,
        y,
        width,
        height,
      ]);
      return new MouseCollider(
        x,
        y,
        width,
        height,
        MouseColliderIds - 1,
        server.EventManager
      );
    };
    /**
     *
     * @param {MouseCollider} mouseCollider
     */
    this.removeMouseCollider = (mouseCollider) => {
      server.write(["mouseCollider", "remove", mouseCollider.id]);
    };

    let server = new Server(x, y, width, height, hide);
  }
};
