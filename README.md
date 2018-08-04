# Neighborhood Map React
Udacity Front-End Web Developer Nanodegree Project: Neighborhood Map React

## About
The purpose of the project is to develop a single page application featuring a map of our neighborhood or a neighborhood we would like to visit. Built using google-maps-react. We have to add functionality to this map, third-party data about those locations and various ways to browse the content.  
The page will show a Google Map of my neighborhood with many parks address.  
Locations can be chosen by:  
- Clicking on a marker directly  
- Clicking on an item in the list on the left of the screen.  

A box will pop up over the chosen marker with information from the park.  
There is also a pop up with a link about the park provided by FourSquare APIs.  

The user can also search a location by typing the name of the parks in the search bar  
Clicking on the button 'show/hide' will show or hide the list.

## How To Use
1. Clone this repository
  ```bash
  $> git clone https://github.com/Nadiaessou/neighborhood-map-react3
  ```
2. Run the command `npm install` and `npm start`

3. A new browser window open automatically displaying the app. If it doesn't, navigate to [http://localhost:3000/](http://localhost:3000/) in your browser  

4. You can run the build for testing the service worker by using `npm run build` and `npm run deploy`.

## How I have completed this project
- I generated an API key in Google APIs Console : https://console.developers.google.com/  
- I created my React app  
- I used google-maps-react package for loading Google Map  
- I read articles, use Udacity forum and courses, and see tutorials that I have mentioned in 'resources' just below  
- Then I displayed the map on page, add markers, add infowindow, display a list of location, make an event when we click a location in the list, add a search bar by using the package 'escapeRegExp' and 'sortBy', add a toggle button for showing or hiding the list, make all responsive with media queries and set accessibility (ARIA).  
- I created an account in FourSquare and I used this API to provided a link with more information about locations  

## Resources
* React
* Google Maps API
* react-google-maps package
* Foursquare API
* Udacity lessons APIs and React
* https://mapstyle.withgoogle.com//
* https://www.fullstackreact.com/articles/how-to-write-a-google-maps-react-component/
* https://www.npmjs.com/package/google-maps-react
* https://itnext.io/google-maps-react-makes-adding-google-maps-api-to-a-react-app-a-breeze-effb7b89e54
* https://www.youtube.com/watch?v=9t1xxypdkrE
* https://stackoverflow.com/tags/react-google-maps/hot?filter=all
* https://developer.foursquare.com/docs/api/configuration/authentication
* https://discussions.udacity.com/search?q=foursquare%20
