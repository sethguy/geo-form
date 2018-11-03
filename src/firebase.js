import firebase from "firebase";

// See firebase setup in above google firebase documentation url
export const config = {
  apiKey: "AIzaSyDrql8_CPnvotXoTT4PxINVK46_p9yXG1w",
  authDomain: "work-chew-forms.firebaseapp.com",
  databaseURL: "https://work-chew-forms.firebaseio.com",
  projectId: "work-chew-forms",
  storageBucket: "work-chew-forms.appspot.com",
  messagingSenderId: "480936302656"
};

firebase.initializeApp(config);
const firestore = firebase.firestore();
const settings = {
  timestampsInSnapshots: true
};
firestore.settings(settings);
export default firebase;