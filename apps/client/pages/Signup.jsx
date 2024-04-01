import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { withRouter } from 'react-router-dom';


const Signup = ({history}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth();
  const handleSignup = (e) => {
    e.preventDefault();
    try {
      createUserWithEmailAndPassword(auth, email, password);
      alert("Contul a fost creat cu succes!");
      history.push('/home');
      // Redirect user to dashboard or any other page after signup
    } catch (error) {
      console.error(error.message);
    }
  };


  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default withRouter(Signup);