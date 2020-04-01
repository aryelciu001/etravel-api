module.exports = function(flightData) {
  var routes = flightData["Legs"]; //all the possible route (including direct n indirect flight)
  var airlines = flightData["Carriers"]; //all the possible airlines
  var airports = flightData["Places"]; //all the possible airports
  var flights = flightData["Segments"];
  var usedAirport = {};

  if (true) {
    //if not willing to take flight with transit => all the flight with transit will be erased
    routes = routes.filter(el => el["SegmentIds"].length === 1);
  }

  //Added stations to the flight
  routes = routes.map(el => {
    // el["OriginStation"] = el["OriginStation"]
    var ido = el["OriginStation"];
    var idd = el["DestinationStation"];
    var theAirport;
    if (usedAirport[ido] === undefined) {
      var theAirport = airports.filter(airport => {
        return airport["Id"].toString() === ido.toString();
      })[0];
      usedAirport[ido] = theAirport;
    } else {
      theAirport = usedAirport[ido];
    }
    if (usedAirport[idd] === undefined) {
      var theAirport = airports.filter(airport => {
        return airport["Id"].toString() === idd.toString();
      })[0];
      usedAirport[idd] = theAirport;
    } else {
      theAirport = usedAirport[idd];
    }
    el["OriginStation"] = usedAirport[ido];
    el["DestinationStation"] = usedAirport[idd];
    return el;
  });

  //Added carrier name to the flight
  routes = routes.map(el => {
    // el["OriginStation"] = el["OriginStation"]
    var usedAirlines = {};
    var usedAirlinesList = [];
    for (let carrier of el["Carriers"]) {
      var id = carrier;
      var theAirline;
      if (usedAirport[id] === undefined) {
        var theAirline = airlines.filter(airline => {
          return airline["Id"].toString() === id.toString();
        })[0];
        usedAirlines[id] = theAirline;
      } else {
        theAirline = usedAirport[id];
      }
      usedAirlinesList.push(theAirline);
    }
    el["Carriers"] = usedAirlinesList;
    return el;
  });

  return routes;
};
