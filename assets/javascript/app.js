///IMPORTANT:  Testindex loads this and works, some of the css styling might be necessary for google map to appear correctly
// copy and paste info from testindex such as css and <script> information if things break

// VERY IMPORTANT TODO:  Our stuff triggers on button click - prevent 'pressing enter'in address field or work around it!
//IMPORTANT TODO:  If google maps returns no results on new search, say something like "Sorry, there are no places currently open that offer xxx delivery in your area.  Try one of these options instead!"
//...then return a much more generic search for any delivery food nearby

//TODO:  add command to remove old mapmarkers (put in new search function)

//TODO:  Add in brief description of what app does in the summary popup/modal (find 5 movies plus a bonus option from the last person to use this site, and up to 5 nearby places that deliver a type of food that fits your movie genre!)

      // This example requires the Places library. Include the libraries=places
      // parameter when you first load the API. For example:
      // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

//TODO:  Currently could only be rolled out in urban areas - would need to detect and expand delivery searchers for rural/suburban areas (or else not enough close by results for specific food types)

//Firebase Config
var config = {
    apiKey: "AIzaSyA91xHzvNhMfK_pbS76BNLzJMwNtY8Xp6U",
    authDomain: "dinner-and-movie-6e639.firebaseapp.com",
    databaseURL: "https://dinner-and-movie-6e639.firebaseio.com",
    projectId: "dinner-and-movie-6e639",
    storageBucket: "dinner-and-movie-6e639.appspot.com",
    messagingSenderId: "715283396911"
  };
  
firebase.initializeApp(config);

var dataRef = firebase.database();


//GOOGLE MAPS global variables
var map;
var infowindow;
var service;
//var userPlaceIdFromGoogleApi;
var userLocationFromGoogleApi = {lat: 41.881, lng: -87.623}; // starts nearby search off in chicago if can't read geolocation.
var userLocationFromGoogleApi2;
var placeSearch, autocomplete;
var userGeolocation;
var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};
var markers = [];

//Movie global variables
var movieApiKey = "389d68be11b0e85f0a15885dff0f20ce"; //api key for themoviedb
var movieGenreId;
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
var foodArrayHorror = ["bakery", "sandwiches"];  //easy to eat / comfort foods?
var foodArrayComedy = ["bbq", "breakfast"]; //messy foods?
var foodArrayRomance = ["dessert", "italian", "thai"];
var foodArrayDocumentary = ["asian", "chinese", "indian", "vegetarian"];  //ethnic foods?
var foodArrayAnimation = ["fast food", "mexican", "pizza"];  //family foods?
var foodArrayDrama = ["asian", "deli", "healthy", "pasta", "sushi", "steak"]; //filling meals?  
var lastMovie;
var firebaseMovie;
var locationSubmitted = true;


if (navigator.geolocation) {
  console.log('Geolocation is supported!');
} else {
        console.log('Geolocation is not supported for this Browser/OS.');
}

  //This gets the user's current position on load to help address autocomplete function better (it looks at nearby addresses first)
window.onload = function() {
  var startPos;
  var startLat;
  var startLon;

  var geoSuccess = function(position) {
    startPos = position;
    startLat = startPos.coords.latitude;
    startLon = startPos.coords.longitude;
  };
  navigator.geolocation.getCurrentPosition(function(position) {
    userLocationFromGoogleApi = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    map.setCenter(userLocationFromGoogleApi);
  });
};

//Everything on this function loads with page thanks to callback=initmap in html script.  
//Initmap was combined with the 'autocomplete' function to get both a map and a searchable address bar.
function initMap() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete-field')),
      {types: ['geocode']});

  // When the user selects an address from the dropdown of address suggestions, populate the address
  // fields in the form.
  autocomplete.addListener('place_changed', fillInAddress);

  //  var chicago = {lat: 41.881, lng: -87.623};  // can use this for testing or to set a location if geolocation not available
  map = new google.maps.Map(document.getElementById('map'), {
    center: userLocationFromGoogleApi,
    zoom: 15
  });

  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
}

function fillInAddress() {   // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();        
  //userPlaceIdFromGoogleApi = place.place_id; //place id is generally static and could be stored if desired in future (saving locations)
  userLocationFromGoogleApi = place.geometry.location; // see above, might be useful in future
  userLocationFromGoogleApi2 = {
    lat: place.geometry.location.lat(),
    lng: place.geometry.location.lng()
  }
  //The following section filled out address fields (before we removed) - can add back in if we want to display/store them.
  // for (var component in componentForm) {
  //   document.getElementById(component).value = '';
  //   document.getElementById(component).disabled = false;
  // }
  //   // Get each component of the address from the place details
  //   // and fill the corresponding field on the form.
  // for (var i = 0; i < place.address_components.length; i++) {
  //   var addressType = place.address_components[i].types[0];
  //   if (componentForm[addressType]) {
  //   var val = place.address_components[i][componentForm[addressType]];
  //     document.getElementById(addressType).value = val;
  //   }
  // }
}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function clearMarkers() {
  setMapOnAll(null);
}

function deleteMarkers(){
  clearMarkers();
  markers = [];
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    //results is 20 objects, currently set to 5 to fit the 'minimal' look of our app.  could increase if desired.
    for (var i = 0; i < results.length && i < 5; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    placeId: place.place_id,
    position: place.geometry.location
  });
  markers.push(marker);

  google.maps.event.addListener(marker, 'click', function() {
    service.getDetails(place, function(result, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
      }
      //Added if statement to only display website if it exists, else display result.url (googles info), or nothing. 
      //i think if (result.website === undefined) would work for version with result.url.
      if (result.website === undefined) {
        infowindow.setContent('<span style="padding: 0px; text-align:left" align="left"><h5>' + 
        result.name + '&nbsp; &nbsp; ' + result.rating + '</h5><p>' + result.formatted_address + 
        '<br />' + result.formatted_phone_number + '<br />' +  '<a  target="_blank" href=' + 
        result.url + '>' + result.url + '</a></p>' ) ;
      } else {
        infowindow.setContent('<span style="padding: 0px; text-align:left" align="left"><h5>' + 
        result.name + '&nbsp; &nbsp; ' + result.rating + '</h5><p>' + result.formatted_address + 
        '<br />' + result.formatted_phone_number + '<br />' +  '<a  target="_blank" href=' + 
        result.website + '>' + result.website + '</a></p>' ) ;
      }
    });
    infowindow.open(map, this);
  });
}

function searchNewLocation(referenceLocation){
  // console.log ("random food position: " + Math.floor(Math.random()*foodArray.length));
  foodChoice = foodArray[Math.floor(Math.random()*foodArray.length)]
  // console.log ("Your food for this movie is: " + foodChoice);
  //TODO:  put the above in a display div
  var googleRequest = {
    location: referenceLocation,
    radius: 800,
    // openNow: true,  OPTIONAL:  Could uncomment this in future - Could be helpful, but extremely limits results.
    keyword: foodChoice, // TODO: take in a variable for food, random selection from food arrays
    type: ['meal_delivery']
    //futureTODO:  If not enough results come back, instead search results for type: [meal_takeaway], or any generic delivery
  };
  infowindow = new google.maps.InfoWindow();
  var googleService = new google.maps.places.PlacesService(map);
  googleService.nearbySearch(googleRequest, callback);
}


//document.ready interferes with google functions (google loads on page start already) so only included below
$(document).ready(function() {

  //prevents hitting 'enter' instead of using button to submit
  $(document).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });

  //Commented out because combined with movie code button push below
  // $("#form-submit").on("click", function() {
  //   deleteMarkers();
  //   initMap();
  //   searchNewLocation(userLocationFromGoogleApi2)
  //   $("#map").css("visibility", "visible");
  // });  

  //END GOOGLE MAPS CODE, START MOVIE CODE----------------------------------------------

  function fillFoodArray (chosenGenreArray) {
    foodArray = [];
    for (var i = 0; i < chosenGenreArray.length; i++) {
      foodArray.push(chosenGenreArray[i]);
    }
  }

  //finds random movies from object array without repeats
  function chooseMovieFromApi (apiResults) {
    var randomArrayPosition = (Math.floor(Math.random() * searchSelectOptions.length));
    var searchSelect = searchSelectOptions[randomArrayPosition]; //chooses random movie
    // console.log(searchSelect);  //this is just a test to make sure its working TODO: remove in final
    // console.log("apiResults:"+  apiResults);
    movieSelect = apiResults.results[searchSelect];
    movieChoices.push(movieSelect);
    searchSelectOptions.splice(randomArrayPosition,1);  //prevents movie from being chosen twice
  }

  //The following section creates date variables in the format required to search themoviedb api
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

  //date settings for 1 month for theatre release, if we choose to have a 'go-out' section as well (in future)
  if (mm > 1) {
    theatreFirstMonth = mm - 1;
    theatreFirstYear = yyyy;    
  } else {
    theatreFirstMonth = mm + 11;
    theatreFirstMonth = yyyy - 1;
  }
  theatreFirstDate = theatreFirstYear +'-' + theatreFirstMonth + '-' + dd;



  $(document).on("click", "#form-submit", function() {
    
    if ($("#autocomplete-field").val() === ''){      
      locationSubmitted = false;
      //TODO:  Replace address text with a message prompting user to insert a location if they want food options.
      //return false;  -- this would also stop movies reloading if we want a firm prompt
    }

    event.preventDefault();
   
    $("#form-submit").text("Don't like what you see? Click here to try again!")

    var movieGenre = $("#genre-input").val().trim();
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


    if (locationSubmitted === true){
      deleteMarkers();
      initMap();
      searchNewLocation(userLocationFromGoogleApi2);
      $("#map").css("visibility", "visible");
    }

    // $("#genre-input").val("");  //blanks out genre if we decide we want that
    //following section makes it more likely to choose more popular movies, but still possible for others
    weightedRandom = (Math.ceil(Math.random()*5)); 
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
        var movieRow = $("#movie-row");
        movieRow.empty();
        // console.log(queryURL)
        // console.log(response) 
        searchSelectOptions = [];
        for (var i=0; i < 20; i++){
          searchSelectOptions.push(i);  // creates an array for choosing random movies from results page without repeats
        }
        for (var i=0; i < 5; i++) {
      
          //gets random movie from 1-20 of results. 
          chooseMovieFromApi(response);
          // console.log("movieChoices i = " + movieChoices[i])
          movieRow
               // 
               .append($('<div class="col-sm-2 text-center wrapper">' + 
                '<div class="poster">' + 
                '<img src="' + posterPath + movieChoices[i].poster_path + '" data-toggle="popover" data-trigger="hover" title="' + movieChoices[i].title + '" data-content="' + movieChoices[i].overview + '"></div></div>'))
               .appendTo("#movie"+i);
   
        lastMovie = movieChoices[i];
       // console.log(lastMovie);

          // $('#movies-appear-here').append('<li>' + movieSelect.title + '</li>'); //this is just a test

          //Allows the user to hover/toggle over the poster and see the appropriate information specific for that movie
          $('[data-toggle="popover"]').popover()
        }

        movieRow
               // 
               .append($('<div class="col-sm-2 text-center wrapper">' + 
                '<div class="poster">' + 
                '<img src="' + posterPath + movieChoices[i].poster_path + '" data-toggle="popover" data-trigger="hover" title="' + movieChoices[i].title + '" data-content="' + movieChoices[i].overview + '"></div></div>'))
               .appendTo("#movie"+i);

        dataRef.ref().push({
          lastMovie : lastMovie,
        });

        dataRef.ref().on("child_added", function(childSnapshot) {
        firebaseMovie = childSnapshot.val();
        console.log(firebaseMovie);
        movieRow
               // 
               .append($('<div class="col-sm-2 text-center wrapper">' + 
                '<div class="poster">' + 
                '<img src="' + posterPath + firebaseMovie.poster_path + '" data-toggle="popover" data-trigger="hover" title="' + firebaseMovie.title + '" data-content="' + firebaseMovie.overview + '"></div></div>'))
               .appendTo("#movie"+5);

        });
      });

    // var title = "test";

    // dataRef.ref().push({

    //     title : title,
    //   });
    });
  });
// });


