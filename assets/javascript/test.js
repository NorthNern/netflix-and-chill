


   
    //input div for genre
    //*OPTIONAL input div for movie name
    //output div for 5 movies.  include name, rating, crit rating if available, 'yes' button for each movie
    //input div for shuffling output.  Store movies already listed, do not show if same.  Call ajax for 5 more movies
    //
    // on genre submit, store genre as genre_id, ajax call to themoviedb, fill output div
    // if reshuffle, call moviedb function again, choosing a new movie if any are the same
    // once movie is chosen, remove other 4 movies from output div, empty the other divs, move on to yelp (use genre to search 5 nearby foods)
    

$(document).ready(function(){

  var movieApiKey = "389d68be11b0e85f0a15885dff0f20ce";
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
  var theatreFirstMonth;
  var theatreFirstYear;
  var theatreFirstDate;
  var searchPage; // for which page of results to search, each page has 20 movies
  var searchSelect;
  var searchSelectOptions = [];
  var movieSelect;
  var movieChoices = []; //**IMPORTANT** this is the array of movies returned after ajax call, currently holds 5 objects
  var posterPath = "http://image.tmdb.org/t/p/w185";
  var weightedRandom;
  var foodArray = [];
  var foodArrayAction = ["american", "chicken", "pizza", "wings"];
  var foodArrayHorror = ["bakery", "dessert", "sandwiches"];  //easy to eat / comfort foods?
  var foodArrayComedy = ["bbq", "breakfast", "cheesesteaks", "chili"]; //messy foods?
  var foodArrayRomance = ["ice cream", "italian", "thai"];
  var foodArrayDocumentary = ["asian", "chinese", "indian", "vegetarian"];  //ethnic foods?
  var foodArrayAnimation = ["fast food", "mexican", "pizza"];  //family foods?
  var foodArrayDrama = ["asian", "deli", "healthy", "pasta", "sushi", "steak"]; //filling meals?  

  function fillFoodArray (chosenGenreArray) {
    for (var i = 0; i < chosenGenreArray.length; i++) {
      foodArray[i] = chosenGenreArray[i]
    }
  }

  function chooseMovieFromApi (apiResults) {
    //TODO optional: could repeat function if movieSelect.title matches any firebase stored movies
    var randomArrayPosition = (Math.floor(Math.random() * searchSelectOptions.length));
    var searchSelect = searchSelectOptions[randomArrayPosition]; //chooses random movie
    console.log(searchSelect);  //TODO: remove in final project
    console.log("apiResults:"+  apiResults);
    movieSelect = apiResults.results[searchSelect];
    movieChoices.push(movieSelect);
    searchSelectOptions.splice(randomArrayPosition,1);  //prevents movie from being chosen twice
    console.log(searchSelectOptions);
    }

  today = yyyy +'-' + mm + '-' + dd;

  // date settings for 5 months for first date to filter out most that haven't been released
  if (mm > 5) {
    dvdLastMonth = mm - 5;
    dvdLastYear = yyyy;    
  } else {
    dvdLastMonth = mm + 7;
    dvdLastYear = yyyy - 1;
  }
  dvdFirstYear = yyyy - 70;  // can change this to only show recent movies if wanted
  dvdFirstMonth = mm;
  dvdFirstDate = dvdFirstYear +'-' + dvdFirstMonth + '-' + dd;
  dvdLastDate = dvdLastYear +'-' + dvdLastMonth + '-' + dd;

  //date settings for 1 month for theatre release, if we choose to have a 'go-out' section
  if (mm > 1) {
    theatreFirstMonth = mm - 1;
    theatreFirstYear = yyyy;    
  } else {
    theatreFirstMonth = mm + 11;
    theatreFirstMonth = yyyy - 1;
  }
  theatreFirstDate = theatreFirstYear +'-' + theatreFirstMonth + '-' + dd;

//TODO:  Add "id": 18, "name": "Drama" , remove all ifs/elses and replace with drop-down input


  $(document).on("click", "#submitbutton", function() {
    event.preventDefault();
    var movieGenre = $("#genre-input").val().trim(); //TODO: to lower case or use drop down
    if (movieGenre === "action"){
      movieGenreId = "28";
      fillFoodArray(foodArrayAction);
    }
    if (movieGenre === "horror"){
      movieGenreId = "27";
      fillFoodArray(foodArrayHorror);
    }
    if (movieGenre === "comedy"){
      movieGenreId = "35";
      fillFoodArray(foodArrayComedy);
    }
    if (movieGenre === "romance"){
      movieGenreId = "10749";
      fillFoodArray(foodArrayRomance);
    }    
    if (movieGenre === "documentary"){
      movieGenreId = "99";
      fillFoodArray(foodArrayDocumentary);
    }
    if (movieGenre === "animation"){
      movieGenreId = "16";
      fillFoodArray(foodArrayAnimation);
    }    
    if (movieGenre === "drama"){
      movieGenreId = "18";
      fillFoodArray(foodArrayDrama);
    }
    //TODO: Make Else-ifs, plus else to read error if anything else (or use drop down).

    $("#genre-input").val("");
    weightedRandom = (Math.ceil(Math.random()*5)); //makes it more likely to choose better movies, but still possible for others
    if (weightedRandom = 1) {      
      searchPage = (Math.ceil(Math.random() * 5));
    }
    if (weightedRandom = 2) {
      searchPage = (Math.ceil(Math.random() * 10));         
    }
    if (weightedRandom = 3) {
      searchPage = (Math.ceil(Math.random() * 15));         
    }
    if (weightedRandom = 4) {
      searchPage = (Math.ceil(Math.random() * 20));         
    }
    if (weightedRandom = 5) {
      searchPage = (Math.ceil(Math.random() * 25));         
    }
     var queryURL = 'http://api.themoviedb.org/3/discover/movie?api_key=' + movieApiKey + '&sort_by=popularity.desc' + 
      '&with_genres=' + movieGenreId + '&primary_release_date.gte=' + dvdFirstDate + '&primary_release_date.lte=' + dvdLastDate
      + '&page=' + searchPage;  

      $.ajax({
               //could use firebase to store movies already seen (or add option to remove in html, and not show those movies again)

        url: queryURL,
        method: 'GET'
      }).done(function(response) {
        movieChoices = []
        $('#movies-appear-here').empty();
        console.log(queryURL)
        console.log(response) 
        searchSelectOptions = [];
        for (var i=0; i < 20; i++){
          searchSelectOptions.push(i);  // creates an array for choosing random movies from results page without repeats
        }
        for (var i=0; i < 5; i++) {

          //gets random movie from 1-20 of results. 
          chooseMovieFromApi(response);
          console.log("movieChoices i = " + movieChoices[i])
          $("<div />", { "class":"wrapper", id:"movie"+i })
               .append($('<div class="title">' + '<li>' + movieChoices[i].title + '</li>' + '</div>'))
               .append($('<div class="poster">'+ '<img src=' + posterPath + movieChoices[i].poster_path + '>' + '</div>'))
               .append($('<div class="overview">' + '<p>' + movieChoices[i].overview + '</p>' + '</div>'))
               .appendTo("#resultsmodal");
               console.log(movieChoices[i].overview);

          // $('#movies-appear-here').append('<li>' + movieSelect.title + '</li>'); //this is just a test
        }
      });
    });
});

//IMPORTANT SECTIONS TO DO:  
//1.  use movieChoices array to output movie info in desired format.  it is an array of 5 objects, each object a randomly chosen movie
//2.  google stuff
//3.





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
// //     $("#game-information").empty();
// //     $("#game-information").html(trivia_array[current_question].question)
// //         for (var i = 0; i < trivia_array[current_question].answers.length; i++) {
// //             var a = $("<button>");
// //             // Adding a class
// //             a.addClass("answer_button btn-primary btn-lg");
// //             // Added a data-attribute
// //             if (trivia_array[current_question].answers[i] === trivia_array[current_question].correctAnswer){
// //                 a.attr("data-answer", "correct");
// //             } else{
// //             a.attr("data-answer", "wrong");
// //             }
// //             // Provided the initial button text
// //             a.text(trivia_array[current_question].answers[i]);
// //             // Added the button to the HTML
// //             $("#game-answer-buttons").append(a).append("  ");
// //         }
// //         countdown_init();

// //     }
// // };

// // //when a question answered or timed out, displays info for 3 seconds then calls the next question
// // function answer_page() {
// //     $("#game-information").empty();
// //     $("#game-questions").empty();
// //     $("#game-answer-buttons").empty();
// //     if (answered_right === "correct"){
// //         right_answers++;
// //         $(".win").html(right_answers);
// //         $(".loss").html(wrong_answers);
// //         $("#game-information").html("Congratulations!  That was the right answer!")
// //         setTimeout(next_question, 3000);   
// //     } else if (answered_timeout === true) {
// //         wrong_answers++;
// //         $(".win").html(right_answers);
// //         $(".loss").html(wrong_answers);
// //         $("#game-information").html("Sorry, you failed to answer the question in time.  The correct answer was: " + trivia_array[current_question].correctAnswer)
// //         setTimeout(next_question, 3000);   
// //     } else {
// //         wrong_answers++;
// //         $(".win").html(right_answers);
// //         $(".loss").html(wrong_answers);
// //         $("#game-information").html("Sorry, you failed to answer correctly.  The correct answer was: " + trivia_array[current_question].correctAnswer)
// //         setTimeout(next_question, 3000);   
// //     }     
// //     current_question++;
// // }

// // //end of game
// // function game_end() {
// //     $("#game-information").html("Phew, that's all the questions for today.  Thanks for playing!  If you'd like to play again, please press any key.");
// //     $("#game-questions").empty();
// //     document.onkeyup = function(event) {
// //         var quiz_ended = "false";
// //         current_question = 0;
// //         answered_timeout = false;
// //         next_question();
// //     }
// // }    

// // //running the start of game function for the first time, with delay to show instructions
// // //TODO: Add document.onkeyup to start when user presses a key?
// // setTimeout(next_question,3000);

// // //on-click functions for each of the answer buttons, which use a data variable stored when button created to check if its the correct answer
// // $("#game-answer-buttons").on("click", ".answer_button", function() {
// //     countdown_clear();
// //     // console.log("this button worked")
// //     answered_right = $(this).attr("data-answer")
// //     answer_page();
// //     });


// // });

