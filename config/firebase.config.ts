import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCzRfKnE2b5G-326vgp6g9eOdF3WXn-vtk",
    authDomain: "shape-mobileapp.firebaseapp.com",
    projectId: "shape-mobileapp",
    storageBucket: "shape-mobileapp.appspot.com",
    messagingSenderId: "1018060502805",
    appId: "1:1018060502805:web:1fcbbcfd638e2f7c809b1c",
    measurementId: "G-719F1L6K48",
};

const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const storage = getStorage(app);
export const audioRef = ref(storage, 'audio');