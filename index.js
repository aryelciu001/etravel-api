//Initializing dependencies
const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors')

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser:true, useCreateIndex: true});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established")
})

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

//Listening to port
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});