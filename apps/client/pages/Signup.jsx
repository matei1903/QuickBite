import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import styled from 'styled-components';

const Align = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-image: url("https://firebasestorage.googleapis.com/v0/b/quickbite-844b3.appspot.com/o/360_F_637166455_RZOHg6K3M6noLPKQmOHH5ZI70zXEyDaq.jpg?alt=media&token=af02128c-0b80-4fdc-af73-ae565a3c3cbd");
  background-color: rgba(255, 255, 255, 0.5); /* Opacitatea de 0.3 (70%) */
  background-blend-mode: lighten;
  background-size: cover;
`;

const RegisterWrapper = styled.div`
  text-align: center;
  padding: 80px;
  padding-top: 30px;
  width: 50%;
  margin: 0 auto;
  background-color: #202b1b;
`;

const FormField = styled.div`
  margin-bottom: 1rem;
  border-radius: 25px;
  text-align: center;
  justify-content: center;
`;

const Input = styled.input`
  border: 0;
  font: inherit;
  padding: 0.5rem;
  width: 90%;
  border-radius: 25px;
  text-align: center;
  justify-content: center;

  &::placeholder {
    color: #7e8ba3;
    text-align: center;
  }

  &[type="email"],
  &[type="password"] {
   
    outline: 0;
    
  }
`;

const Img = styled.img`
  margin-top: 20px;
  width: 250px;
  height: auto;
  margin-left: auto;
  mergin-right: auto;
  }
  `;

const SubmitButton = styled.input`
  background: linear-gradient(160deg, #8ceabb 0%, #378f7b 100%);
  border: 0;
  border-radius: 999px; /* Am eliminat spațiul în jurul operatorului - */
  color: #fff;
  margin-bottom: 10px;
  margin-top: 30px; /* Am eliminat spațiul în jurul operatorului - */
  width: 100%;
  font-size: 20px; /* Am eliminat spațiul în jurul operatorului - */
  padding: 5px 5px; /* Am eliminat spațiul în jurul operatorului - */
`;

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [conf_pass, setConf_pass] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();
  const firestore = getFirestore();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const authResult = await createUserWithEmailAndPassword(auth, email, password);
      const user = authResult.user
      const comenzi = [];
      const plata = 0;
      localStorage.setItem('userID', await addUserInfoToFirestore(user.uid, user.email, user.photoURL, comenzi, plata));
      if (password != conf_pass)
        alert("Parola confirmata este diferita!");
      else {
        alert("Contul a fost creat cu succes!");
        navigate('/home');
      }

    } catch (error) {
      console.error(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const comenzi = [];
      const plata = 0;
      localStorage.setItem('userID', await addUserInfoToFirestore(user.uid, user.email, user.photoURL, comenzi, plata));
      alert("Autentificare cu Google reușită!");
      navigate('/home');
    } catch (error) {
      console.error(error.message);
    }
  };

  const addUserInfoToFirestore = async (userId, userEmail, userPhotoURL, comenzi, plata) => {
    try {
      const docRef = await addDoc(collection(firestore, 'users'), {
        userId: userId,
        email: userEmail,
        photoURL: userPhotoURL,
        comenzi: comenzi,
        plata: plata
        // puteți adăuga și alte informații despre utilizator aici
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding user info to Firestore:", error);
    }
  };

  const handleSlide = () => {
    setShowLoginForm(!showLoginForm);
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <Align>
      <div className="grid align__item">
        <RegisterWrapper>
          <Img src="https://firebasestorage.googleapis.com/v0/b/quickbite-844b3.appspot.com/o/logo_quickbite.png?alt=media&token=356b8ce3-e2e0-4584-a46a-656992a181f3" className="site_logo"></Img>

          <h2>Înregistrează-te</h2>

          <form action="" method="post" className="form">

            <FormField>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" required />
            </FormField>

            <FormField>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="parola" required />
            </FormField>

            <FormField>
              <Input type="password" value={conf_pass} onChange={(e) => setConf_pass(e.target.value)} placeholder="confirmare parola" required />
            </FormField>

            <FormField>
              <SubmitButton type="submit" onClick={handleSignup} value="Înregistrează-te" />
              <SubmitButton type="submit" onClick={handleGoogleSignup} value="Înregistrează-te cu Google" />
            </FormField>

          </form>

          <p>Deja ai un cont? <a href="#" onClick={navigateToLogin}>Autentifică-te</a></p>

        </RegisterWrapper>
      </div>
    </Align>
  );
};

export default Signup;
