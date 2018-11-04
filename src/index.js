
import React, { Component } from 'react';
import { render } from 'react-dom';

import MapForm from './MapForm'

import firebase from './firebase'

var db = firebase.firestore();


const FormPut = (props) => {
  return <div className="row d-flex align-items-center w-50 m-3">
           <div className='col-sm-2 d-flex justify-content-center'>
             <span>{ props.label }</span>
           </div>
           <div className='col-sm-10'>
             <input onChange={ (e) => props.onChange(props, e) } value={ props.value } className="form-control" />
           </div>
         </div>
}

const FormTextArea = (props) => {
  return <div className="row d-flex align-items-center w-50 m-3">
           <div className='col-sm-2 d-flex justify-content-center'>
             <span>{ props.label }</span>
           </div>
           <div className='col-sm-10'>
             <textarea onChange={ (e) => props.onChange(props, e) } value={ props.value } className="form-control" />
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
          value: ''
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

  saveBusinessForm = () => {

    const businessState = this.state.feildList.reduce((businessState, feild) => {
      return {
        ...businessState,
        [feild.feildKey]: feild.value
      }
    }, {})

    var {businessData} = this.state;

    console.log({
      businessState,
      businessData
    })

    db.collection('partners').add({
      ...businessData,

      ...businessState,
    })
      .then((data) => {
        console.log({
          data
        })
        window.location.reload()
      })
  }

  render() {
    return (

      <div className="w-100">
        <div className="m-3" />
        <div className="h-50 w-100">
          <MapForm onChange={ this.onMapUpdate } />
        </div>
        <FeildList {...{ list: this.state.feildList, onChange: this.onChange }} />
        <button className="btn btn-info m-3" onClick={ this.saveBusinessForm }>
          save
        </button>
        <div className="m-3" />
      </div>

      );
  }
}

render(<App />, document.getElementById('map-form'));
