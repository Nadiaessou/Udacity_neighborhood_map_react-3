import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { GoogleApiWrapper } from 'google-maps-react';
import { locations } from './data/locations';
import { mapStyle } from './data/mapStyle';
import './index.css';

class App extends Component {

    /************************* 
    Load Map
    *************************/
    componentDidMount() {
        this.loadMap()
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
            this.map = new maps.Map(node, mapConfig)
        }
    }

  render() {
    /************************* 
    Display the app on the page
    *************************/
    return (
      <div google={this.props.google}>
          <div className="container">
                   
              <h1>Parks to visit in my neighborhood</h1>

              <input className="search" role="search" type="texte" placeholder="Search..." />
                   
              <ul className="list">
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
Load Google Map
*************************/
export default GoogleApiWrapper({
    apiKey: ('AIzaSyA9rKFjC26zoyv2Rr7pD8BNaIx-PmDtJh0')
})(App)
