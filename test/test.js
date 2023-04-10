const JSFrame = require("../src/JsFrame.js");

let frame = new JSFrame();
frame.setSize(500, 500);
frame.show();

let MC;

let ctx = frame.getCanvas().getContext("2d");
ctx.fillStyle = "white";
ctx.fillRect(0, 0, 1000, 1000);

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
   // frame.setCanvasSize(1000, 1000);
   frame.close(); 
   ctx = frame.getCanvas().getContext("2d");

    frame.setSize(200, 200, true);
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
  MC.setSize(100, 100);
  MC.setPosition(100, 100);
});


frame.on("positionChanged",(e)=>{
 // console.log(e);
})

frame.on("keyReleased", (e) => {
  console.log(frame.getPosition())
  MC.enabled(!MC.isEnabled);
});

frame.on("debug", (e) => {
 //console.log(e);
});

frame.on("up",e=>{
console.log(e.tooktime);
})

frame.on("closed", (e) => {
  console.log(e);
  process.exit(0);
});
