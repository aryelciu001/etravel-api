const router = require("express").Router();
const axios = require("axios");
const flightDataCleaner = require("../computation/cleanFlightData");
const flightQuery = require("../computation/weightingFunction");

// router to get flight itinerary list
router.route("/").post((req, res) => {
  const user = req.body.user;
  const sourceCity = req.body.source;
  const destinationCity = req.body.destination;         // must be city
  const dateOfDeparture = req.body.departureDate;       // YYYY-MM-DD
  const dateOfReturn = req.body.returnDate;             // YYYY-MM-DD

  // url to get API Key
  const getSessionKeyUrl = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/v1.0`;

  const sourceCityUrlRequest = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?query=${sourceCity}`;
  const destinationCityUrlRequest = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?query=${destinationCity}`;
  const headers = {
    "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
    "x-rapidapi-key": "a73b75f34dmsha28cc2ab4d28bffp17ea54jsn1d9d7b1ca033",
    "content-type": "application/x-www-form-urlencoded"
  };

  var promise1 = axios.get(sourceCityUrlRequest, { headers });
  var promise2 = axios.get(destinationCityUrlRequest, { headers });

  Promise.all([promise1, promise2]).then(result => {
    const sourceId = result[0].data.Places[0].CityId;
    const destinationId = result[1].data.Places[0].CityId;
    const querystring = require("querystring");
    const postData = {
      country: "US",
      currency: "USD",
      locale: "en-US",
      originPlace: sourceId,
      destinationPlace: destinationId,
      outboundDate: dateOfDeparture
    };
    axios
      .post(getSessionKeyUrl, querystring.stringify(postData), { headers })
      .then(result2 => {
        var responseHeader = result2.headers.location;
        var key = responseHeader.split("/");
        key = key.pop();

        const flightQueryUrl = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/uk2/v1.0/${key}`;
        const profresURL = `http://localhost:5000/profres/getprofres`;
        const profresPromise = axios.post(profresURL, { user });
        const flightPromise = axios.get(flightQueryUrl, { headers });

        Promise.all([profresPromise, flightPromise]).then(result3 => {
          var profresResult = result3[0].data;
          var flightResult = flightDataCleaner(result3[1].data);

          var flightAnswerAll = flightQuery(profresResult, flightResult);

          var flightAnswer = flightAnswerAll.slice(0, 10);
          console.log("Flight OK");
          res.send(flightAnswer);
        });
      })
      .catch(function(error) {
        res.send({ err: true, data: error });
      });
  });
});

module.exports = router;
