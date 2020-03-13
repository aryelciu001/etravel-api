const mongoose = require("mongoose");

const profilingTestSchema = new mongoose.Schema({});

module.exports = ProfilingTest = mongoose.model(
  "ProfilingTest",
  profilingTestSchema
);
