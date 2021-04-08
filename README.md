

# JSFrame

JSFrame is a easy way to display something with nodejs, without the need of a browser

## Requirements
### Java 
To check if available use
```bash
$ java -version
```

## Quick Example

It uses a [canvas](https://www.npmjs.com/package/canvas) (any changes to it will appear in the frame)


```javascript
const JSFrame = require("jsframe.jar");

let frame = new JSFrame(500, 500);

let ctx = frame.canvas.getContext("2d");
ctx.fillStyle = "black";

let x = 0;
let y = 50;

setInterval(() => {
  ctx.fillRect(0, 0, x, y);
  x+=50;
  if (x > 500) {
    x = 0;
    y+=50;
  }
}, 50);
```
![](https://gyazo.com/eafe7145a0dca0dab739b12aa9431321.gif)

## Documentation



### Events

* [FrameEvents](#FrameEvents)
* [KeyEvents](#KeyEvents)
* [MouseEvents](#MouseEvents)



### FrameEvents
```javascript
frame.on("ready",()=>{
  
})

frame.on("closed",()=>{
   
})
```

### KeyEvents
```javascript
//example output : {keyCode:65, key:"a"}

frame.on("keyPressed", e=>{
  console.log(e)
})

frame.on("keyReleased", e=>{
   console.log(e)
})
```

### MouseEvents
```javascript
//example output : {x:100, y:100}

frame.on("mousePressed", e=>{
  console.log(e)
})

frame.on("mouseReleased", e=>{
   console.log(e)
})

frame.on("mouseExited", e=>{
  console.log(e)
})

frame.on("mouseEntered", e=>{
   console.log(e)
})
```