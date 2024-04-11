import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Poppins:400,500,600,700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
  }

  html,body {
    display: grid;
    height: 100%;
    width: 100%;
    place-items: center;
    background: -webkit-linear-gradient(left, #003366, #004080, #0059b3, #0073e6);
  }

  ::selection {
    background: #1a75ff;
    color: #fff;
  }
`;



const Wrapper = styled.div`
  overflow: hidden;
  max-width: 390px;
  background: #fff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0px 15px 20px rgba(0, 0, 0, 0.1);
`;



const TitleText = styled.div`
  display: flex;
  width: 200%;
`;



const SlideControls = styled.div`
  position: relative;
  display: flex;
  height: 50px;
  width: 100%;
  overflow: hidden;
  margin: 30px 0 10px 0;
  justify-content: space-between;
  border: 1px solid lightgrey;
  border-radius: 15px;
`;



const SlideControlLabel = styled.label`
  height: 100%;
  width: 100%;
  color: ${({ checked }) => (checked ? '#fff' : '#000')};
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  line-height: 48px;
  cursor: ${({ checked }) => (checked ? 'default' : 'pointer')};
  z-index: 1;
  transition: all 0.6s ease;
`;


const SliderTab = styled.div`
  position: absolute;
  height: 100%;
  width: 50%;
  left: ${({ checked }) => (checked ? '50%' : '0')};
  z-index: 0;
  border-radius: 15px;
  background: -webkit-linear-gradient(left, #003366, #004080, #0059b3, #0073e6);
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
`;



const FormContainer = styled.div`
  width: 100%;
  overflow: hidden;
`;


const FormInner = styled.div`
  display: flex;
  width: 200%;
`;



const Form = styled.form`
  width: 50%;
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
`;



const Field = styled.div`
  height: 50px;
  width: 100%;
  margin-top: 20px;
`;



const Input = styled.input`
  height: 100%;
  width: 100%;
  outline: none;
  padding-left: 15px;
  border-radius: 15px;
  border: 1px solid lightgrey;
  border-bottom-width: 2px;
  font-size: 17px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #1a75ff;
  }

  &::placeholder {
    color: #999;
    transition: all 0.3s ease;
  }
`;



const PassLink = styled.div`
  margin-top: 5px;
`;



const SignupLink = styled.div`
  text-align: center;
  margin-top: 30px;
`;



const Button = styled.div`
  height: 50px;
  width: 100%;
  border-radius: 15px;
  position: relative;
  overflow: hidden;
`;


const PassLinkAnchor = styled.a`
  color: #1a75ff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;



const SignupLinkAnchor = styled.a`
  color: #1a75ff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;


const BtnLayer = styled.div`
  height: 100%;
  width: 300%;
  position: absolute;
  left: -100%;
  background: -webkit-linear-gradient(right, #003366, #004080, #0059b3, #0073e6);
  border-radius: 15px;
  transition: all 0.4s ease;
`;



const BtnInput = styled.input`
  height: 100%;
  width: 100%;
  z-index: 1;
  position: relative;
  background: none;
  border: none;
  color: #fff;
  padding-left: 0;
  border-radius: 15px;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
`;



const PassLinkWrapper = styled.div`
  margin-top: 5px;
`;



const SignupLinkWrapper = styled.div`
  text-align: center;
  margin-top: 30px;
`;


const BtnWrapper = styled.div`
  height: 50px;
  width: 100%;
  border-radius: 15px;
  position: relative;
  overflow: hidden;
`;


const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-top: 5px;
`;


const SuccessMessage = styled.div`
  color: green;
  font-size: 14px;
  margin-top: 5px;
`;


const GoogleSignupButton = styled.button`
  height: 50px;
  width: 100%;
  border-radius: 15px;
  background-color: #db4437;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #c1351d;
  }
`;


const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [conf_pass, setConf_pass] = useState('');
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
  //<button onClick={handleGoogleSignup}>Signup with Google</button>
  //<button onClick={handleSignup}>Signup</button>
  //<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
  // <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
  return (
    <Wrapper class="wrapper">
      <TitleText class="title-text">
        <TitleText class="title login">Login Form</TitleText>
        <TitleText class="title signup">Signup Form</TitleText>
      </TitleText>
      <FormContainer class="form-container">
        <SlideControls class="slide-controls">
          <Input type="radio" name="slide" id="login" checked>
          </Input>
          <Input type="radio" name="slide" id="signup">
          </Input>
          <SliderTab class="slider-tab">
            <SlideControlLabel for="login" class="slide login">Login</SlideControlLabel>
          </SliderTab>
          <SliderTab>
            <SlideControlLabel for="signup" class="slide signup">Signup</SlideControlLabel>
          </SliderTab>
        </SlideControls>
        <FormInner class="form-inner">
          <Form action="#" class="login">
            <Field class="field">
              <Input type="text" placeholder="Email Address" required />
            </Field>
            <Field class="field">
              <Input type="password" placeholder="Password" required />
            </Field>
            <PassLink class="pass-link"><PassLinkAnchor href="#">Forgot password?</PassLinkAnchor></PassLink>
            <BtnWrapper class="field btn">
              <BtnLayer class="btn-layer">
                <BtnInput type="submit" value="Login" />
              </BtnLayer>
            </BtnWrapper>
            <SignupLink class="signup-link">Not a member? <SignupLinkAnchor href="">Signup now</SignupLinkAnchor></SignupLink>
          </Form>
          <Form action="#" class="signup">
            <Field class="field">
              <Input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required />
            </Field>
            <Field class="field">
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            </Field>
            <Field class="field">
              <Input type="password" value={conf_pass} onChange={(e) => setConf_pass(e.target.value)} placeholder="Confirm password" required />
            </Field>
            <BtnWrapper class="field btn">
              <BtnLayer class="btn-layer">
                <BtnInput type="submit" onClick={handleSignup} value="Signup" />
              </BtnLayer>
            </BtnWrapper>
            <Button onClick={handleGoogleSignup}>Signup with Google</Button>
          </Form>
        </FormInner>
      </FormContainer>
    </Wrapper>
  );
};

export default Signup;
