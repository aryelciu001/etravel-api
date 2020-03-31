const router = require("express").Router();
const axios = require("axios");

router.route("/").post((req, res) => {
  const sourceCity = req.body.source; // must be city
  const destinationCity = req.body.destination; // must be city
  const dateOfDeparture = req.body.departureDate; // YYYY-MM-DD
  const dateOfReturn = req.body.returnDate; // YYYY-MM-DD
  const sourceCityUrlRequest = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?query=${sourceCity}`;
  const destinationCityUrlRequest = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?query=${destinationCity}`;

  const headers = {
    "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
    "x-rapidapi-key": "a73b75f34dmsha28cc2ab4d28bffp17ea54jsn1d9d7b1ca033"
  };

  var promise1 = axios.get(sourceCityUrlRequest, { headers });
  var promise2 = axios.get(destinationCityUrlRequest, { headers });

  Promise.all([promise1, promise2]).then(result => {
    const sourceId = result[0].data.Places[0].CityId;
    const destinationId = result[1].data.Places[0].CityId;

    const departureFlightQueryUrl = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/US/USD/en-US/${sourceId}/${destinationId}/${dateOfDeparture}`;
    const returnFlightQueryUrl = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/US/USD/en-US/${destinationId}/${sourceId}/${dateOfReturn}`;

    var departurePromise = axios.get(departureFlightQueryUrl, { headers });
    var returnPromise = axios.get(returnFlightQueryUrl, { headers });

    Promise.all( [departurePromise, returnPromise]).then(result => {
      var finResult = {
        departure: result[0].data,
        return: result[1].data
      }
      res.send(finResult)
      // const departureFlight = result[0];
      // res.send(departureFlight.data);
      // console.log("Departure Flight : ")
      // console.log(departureFlight.data);
      // const returnFlight = result[1];
      // res.send(returnFlight.data);
      // console.log("Return Flight : ");
      // console.log(returnFlight.data);
    })
  });
});

module.exports = router;
