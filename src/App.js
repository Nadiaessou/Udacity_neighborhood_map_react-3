import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';
import { GoogleApiWrapper } from 'google-maps-react';
import { locations } from './data/locations';
import { mapStyle } from './data/mapStyle';
import './index.css';

class App extends Component {

/************************* 
Constructor
*************************/
    constructor(props) {
      super(props);
      this.state = {
            locations : locations,
            query: '',
            markers: [],
            buttonShowHide: true,
            infowindow: new this.props.google.maps.InfoWindow()
        }
        this.toggleShowHide = this.toggleShowHide.bind(this);
    }




    /************************* 
    Load Map (https://www.fullstackreact.com/articles/how-to-write-a-google-maps-react-component/)
    *************************/
    componentDidMount() {
        this.loadMap()
        this.onClickLocation ()
    }

    loadMap() {
        if (this.props && this.props.google) {

            const {google} = this.props
            const maps = google.maps

            const mapRef = this.refs.map
            const node = ReactDOM.findDOMNode(mapRef);

            let zoom = 12;
            let lat = 48.7993046;
            let lng = 2.333603300000026;
            const center = new maps.LatLng(lat, lng);

            const mapConfig = Object.assign({}, {
                center: center,
                zoom: zoom,
                styles: mapStyle,
            })

            this.map = new maps.Map(node, mapConfig);
            this.addMarkers();
        }
    }




    /************************* 
    Add markers
    *************************/
    addMarkers = () => {
        const {google} = this.props
        const {infowindow} = this.state

        this.state.locations.forEach((loc) => {
            const marker = new google.maps.Marker({
                map: this.map,
                position: {lat: loc.location.lat,lng: loc.location.lng},
                icon: './map-marker.png',
                title: loc.title,
                img: loc.img,
                address: loc.address,
                animation: window.google.maps.Animation.DROP,
            });
            marker.addListener('click', () => {
                this.openInfoWindow(marker, infowindow);
            })
            this.setState((state) => ({
                markers: [...state.markers, marker]
            }))
        })
    }




    /************************* 
    Control infowindow
    *************************/
    openInfoWindow = (marker, infowindow) => {
            const {google} = this.props
            
        if (infowindow.marker !== marker) {

            const description =
            `<div aria-label="marker info" tabIndex="1">
            <h4>${marker.title}</h4>
            <img src="${marker.img}" alt="${marker.title}">
            <p>${marker.address}</p>
            </div>`

            infowindow.setContent(description);
            infowindow.open(this.map, marker);
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(() => {
                marker.setAnimation(null);
            }, 1000);
            this.MarkerInfos(marker);
        } 
        google.maps.event.addListener(infowindow,'closeclick', () => {
            document.querySelector(".foursquareInfo").innerHTML = '';
        })  
    }




    /***********************************************************************
    FOURSQUARE (https://developer.foursquare.com/docs/api/configuration/authentication
    and https://discussions.udacity.com/search?q=foursquare%20)
    ***********************************************************************/
    MarkerInfos(marker) {
        const apiURL = 'https://api.foursquare.com/v2/venues/';
        const client_id = "R1HTROMSXLTPXEDVMUCVFS3LNMIHXVTQ4QDN1JOPXADYTT5R";
        const client_secret = "1LBOYE2OKD04WRPKLT1EMV0SOUMOEQYBTVVKO5SKQZQE2B4X";
        const url = apiURL + "search?client_id=" + client_id + "&client_secret=" + client_secret + "&v=20160801&ll=" + marker.position.lat() + "," + marker.position.lng() + "&limit=1";

        fetch(url)
            .then(response => {
                    if (response.status !== 200) {
                        document.querySelector(".foursquareInfo").innerHTML = "Sorry informations about this park can't be loaded";
                    } else{
                    response.json().then(data => {
                        const dataLoc = data.response.venues[0];
                        const informations = '<a href="https://foursquare.com/v/' + dataLoc.id + '" target="_blank">More about ' + marker.title + ' on Foursquare</a>'
                        document.querySelector(".foursquareInfo").innerHTML = informations;
                    }).catch(() => {
                   document.querySelector(".foursquareInfo").innerHTML = "Sorry, Foursquare data doesn't load";
                });
                }
            })
    }



    /************************* 
    Display location when we click on list (https://www.youtube.com/watch?v=9t1xxypdkrE)
    *************************/
    onClickLocation = () => {
        const that = this
        const {infowindow} = this.state

        const displayInfowindow = (e) => {
        const {markers} = this.state
        const markerInd = markers.findIndex(m => m.title.toLowerCase() === e.target.innerText.toLowerCase())
        that.openInfoWindow(markers[markerInd], infowindow)
        }
        document.querySelector('.list').addEventListener('click', (e) => {
            if(e.target && e.target.nodeName === "LI") {
                displayInfowindow(e)
            }
        })
    }




    /************************* 
    Search bar
    *************************/
    updateQuery =(query) => {
        this.setState({query: query})
    }




    /************************* 
    SHOW/HIDE
    *************************/
    toggleShowHide() {
        this.setState({
            buttonShowHide: !this.state.buttonShowHide
        });
    }






/****************************************************************************************************************** 
******************************************************************************************************************/

  render() {



    /************************* 
    Make search on the search bar (FEND Nanodegree => Lesson 2 Concept 7 : Controlled Components)
    *************************/
    let showLocations

    if (this.state.query){
        const match = new RegExp(escapeRegExp(this.state.query),'i')
        showLocations = locations.filter((location) => match.test(location.title))
    } else{ 
        showLocations = locations 
    }
    showLocations.sort(sortBy('name'))



    /************************* 
    Display the app on page
    *************************/
    return (
      <div>
          <div className="container">
                   
              <h1 aria-label="title" tabIndex="1">Parks to visit in my neighborhood</h1>

              <input className="search" role="search" type="text" placeholder="Search..." value={this.state.query} onChange={(event)=> this.updateQuery(event.target.value)} aria-label="search location" tabIndex="1" />
                   
              <ul className="list" aria-label="list of locations" tabIndex="1">
              {showLocations.map((getLoc, i) => (
              <li key={i} aria-label={getLoc.title} tabIndex="1">{this.state.buttonShowHide && getLoc.title}</li>
              ))}
              </ul>
              
              <button className="showHide" onClick={this.toggleShowHide} aria-label="show hide button" tabIndex="1">Show/Hide</button>
          </div>

          <div className="foursquare">
                <img src="./images/logo-foursquare.png" alt="logo foursquare" className="logo-f" />
                <p className="foursquareInfo" aria-label="foursquare infos" tabIndex="1"></p>
          </div>
                
          <div  ref="map" role="application" tabIndex="-1" className="map" google={this.props.google}>
          Loading Map...
          </div>
      </div>
    );
  }
}



/************************* 
Load Google Map (https://www.npmjs.com/package/google-maps-react)
*************************/
export default GoogleApiWrapper({
    apiKey: ('AIzaSyBKtzAZYGTw6jOWG73rIwuxGtTgZeure1U')
})(App)



/************************* 
ERROR ALERT
*************************/
document.addEventListener("DOMContentLoaded", (e) => {
  const script = document.getElementsByTagName('script').item(1);
  script.onerror = (e) => {
    document.querySelector("#root").innerHTML = 
    "<div class='box'><p>Google Maps has failed to load.<br /> Please check your internet connection and <span onclick={window.location.reload()}>reload the page</span>.</p><img src='./images/broken.png' alt='Maps error'></div><div class='maperror'></div>";
  }
});
