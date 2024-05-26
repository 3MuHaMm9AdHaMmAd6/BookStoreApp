// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD9zDM7WUnZYjHrppIgpwHfrOqmUXIr5L0",
  authDomain: "madquiz02-e3683.firebaseapp.com",
  projectId: "madquiz02-e3683",
  storageBucket: "madquiz02-e3683.appspot.com",
  messagingSenderId: "135332944882",
  appId: "1:135332944882:web:a831a30adcfa41d7d5696b",
  measurementId: "G-KWHHH2L85L"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// export const auth = getAuth(firebaseApp);
export const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// change the rules of Storage as follows:

// service firebase.storage {
//   match /b/{bucket}/o {
//     match /{allPaths=**} {
//       allow read, write: if true;
//     }
//   }
// }

export const storage = getStorage(firebaseApp);
