import React from 'react';
const {SearchBox} = require("react-google-maps/lib/components/places/SearchBox");
const searchInpuStyle = {
  boxSizing: `border-box`,
  border: `1px solid transparent`,
  width: `340px`,
  height: `32px`,
  marginTop: `8px`,
  padding: `0 12px`,
  borderRadius: `3px`,
  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
  fontSize: `14px`,
  outline: `none`,
  textOverflow: `ellipses`,


}
const MySearchBox = (props) => (

  <SearchBox onPlacesChanged={ props.onPlacesChanged } ref={ props.onSearchBoxMounted } bounds={ props.bounds } controlPosition={ 1 } onPlacesChanged={ props.onPlacesChanged }>
    <input type="text" placeholder="Customized your placeholder" style={ searchInpuStyle } />
  </SearchBox>

)

export { MySearchBox }