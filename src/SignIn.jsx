import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
// Fontos: Importáljuk az auth objektumot, amit az App.jsx-ben hoztunk létre!
import { auth } from './App'; 

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Közös stílus a fix szélességű elemeknek
  const commonInputStyle = { width: '400px' };

  const handleLogin = async (e) => {
    e.preventDefault(); // Megakadályozza az oldal újratöltését submitkor
    setError(''); // Töröljük az előző hibaüzenetet

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Ha sikeres, a navigate átirányít a főoldalra (Chat)
      navigate('/'); 
    } catch (err) {
      console.error("Login hiba:", err);
      // Itt finomíthatod a hibaüzeneteket a hiba kódja alapján (err.code)
      setError("Hibás email cím vagy jelszó!");
    }
  };

  return (
    <Box
      component="form" // Formmá alakítjuk, hogy az Enter gomb is működjön
      onSubmit={handleLogin}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
      }}
    >
      <Typography component="div" sx={{ fontSize: '30px' }}>
        Bejelentkezés
      </Typography>

      {/* Hibaüzenet megjelenítése, ha van */}
      {error && (
        <Alert severity="error" sx={commonInputStyle}>
          {error}
        </Alert>
      )}

      <TextField
        id="email"
        label="Email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={commonInputStyle}
      />
      
      <TextField
        id="password"
        label="Jelszó"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={commonInputStyle}
      />

      <Button 
        type="submit" // Fontos: submit típusú legyen, hogy elsüsse a formot
        variant="contained" 
        sx={{ 
          ...commonInputStyle, 
          fontSize: '15px', 
          background: '#4361ee',
          '&:hover': { background: '#3752db' }
        }}
      >
        BEJELENTKEZÉS
      </Button>

      <Box component="span">
        Nincs még fiókod? <Link to="/register">Regisztráció</Link>
      </Box>
    </Box>
  );
}