const router = require("express").Router();
const axios = require('axios');

router.route("/").get((req, res) =>{
    const destination = req.body.destination;           // must be city
    const dateCheckIn = req.body.dateCheckIn;           // YYYY-MM-DD
    const dateCheckOut = req.body.dateCheckOut;         // YYYY-MM-DD
    const url = `https://hotels4.p.rapidapi.com/locations/search?locale=en_US&query=${destination}`;
    const headers  = ({
        "x-rapidapi-host": "hotels4.p.rapidapi.com",
        "x-rapidapi-key": "a73b75f34dmsha28cc2ab4d28bffp17ea54jsn1d9d7b1ca033"
    });
    axios.get(url, {headers}).then((result)=>{
        const finalDestinationId = result.data.suggestions[0].entities[1].destinationId;
        // console.log(finalDestinationId);
        const urlFinalQuery = `https://hotels4.p.rapidapi.com/properties/list?destinationId=${finalDestinationId}&type=CITY&pageNumber=1&pageSize=75&adults1=1&checkIn=${dateCheckIn}&checkOut=${dateCheckOut}`;
        axios.get(urlFinalQuery, {headers}).then((finalResult)=>{
            res.send(finalResult.data);
        })
    })
})
module.exports = router;
