// function to return Flight Data in JSON format to the front end

module.exports = function(flightData) {
  var routes = flightData["Legs"]; //all the possible route (including direct n indirect flight)
  var packages = flightData["Itineraries"]; //all the packages of flight
  var airlines = flightData["Carriers"]; //all the possible airlines
  var airports = flightData["Places"]; //all the possible airports
  var flights = flightData["Segments"];

  var usedRoutes = {};
  var outbound;

  for (let package of packages) {
    var id = package["OutboundLegId"];
    if (usedRoutes[id] === undefined) {
      outbound = routes.filter(el => el["Id"] === package["OutboundLegId"])[0];
      usedRoutes[id] = outbound;
    } else {
      outbound = usedRoutes[id];
    }
    delete outbound["Id"];
    package["Outbound"] = { ...outbound };

    id = package["InboundLegId"];
    if (usedRoutes[id] === undefined) {
      inbound = routes.filter(el => el["Id"] === package["InboundLegId"])[0];
      usedRoutes[id] = inbound;
    } else {
      inbound = usedRoutes[id];
    }
    delete inbound["Id"];
    package["Inbound"] = { ...inbound };
    package["Price"] = package["PricingOptions"][0]["Price"];
    delete package["PricingOptions"];
    delete package["OutboundLegId"];
    delete package["InboundLegId"];
    delete package["BookingDetailsLink"];
  }

  var dirList = ["Outbound", "Inbound"];

  var usedSegments = {};
  for (let package of packages) {
    for (let dir of dirList) {
      var segments = [];
      for (let segmentId of package[dir]["SegmentIds"]) {
        var id = segmentId;
        if (usedSegments[id] === undefined) {
          var theSegment = flights.filter(flight => {
            return flight["Id"].toString() === id.toString();
          })[0];
          usedSegments[id] = theSegment;
        }
        segments.push({ ...usedSegments[id] });
      }
      package[dir]["flights"] = segments;
      delete package[dir]["SegmentIds"];
    }
  }

  //Added carrier name to the flight
  var usedAirlines = {};
  for (let package of packages) {
    for (let dir of dirList) {
      var usedAirlinesList = [];
      for (let carrier of package[dir]["Carriers"]) {
        var id = carrier;
        var theAirline;
        if (usedAirlines[id] === undefined) {
          var theAirline = airlines.filter(airline => {
            return airline["Id"].toString() === id.toString();
          })[0];
          usedAirlines[id] = theAirline;
        } else {
          theAirline = usedAirlines[id];
        }
        usedAirlinesList.push({ ...theAirline });
      }
      package[dir]["Carriers"] = usedAirlinesList;

      for (let flight of package[dir]["flights"]) {
        var id = flight["Carrier"];
        flight["Carrier"] = { ...usedAirlines[id] };
      }
    }
  }

  // Added stations to the flight
  var usedAirport = {};
  for (let package of packages) {
    for (let dir of dirList) {
      var ido = package[dir]["OriginStation"];
      var idd = package[dir]["DestinationStation"];
      var theAirport;

      if (usedAirport[ido] === undefined) {
        var theAirport = airports.filter(airport => {
          return airport["Id"].toString() === ido.toString();
        })[0];
        usedAirport[ido] = theAirport;
      }
      if (usedAirport[idd] === undefined) {
        var theAirport = airports.filter(airport => {
          return airport["Id"].toString() === idd.toString();
        })[0];
        usedAirport[idd] = theAirport;
      }
      package[dir]["OriginStation"] = { ...usedAirport[ido] };
      package[dir]["DestinationStation"] = { ...usedAirport[idd] };

      for (let flight of package[dir]["flights"]) {
        var ido = flight["OriginStation"];
        var idd = flight["DestinationStation"];
        if (usedAirport[ido] === undefined) {
          var theAirport = airports.filter(airport => {
            return airport["Id"].toString() === ido.toString();
          })[0];
          usedAirport[ido] = theAirport;
        }
        if (usedAirport[idd] === undefined) {
          var theAirport = airports.filter(airport => {
            return airport["Id"].toString() === idd.toString();
          })[0];
          usedAirport[idd] = theAirport;
        }
        flight["OriginStation"] = { ...usedAirport[ido] };
        flight["DestinationStation"] = { ...usedAirport[idd] };
      }
    }
  }
  return packages;
};
