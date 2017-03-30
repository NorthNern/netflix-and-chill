

///IMPORTANT:  Testindex loads this and works, some of the css styling might be necessary for google map to appear correctly
// copy and paste info from testindex such as css and <script> information if things break


//IMPORTANT TODO:  If google maps returns no results on new search, say something like "Sorry, there are no places currently open that offer xxx delivery in your area.  Try one of these options instead!"
//...then return a much more generic search for any delivery food nearby

//TODO:  add command to remove old mapmarkers (put in new search function)

   
    //input div for genre
    //*OPTIONAL input div for movie name
    //output div for 5 movies.  include name, rating, crit rating if available, 'yes' button for each movie
    //input div for shuffling output.  Store movies already listed, do not show if same.  Call ajax for 5 more movies
    //
    // on genre submit, store genre as genre_id, ajax call to themoviedb, fill output div
    // if reshuffle, call moviedb function again, choosing a new movie if any are the same
    // once movie is chosen, remove other 4 movies from output div, empty the other divs, move on to yelp (use genre to search 5 nearby foods)
   
      // This example requires the Places library. Include the libraries=places
      // parameter when you first load the API. For example:
      // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">



      var map;
      var infowindow;
      var service;
      //NEW ADDITIONS:
      var userPlaceIdFromGoogleApi;
      var userLocationFromGoogleApi = {lat: 41.881, lng: -87.623};
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

      //END NEW ADDITIONS
       if (navigator.geolocation) {
        console.log('Geolocation is supported!');
      }
      else {
        console.log('Geolocation is not supported for this Browser/OS.');
      }

      window.onload = function() {
        var startPos;
        var startLat;
        var startLon;

        var geoSuccess = function(position) {
          startPos = position;
          startLat = startPos.coords.latitude;
          startLon = startPos.coords.longitude;
          // console.log(startLat);
          // console.log(startLon);
         }; 

         navigator.geolocation.getCurrentPosition(function(position) {
            userLocationFromGoogleApi = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            console.log(userLocationFromGoogleApi);
            map.setCenter(userLocationFromGoogleApi);
          });
      };
      
      console.log(userLocationFromGoogleApi);

      function initMap() {
        //NEW ADDITIONS
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('autocomplete-field')),
            {types: ['geocode']});

        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        autocomplete.addListener('place_changed', fillInAddress);
        //END NEW ADDITIONS

      //  var chicago = {lat: 41.881, lng: -87.623};

      

        map = new google.maps.Map(document.getElementById('map'), {
          //center: chicago,
          center: userLocationFromGoogleApi,
          zoom: 15
        });

        infowindow = new google.maps.InfoWindow();
        service = new google.maps.places.PlacesService(map);

        //map.addListener('idle', performSearch);
        //TODO:  Add if (KEYWORDVARIABLE !== '')
        //Place IDs may change due to large-scale updates on the Google Maps database. In such cases, a pace may receive a new place ID, and the old ID returns a NOT_FOUND response.

        //In particular, some types of place IDs may sometimes cause a NOT_FOUND response, or the API may return a different place ID in the response. :
        //TODO: We may want to include a 'NOT_FOUND' catch, especially if using stored place ids from firebase
        service.nearbySearch({
          location: userLocationFromGoogleApi, //take in a place_idz
          radius: 500,
         // openNow: true,
          keyword: 'pizza', // take in a variable for food
          type: ['restaurant']
        }, callback);
        }




        //TODO:  REfocus map when address info is submitted (call init map again?) use userplaceid to call map, if unavailable use zip 
        //TODO:  Focus map on geolocation instead of chicago at start (use theresa's code)






       // var request = { reference: place.reference };

       //  service.getDetails(request, function(details, status) {
       //    google.maps.event.addListener(marker, 'click', function() {
       //      infowindow.setContent(details.name + "<br />" + details.formatted_address +"<br />" + details.website + "<br />" + details.rating + "<br />" + details.formatted_phone_number);
       //    });
       //    infowindow.open(map, this);
       //  });
      


            //NEW ADDITIONS
      // function initAutocomplete() {
      //   // Create the autocomplete object, restricting the search to geographical
      //   // location types.
      //   autocomplete = new google.maps.places.Autocomplete(
      //       /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      //       {types: ['geocode']});

      //   // When the user selects an address from the dropdown, populate the address
      //   // fields in the form.
      //   autocomplete.addListener('place_changed', fillInAddress);
      // }

      function fillInAddress() {

        // Get the place details from the autocomplete object.
        var place = autocomplete.getPlace();        
        userPlaceIdFromGoogleApi = place.place_id;
        userLocationFromGoogleApi = place.geometry.location;
        userLocationFromGoogleApi2 = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
        for (var component in componentForm) {
          document.getElementById(component).value = '';
          document.getElementById(component).disabled = false;
        }

        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        for (var i = 0; i < place.address_components.length; i++) {
          var addressType = place.address_components[i].types[0];
          if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            document.getElementById(addressType).value = val;
          }
        }
      }

        // Bias the autocomplete object to the user's geographical location,
      // as supplied by the browser's 'navigator.geolocation' object.
      // function geolocate() {
      //   if (navigator.geolocation) {
      //     navigator.geolocation.getCurrentPosition(function(position) {
      //       var geolocation = {
      //         lat: position.coords.latitude,
      //         lng: position.coords.longitude
      //       };
      //       console.log(geolocation);
      //       var circle = new google.maps.Circle({
      //         center: geolocation,
      //         radius: position.coords.accuracy
      //       });
      //       console.log(circle);
      //       autocomplete.setBounds(circle.getBounds());
      //     });
      //   }
      // }



      //END NEW ADDITIONS


//       function performSearch() {
//   // var request = {
//   //   bounds: map.getBounds(),
//   //   keyword: 'best view'
//   // };
//   // service.radarSearch(request, callback);
// }

      function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          console.log("testing if this is run again.")
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

        console.log(place.place_id);



        google.maps.event.addListener(marker, 'click', function() {

          service.getDetails(place, function(result, status) {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
              console.error(status);
              return;
            }
          infowindow.setContent('<span style="padding: 0px; text-align:left" align="left"><h5>' + 
            result.name + '&nbsp; &nbsp; ' + result.rating + '</h5><p>' + result.formatted_address + 
            '<br />' + result.formatted_phone_number + '<br />' +  '<a  target="_blank" href=' + 
            result.website + '>' + result.website + '</a></p>' ) ;

          console.log(place.formatted_address);
          console.log(place.formatted_phone_number);
          console.log(place.website);

          
        });
          infowindow.open(map, this);
        });
      }

  function searchNewLocation(referenceLocation){
    var googleRequest = {
      location: referenceLocation,
      radius: 1500,
      // openNow: true,  TODO:  REMOVE THIS COMMENT.  made it hard to test.
      keyword: 'pizza', // take in a variable for food
      type: ['restaurant']
    };
    console.log("searchNewLocationWorked");
    console.log(referenceLocation);
    infowindow = new google.maps.InfoWindow();
    var googleService = new google.maps.places.PlacesService(map);
    googleService.nearbySearch(googleRequest, callback);
  }
  //document.ready interferes with google functions (loads on page start already, so included below)
  $(document).ready(function() {

      $("#form-submit").on("click", function() {
        console.log("this button works")
        console.log(userLocationFromGoogleApi2)
        initMap();
        searchNewLocation(userLocationFromGoogleApi2)
        $("#map").css("visibility", "visible");
      });  



  //END GOOGLE MAPS CODE, START MOVIE CODE


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


  $(document).on("click", "#form-submit", function() {
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
        $('#movie0').empty();
        $('#movie1').empty();
        $('#movie2').empty();
        $('#movie3').empty();
        $('#movie4').empty();
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
               .appendTo("#movie"+i);
               console.log(movieChoices[i].overview);

          // $('#movies-appear-here').append('<li>' + movieSelect.title + '</li>'); //this is just a test
        }
      });
    });
});


