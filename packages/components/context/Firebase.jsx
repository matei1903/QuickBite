import React, { createContext, useContext, useState } from "react";

import getAuth from "@quick-bite/firebase/auth";
import getDb from "@quick-bite/firebase/db";
import getStorage from "@quick-bite/firebase/storage";
const FirebaseContext = createContext(undefined);
export const FirebaseProvider = ({ children }) => {
    const [auth] = useState(getAuth());
    const [db] = useState(getDb());
    const [storage] = useState(getStorage());
    return (
        <FirebaseContext.Provider value={{ db, auth, storage }}>
            {children}
        </FirebaseContext.Provider>
    );
};

export const useFirebase = () => useContext(FirebaseContext);