require("dotenv").config();
var keys = require("./keys.js");
var inquirer = require("inquirer");
var axios = require("axios");
var moment = require('moment');
var request = require('request')
var Spotify = require('node-spotify-api');
var Spotify1 = new Spotify(keys.spotify);
var fs = require("fs");

var default1 = "Mr.Nobody";




/// bansintown fuction
var ConcertThis = function () {
    inquirer.prompt([
        {
            type: "input",
            name: "artistBand",
            message: "Artist/Band Name?"
        }
    ]).then(function (artist) {
        request("https://rest.bandsintown.com/artists/" + artist.artistBand + "/events?app_id=bootcamp9", function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var data = JSON.parse(body);
                var count = 0;
                for (var i = 0; i < data.length; i++) {
                    count++;
                    if (count > 20) return;

                    var dateOfConcert = data[i].datetime;
                    var dateOfConcertFM = moment(dateOfConcert).format("MM/DD/YYYY");

                    var result = {
                        "Name of the venue: ": data[i].venue.name,
                        "Venue location: ": data[i].venue.city + ', ' + data[i].venue.country,
                        "Date of the Event: ": dateOfConcertFM
                    }
                    console.log("-------------------------\n");
                    console.log(result);
                    console.log("\n-------------------------");
                }

            } else console.log("error", error);

        });
        askQuestion();
    });
};





// movie this function
var MovieThis = function () {
    inquirer.prompt([
        {
            type: "input",
            name: "Movie",
            message: "Movie Name?"
        }
    ]).then(function (movie) {
        if (movie.Movie != "") {
            default1 = movie.Movie
        }
        axios.get("http://www.omdbapi.com/?t=" + default1 + "&y=&plot=short&apikey=407a3725").then(
            function (response) {
                console.log("-------------------------\n");
                var result = {
                    "Title: ": response.data.Title,
                    "Year: ": response.data.Year,
                    "imdbRating: ": response.data.imdbRating,
                    "Rotten Tomatoes Rating: ": response.data.imdbRating,
                    "Country: ": response.data.Country,
                    "Language: ": response.data.Language,
                    "Plot: ": response.data.Plot,
                    "Actors: ": response.data.Actors
                }
                console.log(result);
                console.log("\n-------------------------");
            },
            function (error) {
                console.log("error", error);
            }
        );
        askQuestion();
    });
}



// do what it says function
var DoWhatItSays = function () {
    fs.readFile('random.txt', "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        SpotifyThisSong(data);
    })

}




//spotify fuction
var SpotifyThisSong = function (passed) {
    if (passed != undefined) {
        Spotify1.search({ type: 'track', query: passed, limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            var result = {
                "Band name: ": data.tracks.items[0].album.artists[0].name,
                "Song name: ": data.tracks.items[0].name,
                "preview_url: ": data.tracks.items[0].preview_url,
                "Album name: ": data.tracks.items[0].album.name
            }
            console.log("-------------------------\n");
            console.log(result);
            console.log("\n-------------------------");
        });
        askQuestion();
    } else {
        inquirer.prompt([
            {
                type: "input",
                name: "SpotifySong",
                message: "Song Name?"
            }
        ]).then(function (Song) {
            Spotify1.search({ type: 'track', query: Song, limit: 1 }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
                var result = {
                    "Band name: ": data.tracks.items[0].album.artists[0].name,
                    "Song name: ": data.tracks.items[0].name,
                    "preview_url: ": data.tracks.items[0].preview_url,
                    "Album name: ": data.tracks.items[0].album.name
                }
                console.log("-------------------------\n");
                console.log(result);
                console.log("\n-------------------------");
            });
            askQuestion();
        });
    }
};




/// base question being asked
var askQuestion = function () {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What can I do for you?",
            choices: ["Concerts", "Spotify Song Lookup", "OMDB Movie Search", "I Want it That Way", "Exit"]
        }
    ]).then(function (answer) {
        if (answer.choice === "Concerts") {
            ConcertThis();
        } else if (answer.choice === "Spotify Song Lookup") {
            SpotifyThisSong();
        } else if (answer.choice === "OMDB Movie Search") {
            MovieThis();
        } else if (answer.choice === "I Want it That Way") {
            DoWhatItSays();
        } else {
            console.log("Goodbye");
        };
    });

}

// call askQuestion to run our code
askQuestion();