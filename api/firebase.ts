import { auth, storage } from "@/config/firebase.config";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as FileSystem from "expo-file-system";

export const Login = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            return userCredential;
        })
        .catch((error) => {
            throw error;
        });
};

export const Register = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            return userCredential;
        })
        .catch((error) => {
            throw error;
        });
};

export const Logout = async () => {
    return signOut(auth)
        .then(() => {
            return;
        })
        .catch((error) => {
            throw error;
        });
};

export const UploadAudio = async ({ name, uri }: any) => {
    try {
        const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        const response = await fetch(`data:audio/m4a;base64,${base64}`);
        const blob = await response.blob();
        const storageRef = ref(storage, name);
        const snapshot = await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading audio:', error);
        throw error;
    }
};

export const UploadImage = async ({ name, uri }: any) => {
    try {
        const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        const response = await fetch(`data:image/jpg;base64,${base64}`);
        const blob = await response.blob();
        const storageRef = ref(storage, name);
        const snapshot = await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log("Download URL:", downloadURL);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}