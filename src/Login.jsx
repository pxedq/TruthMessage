import React from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function SignIn() {
  const commonInputStyle = { width: '400px' };

  return (
    <Box
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
      <Typography 
        component="div" 
        sx={{ fontSize: '30px' }}
      >
        Bejelentkezés
      </Typography>

      <TextField
        id="outlined-search"
        label="Email"
        type="search"
        sx={commonInputStyle}
      />
      
      <TextField
        id="outlined-password-input"
        label="Jelszó"
        type="password"
        autoComplete="current-password"
        sx={commonInputStyle}
      />

      <Button 
        variant="contained" 
        sx={{ 
          ...commonInputStyle, 
          fontSize: '15px', 
          background: '#4361ee' 
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