const mongoose = require("mongoose");

const profilingResultSchema = new mongoose.Schema({
  hotel: Object,
  flight: Object,
  transit: Object,
  itinerary: Object,
  time: Object
});

module.exports = ProfilingResult = mongoose.model(
  "ProfilingResult",
  profilingResultSchema
);
