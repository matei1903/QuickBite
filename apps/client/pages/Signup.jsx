import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import styled from 'styled-components';

const Align = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
`;

const RegisterWrapper = styled.div`
  box-shadow: 0 0 250px #000;
  text-align: center;
  padding: 4rem 2rem;
`;

const FormField = styled.div`
  margin-bottom: 1rem;
`;

const Input = styled.input`
  border: 0;
  font: inherit;

  &::placeholder {
    color: #7e8ba3;
  }

  &[type="email"],
  &[type="password"] {
    width: 100%;
    outline: 0;
    padding: .5rem 1rem;
  }
`;

const SubmitButton = styled.input`
  background-image: linear-gradient(160deg, #8ceabb 0%, #378f7b 100%);
  border: 0;
  border-radius: 999px;
  color: #fff;
  margin-bottom: 6rem;
  width: 100%;
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
    if (password !== conf_pass)
      alert("Parola confirmata este diferita!");
    try {
      const authResult = await createUserWithEmailAndPassword(auth, email, password);
      await addUserInfoToFirestore(authResult.user.uid, email, authResult.user.photoURL);
      alert("Contul a fost creat cu succes!");
      navigate('/home');
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

        <svg xmlns="http://www.w3.org/2000/svg" className="site__logo" width="56" height="84" viewBox="77.7 214.9 274.7 412"><defs><linearGradient id="a" x1="0%" y1="0%" y2="0%"><stop offset="0%" stopColor="#8ceabb"/><stop offset="100%" stopColor="#378f7b"/></linearGradient></defs><path fill="url(#a)" d="M215 214.9c-83.6 123.5-137.3 200.8-137.3 275.9 0 75.2 61.4 136.1 137.3 136.1s137.3-60.9 137.3-136.1c0-75.1-53.7-152.4-137.3-275.9z"/></svg>

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
