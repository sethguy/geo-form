import React, { Component } from 'react';

import { withGoogleMap, withScriptjs, GoogleMap, Marker } from "react-google-maps"

import { MySearchBox } from './MySearchBox.js'

import { firebase } from './firebase'

import _ from 'lodash'

const MapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBI9O72qcsHB1fdvQHADtlPiyazGYy18WI&v=3.exp&libraries=geometry,drawing,places"

const MyMapComponent = withScriptjs(withGoogleMap(function(props) {

  return (
    <GoogleMap onBoundsChanged={ props.onBoundsChanged } ref={ props.onMapMounted } defaultZoom={ 12 } defaultCenter={ props.geo }>
      <MySearchBox {...props} />
      { props.isMarkerShown && <Marker position={ props.geo } /> }
      { props.locationMarker && <Marker position={ props.locationMarker } /> }
    </GoogleMap>
  )

}))

const refs = {}

class MapForm extends Component {

  constructor(props) {

    super(props);

    this.state = {
      props
    };

    this.getGeo()
  }

  onBoundsChanged() {

    this.setState({
      bounds: refs.map.getBounds(),
      center: refs.map.getCenter(),
    })
  }

  onMapMounted(map) {

    refs.map = map

  }

  onSearchBoxMounted(ref) {
    refs.searchBox = ref;
  }

  onPlacesChanged() {

    console.log('onPlacesChanged')

    const places = refs.searchBox.getPlaces();
    var bounds = refs.map.getBounds();
    places.forEach(place => {

      console.log('onPlacesChanged', place)

      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport)
      } else {
        bounds.extend(place.geometry.location)
      }
    });
    const nextMarkers = places.map(place => ({
      position: place.geometry.location,
    }));
    const nextCenter = _.get(nextMarkers, '0.position', this.state.center);
    console.log(nextMarkers)
    this.setState({
      center: nextCenter,
      markers: nextMarkers,
      locationMarker: nextMarkers[0].position
    })

    var place = places[0]
    this.showDataOptions(place)

    refs.map.fitBounds(bounds);
  }

  showDataOptions(place) {

    var {types, opening_hours, geometry} = place
    var business = {

      name: place.name,
      address: place.formatted_address,
      phone: place.formatted_phone_number,

    }

    if (opening_hours && opening_hours.weekday_text) {

      business.weekday_text = opening_hours.weekday_text

      business.hours = business.weekday_text.reduce((hours, text) => {

        return `${hours}
        ${text}`

      }, "")

    }

    if (geometry && geometry.location) {

      business.geoPoint = {
        "type": "Point",
        "coordinates": [geometry.location.lng(), geometry.location.lat()]
      }
    }

    var updateMsg = {
      business,
      types
    }

    this.props.onChange(updateMsg)

  }

  getGeo() {
    const mapForm = this;
    navigator.geolocation.getCurrentPosition((geo) => {
      console.log('geo', geo)
      this.setState({
        geo: {
          lat: geo.coords.latitude,
          lng: geo.coords.longitude
        }
      })
    })
  }

  render() {
    var props = this.state.props
    return (
      <div className='h-100 w-100'>
        { this.state.geo ?
          <MyMapComponent
                          bounds={ this.state.bounds }
                          onSearchBoxMounted={ (event) => this.onSearchBoxMounted(event) }
                          onMapMounted={ (event) => this.onMapMounted(event) }
                          geo={ this.state.geo }
                          onBoundsChanged={ (event) => this.onBoundsChanged(event) }
                          onPlacesChanged={ (event) => this.onPlacesChanged(event) }
                          geo={ this.state.geo }
                          locationMarker={ this.state.locationMarker }
                          isMarkerShown
                          googleMapURL={ MapsUrl }
                          loadingElement={ <div style={ { height: `100%` } } /> }
                          containerElement={ <div style={ { height: `100%` } } /> }
                          mapElement={ <div style={ { height: `100%` } } /> } /> :
          <div>
            no coordinatess
          </div> }
      </div>
      );
  }

}

export default MapForm;