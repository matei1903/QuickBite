import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth();
  const navigate = useNavigate();
  const firestore = getFirestore();

  const handleSignup = async (e) => {
    e.preventDefault();
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

  return (
    <div>
      <h2>Signup</h2>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button onClick={handleSignup}>Signup</button>
        <button onClick={handleGoogleSignup}>Signup with Google</button>
      
    </div>
  );
};

export default Signup;