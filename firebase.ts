import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyACPYFSPXsS1m3pe_rVcnX0kMDGxH86sxE",
    authDomain: "xclone-e3b7e.firebaseapp.com",
    projectId: "xclone-e3b7e",
    storageBucket: "xclone-e3b7e.appspot.com",
    messagingSenderId: "539881447750",
    appId: "1:539881447750:web:4c5806c5e68d889d6e8547"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);