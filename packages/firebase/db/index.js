import { getFirestore } from "firebase/firestore";
import getFbApp from "../app";

export default () => getFirestore(getFbApp());