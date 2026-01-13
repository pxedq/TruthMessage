import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseConfig } from "../firebaseConfig.js"; // Feltételezzük, hogy ez létezik

import SignIn from './SignIn';
import Register from './Register';
import Chat from './Chat';

// Ideiglenes komponensek a hiányzó route-okhoz (hogy működjön a kód) !!!!!!!!!!!!!!!!!!!!!!!!!!! MAJD MEG IRNI
const Users = () => <div style={{textAlign:'center', marginTop:'50px'}}><h1>Felhasználók</h1><p>Itt kezelheted a felhasználókat.</p></div>;

// --- FIREBASE INICIALIZÁLÁS ---
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// --- APP KOMPONENS ---
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Hogy ne villanjon be a Login, amíg betöltünk

  // Felhasználó állapotának figyelése (Login / Logout detektálása)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Betöltés kész
    });
    return () => unsubscribe(); // Cleanup
  }, []);

  // Kijelentkezés funkció
  const handleLogout = async () => {
    await signOut(auth);
  };

  // Védett útvonal komponens (Protected Route)
  // Ha nincs user, visszadob a loginra
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  if (loading) {
    return <div style={{display:'flex', justifyContent:'center', marginTop:'20%'}}>Betöltés...</div>;
  }

  return (
    <BrowserRouter>
      {/* Egyszerű navigációs sáv, csak ha be vagyunk lépve */}
      {user && (
        <nav style={{ padding: '10px', background: '#eee', display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <Link to="/">Chat</Link>
          <Link to="/users">Felhasználók</Link>
          <button onClick={handleLogout} style={{cursor:'pointer', marginLeft:'20px'}}>Kijelentkezés</button>
          <span style={{marginLeft: 'auto'}}>Belépve: {user.email}</span>
        </nav>
      )}

      <Routes>
        {/* 1. Route: Bejelentkezés */}
        <Route path="/login" element={!user ? <SignIn /> : <Navigate to="/" />} />

        {/* 2. Route: Regisztráció */}
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

        {/* 3. Route: Chat (Főoldal) - VÉDETT */}
        <Route path="/" element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        } />

        {/* 4. Route: Felhasználók kezelése - VÉDETT */}
        <Route path="/users" element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;