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
        } else {
            console.log("Error! Google Maps has failed to load.");
        }
    }


    /************************* 
    Add markers
    *************************/
    addMarkers = () => {
        const {google} = this.props
        const {infowindow} = this.state

        this.state.locations.forEach((location) => {
            const marker = new google.maps.Marker({
                map: this.map,
                position: {lat: location.location.lat,lng: location.location.lng},
                icon: './map-marker.png',
                title: location.title,
                img: location.img,
                address: location.address,
                animation: window.google.maps.Animation.DROP,
            });
            marker.addListener('click', () => {
                this.openInfoWindow(marker, infowindow)
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
            `<h4>${marker.title}</h4>
            <img src="${marker.img}" alt="${marker.title}">
            <p>${marker.address}</p>`

            infowindow.setContent(description);
            infowindow.open(this.map, marker);
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 1000);
        }
    }


    /************************* 
    Display location when we click on list (https://www.youtube.com/watch?v=9t1xxypdkrE)
    *************************/
    onClickLocation = () => {
        const that = this
        const {infowindow} = this.state

        const displayInfowindow = (e) => {
        const {markers} = this.state
        const markerInd = markers.findIndex(m => m.title === e.target.innerText)
        that.openInfoWindow(markers[markerInd], infowindow)
        }
        document.querySelector('.list').addEventListener('click', function (e) {
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


/********************************************************* 
*********************************************************/

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
      <div google={this.props.google}>
          <div className="container">
                   
              <h1>Parks to visit in my neighborhood</h1>

              <input className="search" role="search" type="text" placeholder="Search..." value={this.state.query} onChange={(event)=> this.updateQuery(event.target.value)} />
                   
              <ul className="list">
              {showLocations.map((getLoc, i) => (
              <li key={i}>{this.state.buttonShowHide && getLoc.title}</li>
              ))}
              </ul>
              
              <button className="showHide" onClick={this.toggleShowHide}>Show/Hide</button>
          </div>
                
          <div  ref="map" role="application" className="map">
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
    apiKey: ('AIzaSyA9rKFjC26zoyv2Rr7pD8BNaIx-PmDtJh0')
})(App)
