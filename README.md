# Dinner and a Movie

## Description

Dinner and a Movie provides users with a quick and easy way to enjoy a meal and film from the comfort of their couch with the click of a button.  Simply enter the genre of the movie you want to watch, along with your address (which conveniently autofills based on your location).  Our website will generate a short selection of movies and delivery options to choose from, which is easily refreshable with another button click.

The movies are chosen based on the top 500 most popular films in a genre, with more popular movies more likely to be chosen. The delivery options will vary according to the genre of the film you select - an action movie might result in pizza or buffalo wings, while a documentary could result in vegetarian or Chinese recommendations.

The site is simple and minimalistic by design, allowing users to quickly decide on their evening's entertainment.  Our app bypasses the effort of scrounging up menus for the dozens of local delivery places, or stressing over which of the hundreds of popular movies a user really wants to see; Choosing from a mere handful of quality options makes things easy and worryfree.  Just give the app a try, and enjoy your Dinner and a Movie!

## Screenshots
Home Page:
![](http://imgur.com/xh7WQPa.png)


Address Autofill:
![](http://imgur.com/U5oplwn.png)


Movie Details:
![](http://imgur.com/hDe4Dsv.png)


Nearby Delivery Option Details:
![](http://imgur.com/msTr3Lp.png)


## Languages used:
* HTML
* CSS
* Bootstrap
* Javascript
* JQuery Library
* Google Maps Library
* Google Maps 'Places' Library

## Technologies used
- Twitter Bootstrap
- Modals
- Popovers
- Firebase
- TheMovieDB API
- Google Maps API
- Google Maps Geolocation

## Getting Started

Clone or download the repository to your desktop.

### Prerequisites

Users will need Google Chrome web browser for testing the web page, and Sublime (or another tool) for viewing/editing the code.

PLEASE NOTE:  Users will need to be connected to the internet for website testing to function properly, as this site relies heavily on API calls for movie information and food delivery options.  

## Testing the Website

1. Run index.html to open up the website.  
2. Enable location services (if requested), in order to allow address autofill to complete based on your current location.  
3. Click on the popcorn to get started, then enter an address and select a movie genre.  
4. Click the 'see your options' button to get your movie/dinner results.  Five movie results will be for the genre you chose, while the sixth 'bonus option' will be pulled from Firebase as a movie from the last search performed on our site.
5. Hover over a movie for more information, and click on any of the map markers for additional restaurant details, including rating, phone number, and website (or a google page for the restaurant if they haven't listed a website).  
6. Click the 'try again' button to get a new set of movies and food delivery options.

PLEASE NOTE:  Currently the food delivery option part of the site runs best if user limits testing to urban areas, where plenty of restaurants for various food types are marked with delivery available through the Google Maps API.  In the future, we would consider adding results for more generic deliveries as well as restaurants offering carryout or a larger search in order to better include rural/suburban users.

## Built With

* Sublime
* Heroku (for initial website test deployment)

## Code Walkthrough
Please refer to the repository files for coding samples; The sections are commented to indicate their functionality. 

In particular, the following are the main files we built out in this project:
* index.html - Basic website design, including the popcorn button, input forms, and overall layout.
* /assets/css/style.css - Customized styling to expand on basic bootstrap functionality, including the opening curtains on page load and google map appearance.
* /assets/javascript/app.js - Background functionality, including TheMovieDB and Google Maps API interactions, movies chosen by a 'weighted' random function (more popular movies chosen more often), and firebase storage of a movie from the previous search.

If you have any questions about how/why something works, feel free to contact a member of the [Project Team](https://github.com/trgmedina/netflix-and-chill/graphs/contributors) for details. 

## Authors

* **Stef Bezanis** - [bezanis23](https://github.com/bezanis23)
* **Susan Heiniger** - [SusanArend](https://github.com/SusanArend)
* **Adam McNerney** - [NorthNern](https://github.com/NorthNern)
* **Theresa Medina** - [trgmedina](https://github.com/trgmedina)
* **Gianna Mirabelli** - [giannamirabelli16](https://github.com/giannamirabelli16)

See also the list of [contributors](https://github.com/trgmedina/netflix-and-chill/graphs/contributors) who participated in this project.

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration from everyone who has ever used the words 'netflix and chill'
* Gratitude to the NU Coding Boot Camp team
* etc.
