const MouseCollider = require("../modules/mouseCollider");
const TextArea = require("../modules/textArea");

let TextAreaIds = 0;
function createTextArea(x, y, width, height) {
  TextAreaIds++;
  let component = new TextArea(
    x,
    y,
    width,
    height,
    TextAreaIds - 1,
    server.EventManager
  );

  server.write([component.type, "add", component.id, x, y, width, height]);
  return component;
}

let MouseColliderIds = 0;
function createMouseCollider(x, y, width, height) {
  MouseColliderIds++;
  let component = new MouseCollider(
    x,
    y,
    width,
    height,
    MouseColliderIds - 1,
    server.EventManager
  );

  server.write([component.type, "add", component.id, x, y, width, height]);

  return component;
}

function removeComponent(component) {
  server.write([conponent.type, "remove", component.id]);
}

let server;

module.exports.init = function init(serv) {
  server = serv;
};

module.exports.componentFunctions = {
  createMouseCollider,
  createTextArea,
  removeComponent,
};
