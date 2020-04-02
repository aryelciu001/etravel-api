const router = require("express").Router();
const axios = require("axios");

const name = require("../computation/hotelquery");

router.route("/").post((req, res) => {
  const user = req.body.user;                       // userId
  const destinationCity = req.body.destination;     // must be city
  const dateCheckIn = req.body.dateCheckIn;         // YYYY-MM-DD
  const dateCheckOut = req.body.dateCheckOut;       // YYYY-MM-DD
  const url = `https://hotels4.p.rapidapi.com/locations/search?locale=en_US&query=${destinationCity}`;
  const headers = {
    "x-rapidapi-host": "hotels4.p.rapidapi.com",
    "x-rapidapi-key": "a73b75f34dmsha28cc2ab4d28bffp17ea54jsn1d9d7b1ca033"
  };
  axios.get(url, { headers }).then(result => {
    try {
      const finalDestinationId = result.data.suggestions[0].entities[1].destinationId;
      const urlFinalQuery = `https://hotels4.p.rapidapi.com/properties/list?destinationId=${finalDestinationId}&type=CITY&pageNumber=1&pageSize=75&adults1=1&checkIn=${dateCheckIn}&checkOut=${dateCheckOut}`;
      const profresURL = `http://localhost:5000/profres/getprofres`;
      const profresPromise = axios.post(profresURL, { user });
      const hotelresPromise = axios.get(urlFinalQuery, { headers });
      Promise.all([profresPromise, hotelresPromise]).then(promiseResult => {
        const finalAnswer = name(promiseResult[1].data, promiseResult[0].data);
        res.send(finalAnswer);
      });
    }catch(e){
      axios.get(url, { headers }).then(result2 => {
        const finalDestinationId = result2.data.suggestions[0].entities[1].destinationId;
        const urlFinalQuery = `https://hotels4.p.rapidapi.com/properties/list?destinationId=${finalDestinationId}&type=CITY&pageNumber=1&pageSize=75&adults1=1&checkIn=${dateCheckIn}&checkOut=${dateCheckOut}`;
        const profresURL = `http://localhost:5000/profres/getprofres`;
        const profresPromise = axios.post(profresURL, { user });
        const hotelresPromise = axios.get(urlFinalQuery, { headers });
        Promise.all([profresPromise, hotelresPromise]).then(promiseResult => {
          const finalAnswer = name(promiseResult[1].data, promiseResult[0].data);
          res.send(finalAnswer);
        });
      })
    }
  });
});
module.exports = router;
