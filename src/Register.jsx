import React from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Register() {
  const inputWidthStyle = { width: '400px' };

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
        Regisztráció
      </Typography>

      <TextField
        id="username"
        label="Felhasználónév"
        type="search"
        sx={inputWidthStyle}
      />
      
      <TextField
        id="email"
        label="Email"
        type="search"
        sx={inputWidthStyle}
      />
      
      <TextField
        id="outlined-password-input"
        label="Jelszó"
        type="password"
        autoComplete="current-password"
        sx={inputWidthStyle}
      />

      <Button 
        variant="contained" 
        sx={{ 
          ...inputWidthStyle, 
          fontSize: '15px', 
          background: '#4361ee',
          '&:hover': { background: '#3752db' } // Opcionális: hover effekt
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