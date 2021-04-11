const JSFrame = require("../src/JsFrame.js");

let frame = new JSFrame(500, 500);

frame.on("closed", () => {
  process.exit();
});

let ctx = frame.getCanvas().getContext("2d");
ctx.fillStyle = "black";

let x = 0;
let y = 50;

setInterval(() => {
  ctx.fillRect(0, 0, x, y);
  x += 50;
  if (x > 500) {
    x = 0;
    y += 50;
  }
}, 50);
