import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyB36fFVN188I1gRcLnO82U4z0bJ6RG3Dog",
  authDomain: "sitelog-da47d.firebaseapp.com",
  projectId: "sitelog-da47d",
  storageBucket: "sitelog-da47d.firebasestorage.app",
  messagingSenderId: "722919147642",
  appId: "1:722919147642:web:b95596899cf9fc4c6a13c3",
  measurementId: "G-F5ZQ0YE3FK"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);