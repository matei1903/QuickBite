import { getAuth } from "firebase/auth";
import getApp from "../app";

export default () => getAuth(getApp());