
import React, { Component } from 'react';
import { render } from 'react-dom';

import MapForm from './MapForm'

import firebase from './firebase'

import Dropzone from 'react-dropzone'

import { fireUpload } from './fireUpload'
import { v4 } from 'uuid'

var db = firebase.firestore();

const FormPut = (props) => {
  return <div className="row d-flex align-items-center m-3">
           <div className='col-sm-2 d-flex justify-content-center'>
             <span>{ props.label }</span>
           </div>
           <div className='col-sm-10'>
             <input onChange={ (e) => props.onChange(props, e) } value={ props.value } className="form-control" />
           </div>
         </div>
}

const FormTextArea = (props) => {
  return <div className="row d-flex align-items-center m-3">
           <div className='col-sm-2 d-flex justify-content-center'>
             <span>{ props.label }</span>
           </div>
           <div className='col-sm-10'>
             <textarea resizeable={ true } onChange={ (e) => props.onChange(props, e) } value={ props.value } className="form-control" />
           </div>
         </div>
}

const FeildSwitch = (props) => {
  switch (props.type) {
    case "textArea":
      return <FormTextArea {...props} />;
    default:
      return <FormPut {...props} />;
  }
}

const FeildList = (props) => props.list.map((feild) => <FeildSwitch key={ feild.feildKey } {...{ ...feild, ...props }} />)

class App extends Component {
  constructor() {
    super();
    this.state = {
      feildList: [
        {
          label: 'Name',
          feildKey: 'name',
          value: ''
        },
        {
          label: 'Phone',
          feildKey: 'phone',
          value: ''
        },
        {
          label: 'Address',
          feildKey: 'address',
          value: '',
          type: 'textArea',

        },
        {
          label: 'State',
          feildKey: 'state',
          value: ''
        },
        {
          label: 'Email',
          feildKey: 'email',
          value: ''
        },
        {
          label: 'Description',
          feildKey: 'description',
          value: '',
          type: 'textArea'
        },
        {
          label: 'Workchew Hours',
          feildKey: 'workChewHours',
          type: 'textArea',

          value: ''
        },
        {
          label: 'Website',
          feildKey: 'website',
          value: ''
        },
        {
          label: 'Hours',
          feildKey: 'hours',
          value: '',
          type: 'textArea'
        },
      ]
    }
  }

  onChange = (props, event) => {
    var {feildKey, list} = props;
    const updatedList = list.map(item => {
      if (item.feildKey === feildKey) {
        return {
          ...item,
          value: event.target.value
        }
      }
      return item;
    })
    this.setState({
      feildList: updatedList
    })
  }

  onMapUpdate = (update) => {

    console.log({
      update
    })

    const listUpdate = this.state.feildList.map((feild) => {
      return {
        ...feild,
        value: update.business[feild.feildKey] ? update.business[feild.feildKey] : ''
      }
    })

    this.setState({
      feildList: listUpdate,
      businessData: update.business,
    })
  }

  onDrop = (fileEvent) => {


    var [file] = fileEvent.target.files

    var reader = new FileReader();

    reader.addEventListener("load", () => {

      this.setState({
        previewfiles: [

          {
            file,
            preview: reader.result
          }
        ]
      });

    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }


  }

  uploadPhoto = () => {
    var [file] = this.state.previewfiles

    fireUpload(file.preview)

      .then((res) => {

        console.log('res', res)

this.setState({
  newPartnerPhoto: res.downloadURL
})
      })

  }

  clearPreview = () => {
    this.setState({
      previewfiles: []
    });

  }

  saveBusinessForm = () => {

    const businessState = this.state.feildList

      .reduce((businessState, feild) => {
        return {
          ...businessState,
          [feild.feildKey]: feild.value,
        }
      }, {})

    var {businessData, newPartnerPhoto} = this.state;

    console.log({
      businessState,
      businessData
    })

    var partnerUpdate = {
      ...businessData,
      ...businessState,

    }

    if (newPartnerPhoto && newPartnerPhoto.length) {

      partnerUpdate.photoUrl = newPartnerPhoto

    }

    db.collection('partners').add(partnerUpdate)
      .then((data) => {
        console.log({
          data
        })
        window.location.reload()
      })
  }

  render() {

    var {previewfiles} = this.state;

    return (
      <div className="w-100">
        <div className="m-3" />
        <div className="h-50 w-100">
          <MapForm onChange={ this.onMapUpdate } />
        </div>
        <div className="row">
          <div className="col-md-6">
            <FeildList {...{ list: this.state.feildList, onChange: this.onChange }} />
          </div>
          <div className="col-md-6">
            <br/>
            <input type="file" onChange={ this.onDrop } />
            { previewfiles && previewfiles.map((file) => <img key={ v4() } style={ { height: 200, width: 200, } } src={ file.preview } />) }
            <br/>
            { previewfiles &&
              <div>
                <button className="btn btn-primary m-3" onClick={ this.uploadPhoto }>
                  upload
                </button>
                <button className="btn btn-warning m-3" onClick={ this.clearPreview }>
                  clear
                </button>
              </div> }
          </div>
        </div>
        <button className="btn btn-info m-3" onClick={ this.saveBusinessForm }>
          save
        </button>
        <div className="m-3" />
      </div>
      );
  }
}

render(<App />, document.getElementById('map-form'));
