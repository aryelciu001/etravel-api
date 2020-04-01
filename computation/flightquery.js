const flightClass = require("./airlineList");

function flightQuery(profilingResult, flightData) {
  var airlinePriority = profilingResult["flight"];
  var userTransit = profilingResult["transit"];
  var preferenceTime = profilingResult["time"];

  return calculateFlightPoint(airlinePriority, preferenceTime, flightData);
}

function calculateFlightPoint(airlinePriority, preferenceTime, flightData) {
  flightClassMultiplier = [0.5, 0.35, 0.2];
  var flightDataOutbound = [];
  var iteration = 0;
  for (let i of flightData) {
    var numIteration = 0;
    var totalPointOutbound = 0;
    for (let j of i["Outbound"]["flights"]) {
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

      for (let u of preferenceTime) {
        if (u === "Morning") {
          if (hour > 4 && hour < 12) {
            var timeScore = 6 - Math.abs(hour + minute + second - 8.5) / 3.5;
          } else if (hour > 11 && hour < 18) {
            timeScore = (6 - Math.abs(hour + minute + second - 15) / 3) * 0.7;
          } else if (hour > 17 && hour < 5) {
            if (hour < 5) hour += 24;
            timeScore =
              (6 - Math.abs(hour + minute + second - 23.5) / 5.5) * 0.5;
          }
        }
        if (u === "Afternoon") {
          if (hour > 4 && hour < 12) {
            time_score = (6 - abs(hour + minute + second - 8.5) / 3.5) * 0.6;
          } else if (hour > 11 && hour < 18) {
            time_score = 6 - abs(hour + minute + second - 15) / 3;
          } else if (hour > 17 && hour < 5) {
            if (hour < 5) hour += 24;
            time_score = (6 - abs(hour + minute + second - 23.5) / 5.5) * 0.6;
          }
        }
        if (u === "Evening/Night") {
          if (hour > 4 && hour < 12) {
            time_score = (6 - abs(hour + minute + second - 8.5) / 3.5) * 0.5;
          } else if (hour > 11 && hour < 18) {
            time_score = (6 - abs(hour + minute + second - 15) / 3) * 0.7;
          } else if (hour > 17 && hour < 5) {
            if (hour < 5) hour += 24;
            time_score = 6 - abs(hour + minute + second - 23.5) / 5.5;
          }
        }
      }
      numIteration++;
      totalPointOutbound += timeScore * (1 + multiplier);
    }
    flightDataOutbound.append([iteration, totalPointOutbound / numIteration]);
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
            var convertName = "".join(airlineName.split(" "));
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

      for (let u of preferenceTime) {
        if (u === "Morning") {
          if (hour > 4 && hour < 12) {
            var timeScore = 6 - Math.abs(hour + minute + second - 8.5) / 3.5;
          } else if (hour > 11 && hour < 18) {
            timeScore = (6 - Math.abs(hour + minute + second - 15) / 3) * 0.7;
          } else if (hour > 17 && hour < 5) {
            if (hour < 5) hour += 24;
            timeScore =
              (6 - Math.abs(hour + minute + second - 23.5) / 5.5) * 0.5;
          }
        }
        if (u === "Afternoon") {
          if (hour > 4 && hour < 12) {
            time_score = (6 - abs(hour + minute + second - 8.5) / 3.5) * 0.6;
          } else if (hour > 11 && hour < 18) {
            time_score = 6 - abs(hour + minute + second - 15) / 3;
          } else if (hour > 17 && hour < 5) {
            if (hour < 5) hour += 24;
            time_score = (6 - abs(hour + minute + second - 23.5) / 5.5) * 0.6;
          }
        }
        if (u === "Evening/Night") {
          if (hour > 4 && hour < 12) {
            time_score = (6 - abs(hour + minute + second - 8.5) / 3.5) * 0.5;
          } else if (hour > 11 && hour < 18) {
            time_score = (6 - abs(hour + minute + second - 15) / 3) * 0.7;
          } else if (hour > 17 && hour < 5) {
            if (hour < 5) hour += 24;
            time_score = 6 - abs(hour + minute + second - 23.5) / 5.5;
          }
        }
      }
      numIteration++;
      totalPointInbound += timeScore * (1 + multiplier);
    }
    flightDataInbound.append([iteration, totalPointInbound / numIteration]);
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
