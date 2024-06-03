// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCzRfKnE2b5G-326vgp6g9eOdF3WXn-vtk",
    authDomain: "shape-mobileapp.firebaseapp.com",
    projectId: "shape-mobileapp",
    storageBucket: "shape-mobileapp.appspot.com",
    messagingSenderId: "1018060502805",
    appId: "1:1018060502805:web:1fcbbcfd638e2f7c809b1c",
    measurementId: "G-719F1L6K48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
