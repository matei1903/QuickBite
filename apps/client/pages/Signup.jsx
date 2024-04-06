import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useFirestore, collection, addDoc } from 'firebase/firestore';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth();
  const navigate = useNavigate();
  const firestore = useFirestore();

  const handleSignup = (e) => {
    e.preventDefault();
    try {
      const authResult = createUserWithEmailAndPassword(auth, email, password);
      addUserInfoToFirestore(authResult.user.uid, email, authResult.user.photoURL);
      alert("Contul a fost creat cu succes!");
      navigate('/home');
      // Redirect user to dashboard or any other page after signup
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

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Signup</button>
        <button onClick={handleGoogleSignup}>Signup with Google</button>
      </form>
    </div>
  );
};

export default Signup;