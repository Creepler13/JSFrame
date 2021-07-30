const JSFrame = require("../src/JsFrame.js");

let frame = new JSFrame(2, 2, true);

let g = frame.getCanvas().getContext("2d");

frame.on("ready", () => {
  frame.update();
  g.fillRect(0, 0, 1, 1);
  frame.update();
  frame.update();
  frame.show();

  setTimeout(() => {
    process.exit(0);
  }, 580);
});
