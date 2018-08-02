import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
            infowindow: new this.props.google.maps.InfoWindow()
        }
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
            let lat = 48.7763046;
            let lng = 2.334603300000026;
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
        let {infowindow} = this.state
        const bounds = new google.maps.LatLngBounds();

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
            bounds.extend(marker.position)
        })
        this.map.fitBounds(bounds)
    }

    /************************* 
    Control infowindow
    *************************/
    openInfoWindow = (marker, infowindow) => {
        if (infowindow.marker !== marker) {
            infowindow.marker = marker;
            infowindow.setContent(
                `<h4>${marker.title}</h4>
                <img src="${marker.img}" alt="${marker.title}">
                <p>${marker.address}</p>`
            );
            infowindow.open(this.map, marker);
            marker.setAnimation(window.google.maps.Animation.BOUNCE);
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


  render() {

    const {markers} = this.state
    /************************* 
    Display the app on page
    *************************/
    return (
      <div google={this.props.google}>
          <div className="container">
                   
              <h1>Parks to visit in my neighborhood</h1>

              <input className="search" role="search" type="text" placeholder="Search..." />
                   
              <ul className="list">
              {markers.map((getLoc, i) => <li key={i}>{getLoc.title}</li>)}
              </ul>

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