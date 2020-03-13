const { spawn, spawnSync } = require("child_process");
let { stdout, stderr } = spawnSync("python", []);
