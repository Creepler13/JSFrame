const JSFrame = require("../src/JsFrame.js");

let frame = new JSFrame();
frame.setSize(500,500)
frame.show();

let MC;

let ctx = frame.getCanvas().getContext("2d");
ctx.fillStyle = "white";
ctx.fillRect(0, 0, 500, 500);

frame.on("minimized", () => {
  console.log("minimized");
});

frame.on("ready", () => {
  MC = frame.createMouseCollider(50, 50, 200, 200);

  MC.on("mouseEntered", (e) => {
    ctx.fillStyle = "black";
    ctx.fillRect(50, 50, 200, 200);
  });

  MC.on("mouseExited", (e) => {
    ctx.fillStyle = "white";
    ctx.fillRect(50, 50, 200, 200);
  });

  MC.on("mousePressed", (e) => {
    ctx.fillStyle = "black";
    ctx.fillText("Button Pressed", 50, 300);
  });

  MC.on("mouseReleased", (e) => {
    ctx.fillStyle = "white";
    ctx.fillRect(50, 250, 150, 100);
  });

  frame.setIcon("icon.jpg");
});

frame.on("mousePressed", (e) => {
  ctx.fillStyle = "black";
  ctx.fillText("Frame clicked", 200, 300);
});

frame.on("mouseReleased", (e) => {
  ctx.fillStyle = "white";
  ctx.fillRect(150, 250, 150, 100);
  MC.setSize(100,100);
  MC.setPosition(100,100);
});

frame.on("keyReleased", (e) => {
  MC.enabled(!MC.isEnabled);
});

frame.on("bpsa", (e) => {
  console.log("bpsa: " + e.bpsa+" highscore "+e.maxbpsa);
});

frame.on("closed", (e) => {
  console.log(e);
  process.exit(0);
});
