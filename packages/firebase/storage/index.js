import { getStorage } from "firebase/storage";
import getApp from "../app";

export default () => getStorage(getApp());