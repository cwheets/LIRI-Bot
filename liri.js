require("dotenv").config();

var fs = require("fs")

var axios = require("axios");

var keys = require("./keys.js");

var Spotify = require("node-spotify-api");

var spotify = new Spotify(keys.spotify);

var userInput = process.argv[2];

var querySearch = process.argv.slice(3).join(" ");
var moment = require('moment');


switch (userInput) {
  case `spotify-this-song`:
    spotifySearch();
    break;
  case `concert-this`:
    concertSearch();
    break;
  case `movie-this`:
    movieSearch();
    break;
  case `do-what-it-says`:
    Doit();
    break;
  default:
    console.log(`I am unable to respond with a valid request please try:
                        "spotify-this-song"
                        "conert-this"
                        "movie-this"
                        do-what-it-says
                    followed by an appropriate message`);
}

function spotifySearch() {
  spotify.search({ type: "track", query: querySearch, limit: 1 }, function(
    err,
    data
  ) {
    if (err) {
      return console.log("Error occurred: " + err);
    }

    console.log(JSON.stringify(data.tracks.items[0].artists[0].name, null, 2));
    console.log(JSON.stringify(data.tracks.items[0].album.name, null, 2));
    console.log(JSON.stringify(data.tracks.items[0].name, null, 2));
    console.log(JSON.stringify(data.tracks.items[0].preview_url, null, 2));
  });
}
function movieSearch() {
  axios
    .get(
      `http://www.omdbapi.com/?t=${querySearch}&y=&plot=short&apikey=trilogy`
    )
    .then(function(response) {
      console.log(`title: ${response.data.Title}`);
      console.log(`Release Year: ${response.data.Year}`);
      console.log(`IMDB score: ${response.data.imdbRating}`);
      console.log(`Rotten Tomatoes score: ${response.data.Ratings[1].Value}`);
      console.log(`Country released: ${response.data.Country}`)
      console.log(`Languages available: ${response.data.Language}`)
      console.log(`Actors include: ${response.data.Actors}`)
      console.log(`Plot summary: ${response.data.Plot}`);
      
      
    })
    .catch(function(error) {
      if (error.response) {
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}
function concertSearch(){
    axios
    .get(
      `https://rest.bandsintown.com/artists/${querySearch}/events?app_id=codingbootcamp`
    )
    .then(function(response) {
        for(let i = 0;i < response.data.length; i++){
            console.log(`Name of venue : ${response.data[i].venue.name}`)
            console.log(`City: ${response.data[i].venue.city}`)
            console.log(`Date : ${moment((response.data[i].datetime))}`)
            console.log(`------------------------------------------`);
            
        }
    })
    .catch(function(error) {
      if (error.response) {
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}
function Doit(){
    fs.readFile("random.txt", "utf8", function(error, data) {

        if (error) {
         throw error;
        }
        console.log(data);
      
      });
      

}