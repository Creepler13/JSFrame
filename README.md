# JSFrame

JSFrame is a easy way to display something with nodejs, without the need of a browser

## Requirements

### NodeJs

It is recommended to only use LTS version of nodejs.
Otehrwise, instalation installation fail.

### Java

To check if available use

```bash
$ java -version
```

Please share issues and impovement ideas -> https://github.com/Creepler13/JSFrame/issues

## Quick Example

```javascript
const JSFrame = require("jsframe.jar");

let frame = new JSFrame(0, 0, 500, 500);

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
```

![](https://gyazo.com/eafe7145a0dca0dab739b12aa9431321.gif)

## Documentation

### Objects

- [Frame](#frame)
- [MouseCollider](#mousecollider)

### Methods

#### Frame

- [JSFrame#getCanvas()](#getcanvas)
- [JSFrame#getWidth()](#getwidthheight)
- [JSFrame#getHeight()](#getwidthheight)
- [JSFrame#on()](#on)
- [JSFrame#setPosition()](#setposition)
- [JSFrame#getPosition()](#getposition)
- [JSFrame#setSize()](#setsize)
- [JSFrame#setCanvasSize()](#setcanvassize)
- [JSFrame#show()](#show)
- [JSFrame#setIcon()](#seticon)
- [JSFrame#createMouseCollider()](#createremovemousecollider)
- [JSFrame#removeMouseCollider()](#createremovemousecollider)

#### MouseCollider

- [MouseCollider#enabled()](#enabled)
- [MouseCollider#isEnabled()](#isenabled)
- [MouseCollider#setPosition()](#setposition)
- [MouseCollider#setSize()](#setsize)
- [MouseCollider#on()](#on)

### Events

- [FrameEvents](#frameevents)
- [KeyEvents](#keyevents)
- [MouseEvents](#mouseevents)

### Frame

```javascript
const JSFrame = require("jsframe.jar");

let frame = new JSFrame(x, y, width, height, hide);
```

The hide argument ist optional if want to create a Frame but not show directly. it will stay hidden until you run [show()](#show)

### getCanvas()

```javascript
const JSFrame = require("jsframe.jar");

let frame = new JSFrame(500, 500);

let canvas = frame.getCanvas();
```

Returns a [Canvas](https://www.npmjs.com/package/canvas) object which behaves like a html canvas

### getWidth/Height()

```javascript
const JSFrame = require("jsframe.jar");

let frame = new JSFrame(500, 500);

let width = frame.getWidth();
let height = frame.getHeight();
```

### on

Used to Listen for Events

```javascript
const JSFrame = require("jsframe.jar");

let frame = new JSFrame(500, 500);

frame.on(eventName, callBack);
```

### setPosition()

Sets the position

```javascript
const JSFrame = require("jsframe.jar");

let frame = new JSFrame(0, 0, 500, 500);

frame.setPosition(x, y);
```

Also works on [MouseCollider](#mousecollider)

### getPosition()

Returns the position

```javascript
const JSFrame = require("jsframe.jar");

let frame = new JSFrame(0, 0, 500, 500);

frame.getPosition(); // returns {x: XPosition, y: YPosition}
```

### setSize()

Sets the size

```javascript
const JSFrame = require("jsframe.jar");

let frame = new JSFrame(0, 0, 500, 500);

frame.setSize(width, height);

//optional if you want to have the canvas change to the same size as the frame (default=false)

frame.setSize(width, height, true);
```

Also works on [MouseCollider](#mousecollider)

### setCanvasSize()

Sets the size of the the Canvas without changing the size of the frame.
You need to regenerate the context of the Canvas after resizing it.

```javascript
const JSFrame = require("jsframe.jar");

let frame = new JSFrame(0, 0, 500, 500);

frame.setCanvasSize(width, height);
```

### show()

Shows the Frame if it was hidden.

```javascript
const JSFrame = require("jsframe.jar");

let frame = new JSFrame(0, 0, 500, 500);

frame.show();
```

### setIcon()

Sets the icon of the Frame

```javascript
const JSFrame = require("jsframe.jar");

let frame = new JSFrame(0, 0, 500, 500);

frame.setIcon("icon/icon.jpg");
```

### FrameEvents

```javascript
frame.on("ready", () => {}); // run when the frame is ready (mostly not needed)

frame.on("closed", () => {}); // run when the frame is closed

frame.on("update", () => {}); // run everytime BEFORE the frame updates/is redrawn

frame.on("minimized", () => {}); // run when the frame is minimized

frame.on("normalized", () => {}); // run when the frame goes back to normal after being minimized

frame.on("positionChanged", () => {}); // run when the frame is moved. returns {x: XPosition, y: YPosition, event: { type: "frame", name: "positionChanged"}}
```

### KeyEvents

```javascript
//example output : { keyCode: 65, key: "a", event: { type: "frame", name: "keyPressed"}}

frame.on("keyPressed", (e) => {
  console.log(e);
});

frame.on("keyReleased", (e) => {
  console.log(e);
});
```

### MouseEvents

```javascript
//example output : { x: 100, y: 100, button: 1, event: { type: "frame", name: "mousePressed"} }
// button = 0 (no button used)
// button = 1 (left-click)
// button = 2 (mouse-wheel)
// button = 3 (right-click)

frame.on("mousePressed", (e) => {
  console.log(e);
});

frame.on("mouseReleased", (e) => {
  console.log(e);
});

frame.on("mouseExited", (e) => {
  console.log(e);
});

frame.on("mouseEntered", (e) => {
  console.log(e);
});

frame.on("mouseMoved", (e) => {
  console.log(e);
});

frame.on("mouseDragged", (e) => {
  console.log(e);
});
```

### create/removeMouseCollider

```javascript
frame.createMouseCollider(x, y, width, height);
```

returns a [MouseCollider](#mousecollider)

```javascript
frame.removeMouseCollider(MouseCollider);
```

removes the given [MouseCollider](#mousecollider) from the frame

### MouseCollider

The MouseCollider is a feature that allows for easy implmentation of, for example a button.

Its Events are equal to the Frame [MouseEvents](#mouseevents)

```javascript
const JSFrame = require("jsframe.jar");

let frame = new JSFrame(500, 500);

let MC;

let ctx = frame.getCanvas().getContext("2d");
ctx.fillStyle = "white";
ctx.fillRect(0, 0, 500, 500);

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
});

frame.on("mousePressed", (e) => {
  ctx.fillStyle = "black";
  ctx.fillText("Frame clicked", 200, 300);
});

frame.on("mouseReleased", (e) => {
  ctx.fillStyle = "white";
  ctx.fillRect(150, 250, 150, 100);
});

frame.on("keyReleased", (e) => {
  frame.removeMouseCollider(MC);
});
```

![](https://gyazo.com/5069c443b84f6fd3b03a4abc17eb23cb.gif)

### enabled()

enables or disables the [MouseCollider](#mousecollider)

```javascript
const JSFrame = require("jsframe.jar");

let frame = new JSFrame(width, height);

let MC = frame.createMouseCollider(x, y, width, height);

MC.enabled(bool);
```

### isEnabled()

reuturn if the [MouseCollider](#mousecollider) is enabled

```javascript
const JSFrame = require("jsframe.jar");

let frame = new JSFrame(width, height);

let MC = frame.createMouseCollider(x, y, width, height);

MC.isEnabled();
```
