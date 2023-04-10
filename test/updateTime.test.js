const JSFrame = require("../src/JsFrame.js");

let frame = new JSFrame(0, 0, 500, 500);



let res;

frame.on("up", (e) => {
    res(e.tooktime);
});

let ctx = frame.getCanvas().getContext("2d");


frame.on("ready",()=>{

frame.update();
setTimeout(()=>{},500);

    it("Test", () => {
        return  expect(test()).resolves.toBeLessThan(0.016);
      });

})


function test() {
    return new Promise((resolve) => {
        res = resolve;
        frame.update();
    });
}
