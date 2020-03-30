const mongoose = require("mongoose");

const profilingResultSchema = new mongoose.Schema({
  hotel: Object,
  flight: Object,
  transit: Object,
  itinerary: Object
});

module.exports = ProfilingResult = mongoose.model(
  "ProfilingResult",
  profilingResultSchema
);
