//Initializing dependencies
const ex = require("express");
const bp = require("body-parser");
const mon = require("mongoose");

//Initializing app
const app = ex();
app.use(bp.urlencoded({ extended: false }));

//routing
app.get("/", (req, res) => {
  res.send("test");
});

//Modularize routes
const test = require("./routes/test/test.js");
app.use("/test", test);

//Listening to port
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
