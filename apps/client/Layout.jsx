import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useFirebase } from "@quick-bite/components/context/Firebase";
import { useNavigate } from 'react-router-dom';
const StyledLayout = styled.div`
  .header {
    text-align: center;
    position: sticky;
    z-index: 998;
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
  `;
const Menu = styled.nav`
  position: absolute;
  top: 70px; /* Ajustează în funcție de înălțimea butonului */
  right: 10px;
  background-color: #212121;
  padding: 10px;
  border-radius: 5px;
  border: 2px solid white;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  transition: all 300ms ease;
`;

const MenuItem = styled.div`
  margin-bottom: 10px;

  .button { 
    background-color: white;
    color: black;
    border-radius: 10em;
    font-size: 15px;
    font-weight: 600;
    padding: 8px;
    width: 120px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    border: 1px solid black;
    box-shadow: 0 0 0 0 black;
  }
`;

const ProfileButton = ({ children }) => {
  const _firebase = useFirebase();
  const db = _firebase?.db;
  const [userImageURL, setUserImageURL] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [plata, setPlata] = useState(null);
  // Starea pentru imaginea utilizatorului și conectare
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const user = _firebase?.auth?.currentUser;
  // Funcție pentru încărcarea imaginii utilizatorului
  const loadUserImage = () => {
    // Verificați dacă utilizatorul este autentificat și încărcați imaginea corespunzătoare
    // Înlocuiți logica următoare cu încărcarea imaginii utilizatorului din baza de date sau de la serviciul de autentificare
    
    const guestIcon = 'https://firebasestorage.googleapis.com/v0/b/quickbite-844b3.appspot.com/o/user.png?alt=media&token=364d98fb-2720-4fa6-b1e9-2ea9b538280b';
    if (user && user.photoURL) {
      setUserImage(user.photoURL);
      console.log("User image set to:", user.photoURL);
    } else {
      setUserImage(guestIcon);
      console.log("User image set to default icon");
    }
  };

  const handleComenzileMele = () => {
    navigate('/comenzi');
  }
  // Funcție pentru gestionarea clicului butonului
  const handleButtonClick = () => {
    setIsMenuOpen(!isMenuOpen);
    // Implementați aici acțiunea butonului
    // De exemplu, puteți deschide o fereastră modală pentru profilul utilizatorului sau pentru autentificare
  };
  const handleSignOut = () => {
    _firebase.auth.signOut().then(() => {
      console.log("User signed out successfully.");
      navigate('/login');
      // Poți face orice alte acțiuni aici, cum ar fi redirecționarea către pagina de autentificare.
    }).catch((error) => {
      console.error("Error signing out:", error);
    });
  };
  // Efect secundar pentru încărcarea imaginii utilizatorului atunci când este conectat
  useEffect(() => {
    console.log("Calling loadUserImage()...");
    loadUserImage();
  }, [isLoggedIn]);

  useEffect(() => {
    // Recuperarea variabilei 'plata' din localStorage la încărcarea componentei
    const storedPlata = localStorage.getItem('plata');
    console.log("storedPlata:", storedPlata);
    if (storedPlata) {
      // Convertirea valorii recuperate într-un număr și actualizarea stării 'plata'
      setPlata(parseFloat(storedPlata));
    }
    const handlePlataUpdate = () => {
      const updatedPlata = localStorage.getItem('plata');
      if (updatedPlata) {
        setPlata(parseFloat(updatedPlata));
      }
    };

    window.addEventListener('plataUpdated', handlePlataUpdate);

    // Curăță efectul secundar pentru a evita memory leaks
    return () => {
      window.removeEventListener('plataUpdated', handlePlataUpdate);
    };
  }, []);
  useEffect(() => {
    // Actualizează 'storedPlata' în localStorage când valoarea 'plata' este schimbată
    if (plata !== null) {
      localStorage.setItem('plata', plata.toString());
    }
  }, [plata]);
  //const buttonClass = isLoggedIn ? "profile_button loggedIn" : "profile_button";
  //const buttonStyle = isLoggedIn ? { backgroundImage: `url(${userImage})` } : {};
  if (!db)
    return <div>loading...</div>
  return (
    <StyledLayout>
      <div className="header">
        <img src="https://firebasestorage.googleapis.com/v0/b/quickbite-844b3.appspot.com/o/logo_quickbite.png?alt=media&token=356b8ce3-e2e0-4584-a46a-656992a181f3" className="img"></img>
        <button className={`profile_button ${isLoggedIn ? 'loggedIn' : ''}`}
          style={{ backgroundImage: `url(${userImage})` }}
          onClick={handleButtonClick}>
        </button>
      </div>
      <Menu isOpen={isMenuOpen}>
        <MenuItem>
          <button className="button" onClick={handleComenzileMele}>Comenzile mele</button>
        </MenuItem>
        <MenuItem>
          <label htmlFor="search">Total de plata: {user.plata} RON</label>
        </MenuItem>
        <MenuItem>
          <button className="button" onClick={handleSignOut}>Delogare</button>
        </MenuItem>
      </Menu>
      <div>{children}</div>
    </StyledLayout>
  );
};
export default ProfileButton;