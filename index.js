//Initializing dependencies
const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

//environment variables
require("dotenv").config();

//Express App setting
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

//Database connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established");
});

//Routing
const profilesRouter = require("./routes/profile");
const recommendationRouter = require("./routes/recommendation");
const hotelqueryRouter = require("./routes/hotelquery");
const flightqueryRouter = require("./routes/flightquery");
const profilingResultRouter = require("./routes/profilingResult");
app.use("/profiles", profilesRouter);
app.use("/recommendation", recommendationRouter);
app.use("/hotelquery", hotelqueryRouter);
app.use("/flightquery", flightqueryRouter);
app.use("/profres", profilingResultRouter);

//Listening to port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
