const router = require("express").Router();
const axios = require('axios');
// import {PythonShell} from 'python-shell';

router.route("/").post((req, res) =>{
    const destinationCity = req.body.destination;           // must be city
    const dateCheckIn = req.body.dateCheckIn;               // YYYY-MM-DD
    const dateCheckOut = req.body.dateCheckOut;             // YYYY-MM-DD
    const url = `https://hotels4.p.rapidapi.com/locations/search?locale=en_US&query=${destinationCity}`;
    const headers  = ({
        "x-rapidapi-host": "hotels4.p.rapidapi.com",
        "x-rapidapi-key": "a73b75f34dmsha28cc2ab4d28bffp17ea54jsn1d9d7b1ca033"
    });
    // axios.get(url, {headers}).then((result)=>{
    //     const finalDestinationId = result.data.suggestions[0].entities[1].destinationId;
    //     const urlFinalQuery = `https://hotels4.p.rapidapi.com/properties/list?destinationId=${finalDestinationId}&type=CITY&pageNumber=1&pageSize=75&adults1=1&checkIn=${dateCheckIn}&checkOut=${dateCheckOut}`;
    //     axios.get(urlFinalQuery, {headers}).then((finalResult)=>{
    //         const responseFromAPI = finalResult;
    //         // let {PythonShell} = require('python-shell');
    //         var PythonShell = require('python-shell');
    //         var options = {
    //             scriptPath: './',
    //             args: [responseFromAPI]
    //         };
    //         // console.log("PLEASE RUN")
    //         PythonShell.run('test.py', options, function(err, results) {
    //             if(err) throw err;
    //             console.log(results);
    //         });
    //         res.send(finalResult.data);
    //     })
    // })
    var {PythonShell} = require('python-shell');
    let options = {
        scriptPath: '/',
        args: ['value1']
    };

    PythonShell.run('test.py', options, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('results: %j', results);
    });
    // let {PythonShell} = require('python-shell');

    // var options = {
    //     scriptPath: './',
    //     args: ["abc"]
    // };
    // // console.log("PLEASE RUN")
    // var test = new PythonShell('test.py', options);
    // test.on('message', function(message) {
    //     console.log(message);
    // })

})
module.exports = router;

