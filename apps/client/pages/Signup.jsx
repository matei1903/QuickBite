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
  background-image: url("https://firebasestorage.googleapis.com/v0/b/quickbite-844b3.appspot.com/o/360_F_637166455_RZOHg6K3M6noLPKQmOHH5ZI70zXEyDaq.jpg?alt=media&token=af02128c-0b80-4fdc-af73-ae565a3c3cbd");
  background-color: rgba(255, 255, 255, 0.7); /* Opacitatea de 0.3 (70%) */
  background-blend-mode: lighten;
  background-size: cover;
`;

const RegisterWrapper = styled.div`
  box-shadow: 0 0 250px #000;
  text-align: center;
  padding: 50px;
  width: 50%;
  margin: 0 auto;
  background-color: #202b1b;
`;

const FormField = styled.div`
  margin-bottom: 1rem;
  border-radius: 25px;
`;

const Input = styled.input`
  border: 0;
  font: inherit;
  padding: 0.5rem;
  width: 50%;
  border-radius: 25px;

  &::placeholder {
    color: #7e8ba3;
  }

  &[type="email"],
  &[type="password"] {
   
    outline: 0;
    
  }
`;

const Img = styled.img`
  width: max;
  height: 50%;

  .site_logo {
    width: max;
    height: max;
  }
  `;

const SubmitButton = styled.input`
background: linear-gradient(160deg, #8ceabb 0%, #378f7b 100 %);
border: 0;
border - radius: 999px;
color: #fff;
margin - bottom: 6rem;
width: 100 %;
font - size: 24px;
padding: 5px 5px;
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
      await addUserInfoToFirestore(authResult.user.uid, email, authResult.user.photoURL);
      if (password !== conf_pass)
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
      await addUserInfoToFirestore(user.uid, user.email, user.photoURL);
      alert("Autentificare cu Google reușită!");
      navigate('/home');
    } catch (error) {
      console.error(error.message);
    }
  };

  const addUserInfoToFirestore = async (userId, userEmail, userPhotoURL) => {
    try {
      await addDoc(collection(firestore, 'users'), {
        userId: userId,
        email: userEmail,
        photoURL: userPhotoURL
        // puteți adăuga și alte informații despre utilizator aici
      });
    } catch (error) {
      console.error("Error adding user info to Firestore:", error);
    }
  };

  const handleSlide = () => {
    setShowLoginForm(!showLoginForm);
  };


  return (
    <Align>
      <div className="grid align__item">
        <RegisterWrapper>
          <Img src="https://firebasestorage.googleapis.com/v0/b/quickbite-844b3.appspot.com/o/logo_quickbite.png?alt=media&token=356b8ce3-e2e0-4584-a46a-656992a181f3" className="site_logo"></Img>

          <h2>Sign Up</h2>

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
              <SubmitButton type="submit" onClick={handleSignup} value="Sign Up" />
              <SubmitButton type="submit" onClick={handleGoogleSignup} value="Sign Up with Google" />
            </FormField>

          </form>

          <p>Already have an account? <a href="#">Log in</a></p>

        </RegisterWrapper>
      </div>
    </Align>
  );
};

export default Signup;
