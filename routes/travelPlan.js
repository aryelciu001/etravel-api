const router = require("express").Router();
const axios = require("axios");
const flightDataCleaner = require("../computation/cleanFlightData");

router.route("/").post((req, res) => {
  const user = req.body.user;
  const sourceCity = req.body.source;
  const destinationCity = req.body.destination; // must be city
  const dateOfDeparture = req.body.departureDate; // YYYY-MM-DD
  const dateOfReturn = req.body.returnDate; // YYYY-MM-DD

  const flightQueryUrl = `http://localhost:5000/flightquery/`;
  const hotelQueryUrl = `http://localhost:5000/hotelquery`;
  const profilingResultQuery = `http://localhost:5000/profres/getprofres`;

  var promise1 = axios.post(flightQueryUrl, {
    source: sourceCity,
    destination: destinationCity,
    departureDate: dateOfDeparture,
    returnDate: dateOfReturn
  });
  var promise2 = axios.post(hotelQueryUrl, {
    user: user,
    destination: destinationCity,
    dateCheckIn: dateOfDeparture,
    dateCheckOut: dateOfReturn
  });
  var promise3 = axios.post(profilingResultQuery, {
    user: user
  });

  Promise.all([promise1, promise2, promise3]).then(result => {
    //all the data of the flight retrieved from flight query , including price, direct, airline
    // const flightResult = result[0].data;
    if (!result[0].data.err) {
      var flightResult = result[0].data.data;
    }

    //all the data of the hotels retrieved from hotel query, including name, thumbnail
    var hotelResults = result[1].data;

    //all the data of the itinerary retrieved from itinierary query, including name, thumbnail
    var profilingResult = result[2].data.itinerary;

    //all the flight inbound and outbound and price
    var flightData = flightDataCleaner(flightResult);

    //Ini apaan?
    const itineraryAnswerUrl = `http://localhost:5000/itineraryquery`;

    axios
      .post(itineraryAnswerUrl, {
        city: destinationCity
      })
      .then(result => {
        let itineraryAnswer = result.data;
        var finalItinerary = [];
        for (let i = 4; i > 0; i--) {
          for (let j = 0; j < i; j++) {
            finalItinerary.push(
              itineraryAnswer[itineraryResult[4 - i]].shift()
            );
          }
        }

        var finalResults = [];
        for (let i = 0; i < 10; i++) {
          var hotelResult = hotelResults[i];
          var finalResult = {
            flight: { name: airlineName, cost: flightCost },
            hotel: hotelResult,
            itinerary: finalItinerary
          };
          finalResults.push(finalResult);
        }

        res.send(finalResults);
      });
  });
});

module.exports = router;
