import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, Button, Box, Container, 
  IconButton, Tooltip, createTheme, ThemeProvider, CssBaseline 
} from '@mui/material';

// Ikonok
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Dark mód ikon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Light mód ikon

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseConfig } from "../firebaseConfig.js";

import Profil from './Profil';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import SignIn from './SignIn';
import Register from './Register';
import Chat from './Chat';
import Users from './Users';
import NotFound from './Notfound.jsx';

// Firebase inicializálás
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Dark mode állapota (alapértelmezett a mentett vagy a light)
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Téma létrehozása
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: '#4361ee' },
      background: {
        default: mode === 'light' ? '#f8f9fa' : '#0a0a0c',
        paper: mode === 'light' ? '#ffffff' : '#121214',
      },
    },
    shape: { borderRadius: 12 },
    typography: { fontFamily: 'Inter, system-ui, sans-serif' }
  }), [mode]);

  const toggleColorMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const handleLogout = () => signOut(auth);

  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  if (loading) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Ez állítja be a globális háttérszínt */}
      <BrowserRouter>
        {user && (
          <AppBar 
            position="sticky" 
            elevation={0} 
            sx={{ 
              bgcolor: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(18, 18, 20, 0.8)', 
              backdropFilter: 'blur(8px)', 
              borderBottom: '1px solid',
              borderColor: 'divider',
              color: 'text.primary' 
            }}
          >
            <Container maxWidth="md">
              <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button component={Link} to="/" startIcon={<ForumRoundedIcon />} sx={{ textTransform: 'none', fontWeight: 600 }}>
                    Chat
                  </Button>
                  <Button component={Link} to="/users" startIcon={<PeopleAltRoundedIcon />} sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}>
                    Felhasználók
                  </Button>
                  <Button 
                    component={Link} 
                    to="/profile" 
                    startIcon={<AccountCircleRoundedIcon />}
                    sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
                  >
                    Profil
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {/* Dark Mode Kapcsoló */}
                  <Tooltip title={mode === 'dark' ? "Világos mód" : "Sötét mód"}>
                    <IconButton onClick={toggleColorMode} color="inherit">
                      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                  </Tooltip>

                  <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, color: 'text.secondary', mx: 1 }}>
                    {user.email}
                  </Typography>
                  
                  <Tooltip title="Kijelentkezés">
                    <IconButton onClick={handleLogout} sx={{ color: '#ff4d4f' }}>
                      <LogoutRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Toolbar>
            </Container>
          </AppBar>
        )}

        <Routes>
          <Route path="/login" element={!user ? <SignIn /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;