const ex = require("express");
const router = ex.Router();

router.get("/", (req, res) => {
  res.send("this is test");
});

module.exports = router;
