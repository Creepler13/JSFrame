const Server = require("./Server");
const { loadImage } = require("canvas");
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

    this.getWidth = () => {
      return server.canvas.width;
    };

    this.getHeight = () => {
      return server.canvas.height;
    };

    this.getCanvas = () => {
      return server.canvas;
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

    this.setPosition = (x, y) => {
      server.write(["position", x, y]);
    };

    this.setSize = (width, height) => {
      server.write(["size", width, height]);
      server.canvas.width = width;
      server.canvas.height = height;
      server.serverCanvas.width = width;
      server.serverCanvas.height = height;
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
