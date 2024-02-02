import { initializeApp, getApps, getApp } from "firebase/app";

export default () =>
    getApps().length
        ? getApp()
        : initializeApp({
            apiKey: "AIzaSyDsHaokB4PIq_Z_JryaCi0l3FmIqJRsdo8",
            authDomain: "quickbite-844b3.firebaseapp.com",
            projectId: "quickbite-844b3",
            storageBucket: "quickbite-844b3.appspot.com",
            messagingSenderId: "505376164695",
            appId: "1:505376164695:web:90c1c6e648efa5b7410c12"
        });