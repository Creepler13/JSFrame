const EventHandlerManager = require("../handlers/EventHandlerManager");

module.exports = class MouseCollider {
  /**
   *
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   * @param {Number} id
   * @param {EventHandlerManager} EventManager
   */
  constructor(x, y, width, height, id, EventManager) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.id = id;
    this.height = height;
    let isOn = true;

    /**
     *
     * @param {Boolean} bool
     */
    this.enabled = (bool) => {
      EventManager.server.write(["mouseCollider", "setState", this.id, bool]);
      isOn = bool;
    };

    /**
     *
     * @returns {Boolean}
     */
    this.isEnabled = () => {
      return this.isOn;
    };

    /**
     *
     * @param {"mousePressed"|"mouseReleased"|"mouseExited"|"mouseEntered"|"mouseMoved"|"mouseDragged"} event
     * @param {*} callBack
     */
    this.on = (event, callBack) => {
      EventManager.addListener("mouseCollider", event, callBack, id);
    };

    /**
     *
     * @param {number} width
     * @param {number} height
     */
    this.setSize = (width, height) => {
      EventManager.server.write([
        "mouseCollider",
        "size",
        this.id,
        width,
        height,
      ]);
    };

    /**
     *
     * @param {number} x
     * @param {number} y
     */
    this.setPosition = (x, y) => {
      EventManager.server.write(["mouseCollider", "position", this.id, x, y]);
    };
  }
};
