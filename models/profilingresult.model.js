const mongoose = require("mongoose");

const profilingResultSchema = new mongoose.Schema({
  hotel: Number,
  flight: Number
});

module.exports = ProfilingResult = mongoose.model(
  "ProfilingResult",
  profilingResultSchema
);
