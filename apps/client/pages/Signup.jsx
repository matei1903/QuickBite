import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import styled from "styled-components";

const StyledSignup = styled.StyledSignup`
@import url('https://fonts.googleapis.com/css?family=Poppins:400,500,600,700&display=swap');
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}
html,body{
  display: grid;
  height: 100%;
  width: 100%;
  place-items: center;
  background: -webkit-linear-gradient(left, #003366,#004080,#0059b3
, #0073e6);
}
::selection{
  background: #1a75ff;
  color: #fff;
}
.wrapper{
  overflow: hidden;
  max-width: 390px;
  background: #fff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0px 15px 20px rgba(0,0,0,0.1);
}
.wrapper .title-text{
  display: flex;
  width: 200%;
}
.wrapper .title{
  width: 50%;
  font-size: 35px;
  font-weight: 600;
  text-align: center;
  transition: all 0.6s cubic-bezier(0.68,-0.55,0.265,1.55);
}
.wrapper .slide-controls{
  position: relative;
  display: flex;
  height: 50px;
  width: 100%;
  overflow: hidden;
  margin: 30px 0 10px 0;
  justify-content: space-between;
  border: 1px solid lightgrey;
  border-radius: 15px;
}
.slide-controls .slide{
  height: 100%;
  width: 100%;
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  line-height: 48px;
  cursor: pointer;
  z-index: 1;
  transition: all 0.6s ease;
}
.slide-controls label.signup{
  color: #000;
}
.slide-controls .slider-tab{
  position: absolute;
  height: 100%;
  width: 50%;
  left: 0;
  z-index: 0;
  border-radius: 15px;
  background: -webkit-linear-gradient(left,#003366,#004080,#0059b3
, #0073e6);
  transition: all 0.6s cubic-bezier(0.68,-0.55,0.265,1.55);
}
input[type="radio"]{
  display: none;
}
#signup:checked ~ .slider-tab{
  left: 50%;
}
#signup:checked ~ label.signup{
  color: #fff;
  cursor: default;
  user-select: none;
}
#signup:checked ~ label.login{
  color: #000;
}
#login:checked ~ label.signup{
  color: #000;
}
#login:checked ~ label.login{
  cursor: default;
  user-select: none;
}
.wrapper .form-container{
  width: 100%;
  overflow: hidden;
}
.form-container .form-inner{
  display: flex;
  width: 200%;
}
.form-container .form-inner form{
  width: 50%;
  transition: all 0.6s cubic-bezier(0.68,-0.55,0.265,1.55);
}
.form-inner form .field{
  height: 50px;
  width: 100%;
  margin-top: 20px;
}
.form-inner form .field input{
  height: 100%;
  width: 100%;
  outline: none;
  padding-left: 15px;
  border-radius: 15px;
  border: 1px solid lightgrey;
  border-bottom-width: 2px;
  font-size: 17px;
  transition: all 0.3s ease;
}
.form-inner form .field input:focus{
  border-color: #1a75ff;
  /* box-shadow: inset 0 0 3px #fb6aae; */
}
.form-inner form .field input::placeholder{
  color: #999;
  transition: all 0.3s ease;
}
form .field input:focus::placeholder{
  color: #1a75ff;
}
.form-inner form .pass-link{
  margin-top: 5px;
}
.form-inner form .signup-link{
  text-align: center;
  margin-top: 30px;
}
.form-inner form .pass-link a,
.form-inner form .signup-link a{
  color: #1a75ff;
  text-decoration: none;
}
.form-inner form .pass-link a:hover,
.form-inner form .signup-link a:hover{
  text-decoration: underline;
}
form .btn{
  height: 50px;
  width: 100%;
  border-radius: 15px;
  position: relative;
  overflow: hidden;
}
form .btn .btn-layer{
  height: 100%;
  width: 300%;
  position: absolute;
  left: -100%;
  background: -webkit-linear-gradient(right,#003366,#004080,#0059b3
, #0073e6);
  border-radius: 15px;
  transition: all 0.4s ease;;
}
form .btn:hover .btn-layer{
  left: 0;
}
form .btn input[type="submit"]{
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
}
`

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
    <StyledSignup class="wrapper">
      <StyledSignup class="title-text">
        <StyledSignup class="title login">Login Form</StyledSignup>
        <StyledSignup class="title signup">Signup Form</StyledSignup>
      </StyledSignup>
      <StyledSignup class="form-container">
        <StyledSignup class="slide-controls">
          <input type="radio" name="slide" id="login" checked>
          </input>
          <input type="radio" name="slide" id="signup">
          </input>
          <label for="login" class="slide login">Login</label>
          <label for="signup" class="slide signup">Signup</label>
          <StyledSignup class="slider-tab"></StyledSignup>
        </StyledSignup>
        <StyledSignup class="form-inner">
          <form action="#" class="login">
            <StyledSignup class="field">
              <input type="text" placeholder="Email Address" required />
            </StyledSignup>
            <StyledSignup class="field">
              <input type="password" placeholder="Password" required />
            </StyledSignup>
            <StyledSignup class="pass-link"><a href="#">Forgot password?</a></StyledSignup>
            <StyledSignup class="field btn">
              <StyledSignup class="btn-layer"></StyledSignup>
              <input type="submit" value="Login" />
            </StyledSignup>
            <StyledSignup class="signup-link">Not a member? <a href="">Signup now</a></StyledSignup>
          </form>
          <form action="#" class="signup">
            <StyledSignup class="field">
              <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required />
            </StyledSignup>
            <StyledSignup class="field">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            </StyledSignup>
            <StyledSignup class="field">
              <input type="password" value={conf_pass} onChange={(e) => setConf_pass(e.target.value)} placeholder="Confirm password" required />
            </StyledSignup>
            <StyledSignup class="field btn">
              <StyledSignup class="btn-layer"></StyledSignup>
              <input type="submit" onClick={handleSignup} value="Signup" />
              <button onClick={handleGoogleSignup}>Signup with Google</button>
            </StyledSignup>
          </form>
        </StyledSignup>
      </StyledSignup>
    </StyledSignup>

  );
};

export default Signup;