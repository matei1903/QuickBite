import {createContext, useContext, useEffect, useState} from 'react';
import {Firestore} from 'firebase/firestore';
import getDb from '@quick-bite/firebase/db';


const FirebaseContext = createContext(undefined);

export const FirebaseProvider = ({children}) => {
    
    const [db] = useState(getDb());
  
    return <FirebaseContext.Provider value={{db}}>{children}</FirebaseContext.Provider>;
  };
  export const useFirebase = () => useContext(FirebaseContext);