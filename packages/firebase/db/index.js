import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import "firebase/firestore";
import getApp from '../app';
let db = null;
export default () => {
    console.log("hello");
    if (db)
        return db;
    const app = getApp();
    console.log("starting");
    db = getFirestore(app);
    console.log("ending");
    return db;
    
}