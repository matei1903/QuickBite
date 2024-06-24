import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
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
  width: 60%;
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

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Dacă autentificarea este reușită, navighează către pagina de start
      navigate('/home');
    } catch (error) {
      // Gestionează erorile de autentificare
      console.error(error);
      alert("Eroare la autentificare. Verifică adresa de email și parola și încearcă din nou.");
    }
  };

const navigateToSignup = () => {
    navigate('/');
  };

  return (
    <Align>
      <div className="grid align__item">
        <RegisterWrapper>
          <Img src="https://firebasestorage.googleapis.com/v0/b/quickbite-844b3.appspot.com/o/logo_quickbite.png?alt=media&token=356b8ce3-e2e0-4584-a46a-656992a181f3" className="site_logo"></Img>

          <h2>Autentifică-te</h2>

          <form action="" method="post" className="form">

            <FormField>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" required />
            </FormField>

            <FormField>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="parola" required />
            </FormField>

            <FormField>
              <SubmitButton type="submit" onClick={handleLogin} value="Sign In" />
            </FormField>

          </form>

          <p>Nu ai un cont? <a href="#" onClick={navigateToSignup}>Înregistrează-te</a></p>

        </RegisterWrapper>
      </div>
    </Align>
  );
};

export default Login;