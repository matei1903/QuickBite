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
`;

const RegisterWrapper = styled.div`
  box-shadow: 0 0 250px #000;
  text-align: center;
  padding: 4rem 2rem;
  width: 100%;
  margin: 0 auto;
`;

const FormField = styled.div`
  margin-bottom: 1rem;
`;

const Input = styled.input`
  border: 0;
  font: inherit;
  padding: 0.5rem;
  width: 100%

  &::placeholder {
    color: #7e8ba3;
  }

  &[type="email"],
  &[type="password"] {
   
    outline: 0;
    
  }
`;

const Img = styled.img`
  width: 10%;
  height: 10%;

  .site_logo {
    width:200px;
    height:200px;
  }
  `;

const SubmitButton = styled.input`
background: linear - gradient(160deg, #8ceabb 0 %, #378f7b 100 %);
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
