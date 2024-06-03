import { auth } from "@/config/firebase.config";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from "firebase/auth";

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