import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './App';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const inputWidthStyle = { width: '400px' };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Egyszerű validáció
    if (password.length < 6) {
      setError('A jelszónak legalább 6 karakternek kell lennie!');
      return;
    }

    try {
      // 1. Felhasználó létrehozása az Auth szolgáltatásban
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. A felhasználó "Display Name" beállítása (hogy lássuk a nevét a chatben)
      await updateProfile(user, {
        displayName: username,
      });

      // 3. Felhasználó adatainak mentése a Firestore 'users' gyűjteménybe
      // Ez kell ahhoz, hogy később kilistázhassuk a többi felhasználót
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: username,
        email: email,
        createdAt: new Date()
      });

      // 4. Ha minden sikerült, irány a főoldal
      navigate('/');
      
    } catch (err) {
      console.error("Regisztrációs hiba:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Ez az email cím már regisztrálva van!");
      } else {
        setError("Hiba történt a regisztráció során: " + err.message);
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleRegister}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
      }}
    >
      <Typography component="div" sx={{ fontSize: '30px' }}>
        Regisztráció
      </Typography>

      {/* Hibaüzenet */}
      {error && (
        <Alert severity="error" sx={inputWidthStyle}>
          {error}
        </Alert>
      )}

      <TextField
        id="username"
        label="Felhasználónév"
        type="text"
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={inputWidthStyle}
      />
      
      <TextField
        id="email"
        label="Email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={inputWidthStyle}
      />
      
      <TextField
        id="password"
        label="Jelszó"
        type="password"
        autoComplete="new-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={inputWidthStyle}
      />

      <Button 
        type="submit"
        variant="contained" 
        sx={{ 
          ...inputWidthStyle, 
          fontSize: '15px', 
          background: '#4361ee',
          '&:hover': { background: '#3752db' } 
        }}
      >
        REGISZTRÁCIÓ
      </Button>

      <Box component="span">
        Már van fiókod? <Link to="/login">Bejelentkezés</Link>
      </Box>
    </Box>
  );
}