const router = require("express").Router();
const axios = require("axios");

router.route("/").post((req, res) => {
    const user = req.body.user;
    const sourceCity = req.body.source;
    const destinationCity = req.body.destination;               // must be city
    const dateOfDeparture = req.body.departureDate;             // YYYY-MM-DD
    const dateOfReturn = req.body.returnDate;                   // YYYY-MM-DD

    const flightQueryUrl = `http://localhost:5000/flightquery/`;
    const hotelQueryUrl = `http://localhost:5000/hotelquery`
    const itineraryQueryUrl = `http://localhost:5000/profres/getprofres`;

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
    var promise3 = axios.post(itineraryQueryUrl, {
        user: user
    })

    Promise.all([promise1, promise2, promise3]).then((result) => {
        const flightResult = result[0].data;
        const hotelResult = result[1].data[0];
        const itineraryResult = result[2].data.itinerary;

        const flightID = flightResult.Quotes[0].OutboundLeg.CarrierIds[0];

        const carrierList = flightResult.Carriers;

        var airlineName = carrierList.filter(el=>{
            return el.CarrierId.toString() === flightID.toString()
        })[0]['Name']

        const itineraryAnswerUrl = `http://localhost:5000/itineraryquery`;

        console.log(itineraryResult);

        axios.post(itineraryAnswerUrl, {
            city: destinationCity
        }).then((result) => {
            let itineraryAnswer = result.data;
            // console.log(itineraryAnswer);

            var finalItinerary = [];
            for(let i = 4; i>0; i--){
                for(let j = 0; j<i; j++){
                    finalItinerary.push(itineraryAnswer[itineraryResult[4-i]].shift())
                }
            }
            console.log(finalItinerary)

            var finalResult = {
                flight: airlineName,
                hotel: hotelResult,
                itinerary: finalItinerary
            }

            res.send(finalResult);
        });
    });
})


module.exports = router;