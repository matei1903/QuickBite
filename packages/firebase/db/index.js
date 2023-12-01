import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import getApp from '../app';
let db = null;
export default () => {
    if (db)
        return db;
    const app = getApp();
    db = getFirestore(app);
    return db;
}