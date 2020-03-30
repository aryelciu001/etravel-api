const { spawn, spawnSync } = require("child_process");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  let { stdout, stderr } = spawnSync("python", [
    "./python/webScraper.py",
    "pythonProgram"
  ]);
  var result = JSON.parse(stdout);
  result = result.filter(el => !el.includes("ú"));
  res.send(result);
});



module.exports = router;
