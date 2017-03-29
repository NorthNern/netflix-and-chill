


   
    //input div for genre
    //*OPTIONAL input div for movie name
    //output div for 5 movies.  include name, rating, crit rating if available, 'yes' button for each movie
    //input div for shuffling output.  Store movies already listed, do not show if same.  Call ajax for 5 more movies
    //
    // on genre submit, store genre as genre_id, ajax call to themoviedb, fill output div
    // if reshuffle, call moviedb function again, choosing a new movie if any are the same
    // once movie is chosen, remove other 4 movies from output div, empty the other divs, move on to yelp (use genre to search 5 nearby foods)
// $( function() {
//     $( document ).tooltip();
//   } );  
// $(function () {
//   $('[data-toggle="popover"]').popover()
// });

$(document).ready(function(){

  var api_key = "389d68be11b0e85f0a15885dff0f20ce";
  var movieGenreId;

  //2014-10-22

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  var dvdLastMonth;
  var dvdLastYear;
  var dvdLastDate;
  var dvdFirstMonth;
  var dvdFirstYear;
  var dvdFirstDate;
  var posterPath = "http://image.tmdb.org/t/p/w185";
  today = yyyy +'-' + mm + '-' + dd;

  // date settings for 5 months for first date of dvd release
  if (mm > 5) {
    dvdLastMonth = mm - 5;
    dvdLastYear = yyyy;
  } else {
    dvdLastMonth = mm +7;
  }
  //date settings for 1 year for end date of dvd release

  //date settings for 3 months for theatre release
  // if mm > 5 {

  // }

  if(dd<10) {
      dd='0'+dd
  } 

  if(mm<10) {
      mm='0'+mm
  } 

      ///discover/movie?with_genres=18&primary_release_year=2014
      //http://api.themoviedb.org/3/search/movie?api_key='

      // $(document).on("click", "#gif-search-submit", function(event) {
//     event.preventDefault();
//     var gifTopic = $("#gif-search-term").val().trim();
//     $("#gif-search-term").val("");
//     if (gifTopic !== ""){
//         topics.push(gifTopic); // not strictly necessary, but in case want to reload all buttons
//         create_gif_button(gifTopic);
//     }
// });


// "id": 28, "name": "Action"
// "id": 27, "name": "Horror"
// "id": 35, "name": "Comedy"
// "id": 10749, "name": "Romance"
// "id": 99, "name": "Documentary"
// "id": 16, "name": "Animation"
//TODO:  Add "id": 18, "name": "Drama"


  $(document).on("click", "#movie-genre-submit", function() {
    event.preventDefault();
    var movieGenre = $("#movie-genre-input").val().trim(); //TODO: to lower case or use drop down
    if (movieGenre === "action"){
      movieGenreId = "28";
    }
    if (movieGenre === "horror"){
      movieGenreId = "27";
    }
    if (movieGenre === "comedy"){
      movieGenreId = "35";
    }
    if (movieGenre === "romance"){
      movieGenreId = "27";
    }    
    if (movieGenre === "documentary"){
      movieGenreId = "99";
    }
    if (movieGenre === "animation"){
      movieGenreId = "16";
    }    
    if (movieGenre === "drama"){
      movieGenreId = "18";
    }
    //TODO: Make Else-ifs, plus else to read error if anything else (or use drop down).

    $("#movie-genre-input").val("");
     var queryURL = 'http://api.themoviedb.org/3/discover/movie?api_key=' + api_key + '&with_genres=' + movieGenreId;  


      $.ajax({
        //&primary_release_date.gte=2014-09-15&primary_release_date.lte=2014-10-22 need to include something like this from current date
          //in order to get movies that were recently released (determine time period, how to read current date)
        //sort by popularity, use random number to choose which 5 shown?  could even weight random numbers (if rng1, choose 1-10, if rng2 choose from 1-20, if rng 3, choose from 1-30, etc)
        //could use firebase to store movies already seen (or add option to remove in html, and not show those movies again)

        url: queryURL,
        method: 'GET'
      }).done(function(response) {
        console.log(response) 

        $('#movies-appear-here').empty();
        
        for (var i = 0; i < 5; i++) {

          
    
            $("<div />", { "class":"wrapper", id:"movie"+i })
               .append($('<div class="title">' + '<li>' + response.results[i].title + '</li>' + '</div>'))
               .append($('<div class="poster">'+ '<img src=' + posterPath + response.results[i].poster_path + '>' + '</div>'))
               .append($('<div class="overview">' + '<p>' + response.results[i].overview + '</p>' + '</div>'))
               .appendTo("#movie"+i);
           

        }

        /*var divs = $("div > div");
        for(var i = 0; i < divs.length; i+=3) {
        divs.slice(i, i+3).wrapAll("<div class='new'></div>");
        }*/

      });
    });
});







//         dataType: 'jsonp',
//         jsonpCallback: 'testing'
//       }).error(function() {
//         console.log('error')      }).done(function(response) {
//         console.log(response)
//         for (var i = 0; i < response.results.length; i++) {
//           $('#movies-appear-here').append('<li>' + response.results[i].title + '</li>');
//         }
//       });
//     });
// });










































































// $(document).ready(function() {


// var topics = ["happy", "sad", "bored", "excited", "annoyed", "angry", "facepalm"];
// var gifButtonId = 0; // for setting buttonIDs, will increment whenever a gif button is created

// // creates a gif search button
// function create_gif_button(gifTopic) {
    
//     var gifButton = $("<button>") 
//     gifButton.attr("data-gif", gifTopic);
//     gifButton.text(gifTopic);
//     gifButton.attr("id", 'btn_'+gifButtonId);
//     gifButton.attr("class", "gifSearchButton");
//     gifButtonId++; // in this function instead of in for loop so that additional buttons can be made with incremental ids.
//     $("#gif-buttons-here").append(" ");
//     $("#gif-buttons-here").append(gifButton);
// }

// // creates initial set of gif search buttons
// for (var i =0; i < topics.length; i++) {
//     create_gif_button(topics[i]);
// }

// // adds search button according to text input
// $(document).on("click", "#gif-search-submit", function(event) {
//     event.preventDefault();
//     var gifTopic = $("#gif-search-term").val().trim();
//     $("#gif-search-term").val("");
//     if (gifTopic !== ""){
//         topics.push(gifTopic); // not strictly necessary, but in case want to reload all buttons
//         create_gif_button(gifTopic);
//     }
// });

// // buttons search using giphy api, limited to 10 gifs that start off frozen and can be clicked to animate
// $(document).on("click", ".gifSearchButton", function() {
//     var gifSearch = $(this).attr("data-gif");
//     var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + gifSearch + "&api_key=dc6zaTOxFJmzC&limit=10";

//     $("#gifs-appear-here").empty();  

//     $.ajax({
//             url: queryURL,
//             method: "GET"
//           }).done(function(response) {

//             console.log(response);

//             var results = response.data;

//             for (var i = 0; i < results.length; i++) {
                
//                 var giphyDiv = $("<div class='item'>");
//                 var p = $("<p>");
//                 var giphyImage = $("<img>");
//                 giphyImage.attr("src", results[i].images.fixed_height_still.url);
//                 giphyImage.attr("data-still", results[i].images.fixed_height_still.url);
//                 giphyImage.attr("data-animate", results[i].images.fixed_height.url);
//                 giphyImage.attr("class", "gif");
//                 giphyImage.attr("data-state", "still")

//                 $(p).text("Rating: " + results[i].rating);

//                 giphyDiv.prepend(p);
//                 giphyDiv.prepend(giphyImage);
//                 $("#gifs-appear-here").prepend(giphyDiv);        
//             }
//     });
// });

// //freezes/unfreezes gifs when clicked
//  $(document).on("click", ".gif", function() {

//       var state = $(this).attr("data-state");

//       console.log(state);

//       if (state === "still"){
//           $(this).attr("src", $(this).attr("data-animate"));
//           $(this).attr("data-state", "animate");
//       }
//       else {
//           $(this).attr("src", $(this).attr("data-still"));
//           $(this).attr("data-state", "still");
//       }
//     });
// });







































// // $(document).ready(function() {

// // //defining all global variables
// // var currentScore = 0;
// // var right_answers = 0; var wrong_answers = 0;
// // var answered_right = "";
// // var quiz_ended = "false";
// // var current_question = 0;
// // var countdown;
// // var countdown_number;
// // var answered_timeout = false;

// // //quiz questions, array of objects with a list of questions, answers, and the correct answer.
// // var trivia_array = [{
// //         question : "What color is a black bear?",
// //         answers : ["Black", "Yellow", "Blue", "Red"],
// //         correctAnswer : "Black"
// //     },{
// //         question : "What color is a brown bear?",
// //         answers : ["Brown", "Orange", "Pink", "White"],
// //         correctAnswer : "Brown"
// //     },{
// //         question : "What color is a purple bear?",
// //         answers : ["Purple", "Gray", "Green", "Purple bears don't exist"],
// //         correctAnswer : "Purple bears don't exist"
// //     }
// //     ];

// // // first countdown call, set timer at one more than desired wait.
// // function countdown_init() {
// //     answered_timeout = false;
// //     countdown_number = 4;
// //     $("#countdown-text").html("Time remaining: ")
// //     countdown_trigger();
// // }

// // //timer countsdown, if at 0 goes to the answer function
// // function countdown_trigger(){
// //     if (countdown_number > 0) {
// //         countdown_number--;
// //         $("#countdown-text-time").html(countdown_number);
// //         if(countdown_number > 0) {
// //             countdown = setTimeout(countdown_trigger, 1000);
// //         }
// //     } 
// //     if (countdown_number === 0) {
// //         answered_right = "wrong";
// //         answered_timeout = true;
// //         countdown_clear();
// //         answer_page();
// //     }
// // }

// // function countdown_clear(){
// //     clearTimeout(countdown);
// //     $("#countdown-text").empty();
// //     $("#countdown-text-time").empty();
// // }

// // //when asking a question, reads current position in question array and adds buttons for answers, as well as adding a data-var for in/correct answer
// // function next_question(){
// //     if (current_question === trivia_array.length){
// //         game_end();
// //     } else {
// //     $