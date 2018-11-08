import firebase from './firebase'

import { v4 } from 'uuid'

const db = firebase.firestore();


export const fireUpload = (fileData) => {

  return new Promise((resolve, reject) => {

    var storageRef = firebase
      .storage()
      .ref();

    var uploadTask = storageRef
      .child(`images/${v4()}-partner-photo.jpg`)
      .putString(fileData, 'data_url');

    uploadTask.on('state_changed', (snapshot) => {

      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, (error) => {

    }, () => {

      uploadTask
        .snapshot
        .ref
        .getDownloadURL()
        .then((downloadURL) => {

          console.log('File available at', downloadURL);

          resolve({
            downloadURL
          })

        })

    });
  });

}