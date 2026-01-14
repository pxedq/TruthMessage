import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert, Container, Paper, useTheme } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './App';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('A jelszónak legalább 6 karakternek kell lennie!');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: username,
        email: email,
        createdAt: serverTimestamp(),
        photoURL: ""
      });

      navigate('/');
    } catch (err) {
      setError("Hiba történt a regisztráció során! (Lehet, hogy az email már foglalt)");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ height: '90vh', display: 'flex', alignItems: 'center' }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          width: '100%', 
          borderRadius: 4, 
          border: '1px solid', 
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={{ textAlign: 'center', mb: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Fiók létrehozása</Typography>
            <Typography variant="body2" color="text.secondary">Csatlakozz a Truth Message közösséghez</Typography>
          </Box>
          
          {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

          <TextField
            label="Felhasználónév"
            required
            fullWidth
            variant="filled"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{ disableUnderline: true, sx: { borderRadius: 2 } }}
          />
          
          <TextField
            label="Email"
            type="email"
            required
            fullWidth
            variant="filled"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{ disableUnderline: true, sx: { borderRadius: 2 } }}
          />
          
          <TextField
            label="Jelszó"
            type="password"
            required
            fullWidth
            variant="filled"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{ disableUnderline: true, sx: { borderRadius: 2 } }}
          />

          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            sx={{ py: 1.5, textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
          >
            Regisztráció
          </Button>

          <Typography variant="body2" align="center" color="text.secondary">
            Van már fiókod? {' '}
            <Link to="/login" style={{ color: theme.palette.primary.main, textDecoration: 'none', fontWeight: 600 }}>
              Jelentkezz be
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}