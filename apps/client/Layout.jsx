import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useFirebase } from "@quick-bite/components/context/Firebase";
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
  .menubtn{
    cursor: pointer;
    width: 40px;
    height: 40px;
    right: 0;
    top: 10px;
    position: absolute;
  }
  .menubtn span{
    display: block;
    width: 30px;
    height: 3px;
    position: absolute;
    background: #fff;
    -webkit-transition: all 300ms ease;
    transition: all 300ms ease;
  
   
    &::before{
      content:'';
      width: 30px;
      height: 3px;
      position: absolute;
      top: 8px;
      background: #fff;
     -webkit-transition: all 100ms ease;
      transition: all 100ms ease;
    }
    &::after{
      content:'';
      width: 30px;
      height: 3px;
      position: absolute;
      top: 16px;
      background: #fff;
      -webkit-transition: all 300ms ease;
      transition: all 300ms ease;
    }
   
   
  }
  
     .menubtn.opened span{
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
      top: 7px;
    
      &::before{
        opacity:0;
      }
       
      &::after{
        -webkit-transform: rotate(-90deg);
        transform: rotate(-90deg);
        top: 0px;
              
      }
       
       
    }
  .navmenu {
    width: 240px;
    margin-top: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
    background: rgba(255, 255, 255, 0.85); /* Modificare a transparenței folosind rgba */
    text-align: center;
    position: absolute;
    right: 10px;
    top: 25px;
    box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.15); /* Modificare a transparenței folosind rgba */
    z-index: 9999;
    visibility: hidden;
    opacity: 0;
    transition: all 300ms ease;
}

.navmenu.opened {
    visibility: visible;
    opacity: 1;
    z-index: 9999;
}

.navmenu::before {
    content: '';
    position: absolute;
    top: -5px;
    right: 7px;
    width: 15px;
    height: 15px;
    background: #fff;
    transform: rotate(45deg);
}
    ul{
      list-style: none;
      margin: 0;
      padding: 0;
      z-index: 9999;
    }
    
    ul.text-list{
      text-align: left;
      width: 90%;
      margin: auto;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      padding-top: 10px;
      padding-bottom: 10px;
      z-index: 9999;
      
      li{
        a{
          text-decoration: none;
          padding-left: 5px;
          padding-right: 5px;
          color: #343434;
          font-weight: 600;
          display: block;
          line-height: 27px;
          -webkit-transition: all 200ms ease;
          transition: all 200ms ease;
          z-index: 9999;
          
          &:hover{
            color: tomato;
          }
        }
      }
      
    }
`;

const ProfileButton = ({ children }) => {
    const _firebase = useFirebase();
    const db = _firebase?.db;
    const [userImageURL, setUserImageURL] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
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
            console.log("User image set to:", user.photoURL);
        } else {
            setUserImage(guestIcon);
            console.log("User image set to default icon");
        }
    };
    

    // Funcție pentru gestionarea clicului butonului
    const handleButtonClick = () => {
      setIsMenuOpen(!isMenuOpen);
        // Implementați aici acțiunea butonului
        // De exemplu, puteți deschide o fereastră modală pentru profilul utilizatorului sau pentru autentificare
    };

    // Efect secundar pentru încărcarea imaginii utilizatorului atunci când este conectat
    useEffect(() => {
        console.log("Calling loadUserImage()...");
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
              <button className={`profile_button ${isLoggedIn ? 'loggedIn' : ''}`}
                      style={{ backgroundImage: `url(${userImage})` }}
                      onClick={handleButtonClick}>
              </button>
            </div>
            {isMenuOpen && (
                <nav className="navmenu">
                    <ul className="text-list">
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Gallery</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </nav>
            )}
            <div>{children}</div>
        </StyledLayout>
    );
};
export default ProfileButton;