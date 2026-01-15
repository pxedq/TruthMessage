import React, { useState } from 'react';
import { 
  Container, Paper, Box, Typography, TextField, Button, Avatar, Alert, Divider, useTheme 
} from '@mui/material';
import { updateProfile, updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from './App';

export default function Profil() {
  const user = auth.currentUser;
  const theme = useTheme();

  // Állapotok
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // 1. Név módosítása (ha változott)
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
        // Frissítés Firestore-ban is
        await updateDoc(doc(db, "users", user.uid), {
          username: displayName
        });
      }

      // 2. Jelszó módosítása (ha írt be valamit)
      if (password) {
        if (password !== confirmPassword) {
          throw new Error("A két jelszó nem egyezik meg!");
        }
        if (password.length < 6) {
          throw new Error("A jelszónak legalább 6 karakternek kell lennie!");
        }
        await updatePassword(user, password);
      }

      setMessage({ type: 'success', text: 'Profil sikeresen frissítve!' });
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      let errorMsg = "Hiba történt a frissítés során!";
      if (error.code === 'auth/requires-recent-login') {
        errorMsg = "A jelszó módosításához jelentkezz be újra!";
      } else if (error.message) {
        errorMsg = error.message;
      }
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 6 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 4, 
          border: '1px solid', 
          borderColor: 'divider',
          textAlign: 'center'
        }}
      >
        {/* Profilkép szekció */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar 
            src={user?.photoURL} 
            sx={{ 
              width: 100, 
              height: 100, 
              mb: 2, 
              fontSize: '2.5rem',
              bgcolor: theme.palette.primary.main,
              boxShadow: '0 8px 24px rgba(67, 97, 238, 0.2)'
            }}
          >
            {displayName?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Profil szerkesztése</Typography>
          <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
        </Box>

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 3, borderRadius: 2 }}>
            {message.text}
          </Alert>
        )}

        <Box component="form" onSubmit={handleUpdate} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Felhasználónév"
            fullWidth
            variant="filled"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            InputProps={{ disableUnderline: true, sx: { borderRadius: 2 } }}
          />

          <Divider sx={{ my: 1 }}>
            <Typography variant="caption" color="text.disabled">Jelszó módosítása (opcionális)</Typography>
          </Divider>

          <TextField
            label="Új jelszó"
            type="password"
            fullWidth
            variant="filled"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{ disableUnderline: true, sx: { borderRadius: 2 } }}
          />

          <TextField
            label="Új jelszó megerősítése"
            type="password"
            fullWidth
            variant="filled"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{ disableUnderline: true, sx: { borderRadius: 2 } }}
          />

          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            disabled={loading}
            sx={{ 
              mt: 1,
              py: 1.5, 
              textTransform: 'none', 
              fontWeight: 600, 
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(67, 97, 238, 0.3)'
            }}
          >
            {loading ? 'Mentés...' : 'Változtatások mentése'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}