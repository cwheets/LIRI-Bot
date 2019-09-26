require("dotenv").config();

var fs = require("fs");

var axios = require("axios");

var keys = require("./keys.js");

var Spotify = require("node-spotify-api");

var spotify = new Spotify(keys.spotify);

var inquirer = require("inquirer");

var moment = require("moment");

async function liriMenu() {
  const selectAPI = {
    name: "operation",
    type: "list",
    message: "please select an api to search",
    choices: [
      "spotify-this-song",
      "concert-this",
      "movie-this",
      "do-what-this-says"
    ]
  };

  const selectSearchTerm = {
    name: "searchTerm",
    message: "insert relavent search",
    type: "input",
    when: function(answer) {
      if (answer.operation !== "do-what-this-says") {
        return true;
      }
      return false;
    }
  };

  const answer = await inquirer.prompt([selectAPI, selectSearchTerm]);

  var querySearch = answer.searchTerm;

  switch (answer.operation) {
    case `spotify-this-song`:
      spotifySearch(querySearch);
      break;
    case `concert-this`:
      concertSearch(querySearch);
      break;
    case `movie-this`:
      movieSearch(querySearch);
      break;
    case `do-what-this-says`:
      Doit();
      break;
    default:
  }
}

liriMenu();

function prettify(...args) {
  args.forEach(arg => {
    console.log(JSON.stringify(arg, null, 2));
  });
}

function spotifySearch(querySearch) {
  return new Promise((resolve, reject) => {
    spotify.search({ type: "track", query: querySearch, limit: 1 }, function(
      err,
      data
    ) {
      if (err) {
        reject(new Error("There was an error with spotify!"));
      }
      prettify(
        data.tracks.items[0].artists[0].name,
        data.tracks.items[0].album.name,
        data.tracks.items[0].name,
        data.tracks.items[0].preview_url
      );
      resolve();
    });
  });
}

async function movieSearch(querySearch) {
  try {
    const response = await axios.get(
      `http://www.omdbapi.com/?t=${querySearch}&y=&plot=short&apikey=trilogy`
    );
    prettify(
      `title: ${response.data.Title}`,
      `Release Year: ${response.data.Year}`,
      `IMDB score: ${response.data.imdbRating}`,
      `Rotten Tomatoes score: ${response.data.Ratings[1].Value}`,
      `Country released: ${response.data.Country}`,
      `Languages available: ${response.data.Language}`,
      `Actors include: ${response.data.Actors}`
    );
    console.log(
      `title: ${response.data.Title}`,
      `Plot summary: ${response.data.Plot}`
    );
  } catch (error) {
    console.log(error);
  }
}
async function concertSearch(querySearch) {
  try {
    const response = await axios.get(
      `https://rest.bandsintown.com/artists/${querySearch}/events?app_id=codingbootcamp`
    );
    for (let i = 0; i < response.data.length; i++) {
      prettify(
        `Name of venue : ${response.data[i].venue.name}`,
        `City: ${response.data[i].venue.city}`,
        `Date : ${moment(response.data[i].datetime).format("MM/DD/YYYY")}`,
        `------------------------------------------`
      );
    }
  } catch (error) {
    console.log(error);
  }
}
function Doit() {
  fs.readFile("random.txt", "utf8", async function(error, data) {
    if (error) {
      throw error;
    }

    var lines = data.split("\n");

    for (let i = 0; i < lines.length; i++) {
      var line = lines[i].replace("\r", "").split(",");
      var [command, searchTerm] = line;

      switch (command) {
        case `spotify-this-song`:
          await spotifySearch(searchTerm);
          break;
        case `concert-this`:
          await concertSearch(searchTerm);
          break;
        case `movie-this`:
          await movieSearch(searchTerm);
          break;
      }
    }
  });
}
