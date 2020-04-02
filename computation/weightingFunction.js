const flightClass = require("./airlineList");

function flightQuery(profilingResult, flightData) {
  var airlinePriority = profilingResult["flight"];
  var userTransit = profilingResult["transit"];
  var preferenceTime = profilingResult["time"];

  return calculateFlightPoint(airlinePriority, preferenceTime, flightData);
}

function calculateFlightPoint(airlinePriority, preferenceTime, flightData) {
  flightClassMultiplier = [1.5, 0.8, 0.6];
  var flightDataOutbound = [];
  var iteration = 0;
  for (let i of flightData) {
    var numIteration = 0;
    var totalPointOutbound = 0;
    for (let j of i["Outbound"]["flights"]) {
      var multiplier = 0.6;
      var airlineName = j["Carrier"]["Name"];
      var index = 0;
      for (let u of airlinePriority) {
        if (multiplier === 0.6) {
          for (let v of flightClass[u]) {
            var convertName = airlineName.split(" ").join("");
            if (convertName.toLowerCase().includes(v.toLowerCase())) {
              multiplier = flightClassMultiplier[index];
              break;
            }
          }
        }
        index++;
      }
      var departureTime = j["DepartureDateTime"].split("T")[1].split(":");
      var hour = Number(departureTime[0]);
      var minute = Number(departureTime[1]) / 60;
      var second = Number(departureTime[2]) / 3600;

      var timeMultiplier = [1, 0.8, 0.5]

      var our_time;

      if (hour > 4 && hour < 12) {
        var timeScore = 5 - Math.abs(hour + minute + second - 8.5) / 3.5;
        our_time = "Morning";
      } else if (hour > 11 && hour < 18) {
        timeScore = (5 - Math.abs(hour + minute + second - 15) / 3);
        our_time = "Afternoon";
      } else if (hour > 17 || hour < 5) {
        if (hour < 5) hour += 24;
        timeScore = (5 - Math.abs(hour + minute + second - 23.5) / 5.5);
        our_time = "Evening/Night";
      }

      var idx = 0;
      for(let u of preferenceTime){
        if (u === our_time){
          timeScore = timeScore*timeMultiplier[idx];
        }
        idx=idx+1;
      }
      numIteration++;
      totalPointOutbound += timeScore * (multiplier);
    }
    flightDataOutbound.push([iteration, totalPointOutbound / numIteration]);
    iteration++;
  }

  var flightDataInbound = [];
  var iteration = 0;
  for (let i of flightData) {
    var numIteration = 0;
    var totalPointInbound = 0;
    for (let j of i["Inbound"]["flights"]) {
      var multiplier = 0.2;
      var airlineName = j["Carrier"]["Name"];
      var index = 0;
      for (let u of airlinePriority) {
        if (multiplier === 0.2) {
          for (let v of flightClass[u]) {
            var convertName = airlineName.split(" ").join("");
            if (convertName.toLowerCase().includes(v.toLowerCase())) {
              multiplier = flightClassMultiplier[index];
              break;
            }
          }
        }
        index++;
      }
      var departureTime = j["DepartureDateTime"].split("T")[1].split(":");
      var hour = Number(departureTime[0]);
      var minute = Number(departureTime[1]) / 60;
      var second = Number(departureTime[2]) / 3600;

      if (hour > 4 && hour < 12) {
        var timeScore = 5 - Math.abs(hour + minute + second - 8.5) / 3.5;
        our_time = "Morning";
      } else if (hour > 11 && hour < 18) {
        timeScore = (5 - Math.abs(hour + minute + second - 15) / 3) ;
        our_time = "Afternoon";
      } else if (hour > 17 || hour < 5) {
        if (hour < 5) hour += 24;
        timeScore = (5 - Math.abs(hour + minute + second - 23.5) / 5.5);
        our_time = "Evening/Night";
      }

      var idx = 0;
      for(let u of preferenceTime){
        if (u === our_time){
          timeScore = timeScore*timeMultiplier[idx];
        }
        idx=idx+1;
      }
      numIteration++;
      totalPointInbound += timeScore * (multiplier);
    }
    flightDataInbound.push([iteration, totalPointInbound / numIteration]);
    iteration++;
  }
  for (let i = 0; i < flightDataInbound.length; i++) {
    flightData[i]["Value"] =
      (flightDataOutbound[i][1] + flightDataInbound[i][1]) / 2;
  }
  flightData.sort((a, b) => {
    return b["Value"] - a["Value"];
  });
  return flightData;
}

module.exports = flightQuery;
