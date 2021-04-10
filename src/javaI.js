const os = require("os");
const { spawn } = require("child_process");

this.ls = spawn("java", ["-version"]);

this.ls.on("error", (error) => {
console.log("please check if java is installed and set as a environment variable")

  let url;

  switch (os.platform()) {
    case "win32":
      url = "";
      break;

    default:
      break;
  }
});
