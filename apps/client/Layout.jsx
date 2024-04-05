import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useFirebase } from "@quick-bite/components/context/Firebase";
const StyledLayout = styled.div`
  .header {
    text-align: center;
    position: sticky;
    z-index: 999;
    top: -10px;
    box-shadow: 0 10px 10px 10px rgba(0,0,0,0.5);
    opacity: 100%;
    background-color: #202b1b;
    
  }
  .img {
    width: 150px;
    height: auto;
    top: 10px;
    margin: 0 auto;
    
  }
  .profile_button {
    padding: 0;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 998;
    background-size: cover;
    background-position: center;
  }
  .profile_button.loggedIn {
    padding: 0;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 998;
    background-size: cover;
    background-position: center;
}
`;

export default ({ children }) => {
    const _firebase = useFirebase();
    const db = _firebase?.db;

    // Starea pentru imaginea utilizatorului și conectare
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userImage, setUserImage] = useState(null);

    // Funcție pentru încărcarea imaginii utilizatorului
    const loadUserImage = () => {
        // Verificați dacă utilizatorul este autentificat și încărcați imaginea corespunzătoare
        // Înlocuiți logica următoare cu încărcarea imaginii utilizatorului din baza de date sau de la serviciul de autentificare
        const user = _firebase?.auth?.currentUser;
        const guestIcon = 'https://firebasestorage.googleapis.com/v0/b/quickbite-844b3.appspot.com/o/user.png?alt=media&token=364d98fb-2720-4fa6-b1e9-2ea9b538280b';
        if (user && user.photoURL) {
            setUserImage(user.photoURL);
        } else {
            setUserImage(guestIcon);
        }
    };
    

    // Funcție pentru gestionarea clicului butonului
    const handleButtonClick = () => {
        // Implementați aici acțiunea butonului
        // De exemplu, puteți deschide o fereastră modală pentru profilul utilizatorului sau pentru autentificare
    };

    // Efect secundar pentru încărcarea imaginii utilizatorului atunci când este conectat
    useEffect(() => {
        loadUserImage();
    }, [isLoggedIn]);

    //const buttonClass = isLoggedIn ? "profile_button loggedIn" : "profile_button";
    //const buttonStyle = isLoggedIn ? { backgroundImage: `url(${userImage})` } : {};
    if (!db)
        return <div>loading...</div>
    return (
        <StyledLayout>
            <div className="header">
              <img src="https://firebasestorage.googleapis.com/v0/b/quickbite-844b3.appspot.com/o/logo_quickbite.png?alt=media&token=356b8ce3-e2e0-4584-a46a-656992a181f3" className="img"></img>
              <button  className={`profile_button ${isLoggedIn ? 'loggedIn' : ''}`}
                    style={{ backgroundImage: isLoggedIn ? `url(${userImage})` : 'url(https://firebasestorage.googleapis.com/v0/b/quickbite-844b3.appspot.com/o/user.png?alt=media&token=364d98fb-2720-4fa6-b1e9-2ea9b538280b)' }} onClick={handleButtonClick}>
              </button>
            </div>
            <div>{children}</div>
        </StyledLayout>
    );
};