import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert, Container, Paper, useTheme } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './App'; 

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); 
    } catch (err) {
      setError("Hibás email cím vagy jelszó!");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={0} sx={{ p: 4, width: '100%', borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
        <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Typography variant="h5" align="center" sx={{ fontWeight: 700, mb: 1 }}>
            Üdv újra!
          </Typography>
          
          {error && <Alert severity="error">{error}</Alert>}

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
            Bejelentkezés
          </Button>

          <Typography variant="body2" align="center" color="text.secondary">
            Nincs még fiókod? {' '}
            <Link to="/register" style={{ color: theme.palette.primary.main, textDecoration: 'none', fontWeight: 600 }}>
              Regisztrálj
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}