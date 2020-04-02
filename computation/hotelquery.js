const name = (data, userAnswer) => {
  console.log(data);
  const hotelData = data;
  console.log(userAnswer);
  const results = hotelData.data.body.searchResults.results; // list of results;
  var minDistanceFromCity = parseFloat(
    results[0].landmarks[0].distance.split(" ")[0]
  );
  var maxDistanceFromCity = parseFloat(
    results[0].landmarks[0].distance.split(" ")[0]
  );
  var minDistanceFromAirport = parseFloat(
    results[0].landmarks[1].distance.split(" ")[0]
  );
  var maxDistanceFromAirport = parseFloat(
    results[0].landmarks[1].distance.split(" ")[0]
  );

  var hotelList = [];

  for (let i = 0; i < results.length; i++) {
    var distanceFromCity = parseFloat(
      results[i].landmarks[0].distance.split(" ")[0]
    );
    var distanceFromAirport = parseFloat(
      results[i].landmarks[1].distance.split(" ")[0]
    );

    var starRating = 0;
    try {
      starRating = parseFloat(results[i].starRating);
    } catch (err) {
      // pass
    }

    var userRating = 0;
    try {
      userRating = parseFloat(results[i].guestReviews.unformattedRating) / 2;
    } catch (err) {
      // pass
    }

    if (distanceFromCity > maxDistanceFromCity) {
      maxDistanceFromCity = distanceFromCity;
    }
    if (distanceFromCity < minDistanceFromCity) {
      minDistanceFromCity = distanceFromCity;
    }

    if (distanceFromAirport > maxDistanceFromAirport) {
      maxDistanceFromAirport = distanceFromAirport;
    }
    if (distanceFromAirport < minDistanceFromAirport) {
      minDistanceFromAirport = distanceFromAirport;
    }

    hotelList.push([
      results[i].name,
      distanceFromCity,
      distanceFromAirport,
      starRating,
      userRating,
      results[i].thumbnailUrl,
      results[i].address
    ]);
  }

  // console.log(hotelList);
  hotelList.map(el => {
    el[1] = normalize(el[1], minDistanceFromCity, maxDistanceFromCity);
    el[2] = normalize(el[1], minDistanceFromAirport, maxDistanceFromAirport);
  });

  var hotelReccomendation = [];

  for (let el of hotelList) {
    hotelReccomendation.push([el[0], calcPoint(el, userAnswer), el[5], el[6]]);
  }

  hotelReccomendation.sort((a, b) => {
    return b[1] - a[1];
  });
  // for (let i = 0; i < 10; i++) {
  //   console.log(hotelReccomendation[i]);
  // }
  return hotelReccomendation.slice(0, 10);
};

const normalize = (value, minimum, maximum) => {
  var result;
  if (minimum === maximum) result = 0;
  else {
    result = 5 - (5 * (value - minimum)) / (maximum - minimum);
  }
  return result;
};

const calcPoint = (hotel, userAns) => {
  var res = 0;
  var multiplier = [0.8, 0.6, 0.3, 0.2];
  var hotelPriority = userAns["hotel"];
  console.log("ASD")
  console.log(userAns);
  for (let i = 0; i < hotelPriority.length; i++) {
    switch (hotelPriority[i]) {
      case "Near to city centre":
        res += multiplier[i] * hotel[1];
        break;
      case "Near to the airport":
        res += multiplier[i] * hotel[2];
        break;
      case "Hotel star rating":
        res += multiplier[i] * hotel[3];
        break;
      case "Hotel review":
        res += multiplier[i] * hotel[4];
        break;
      default:
        break;
    }
  }
  return res;
};

module.exports = name;
