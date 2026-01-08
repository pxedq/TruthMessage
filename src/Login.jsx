import React from 'react';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

export default function SignIn() {

  return (
    <div className='login'>
      <div id='loginTitle'>Bejelentkezés</div>

      <TextField
        id="outlined-search"
        label="Email"
        type="search"
        className='loginBaseFormatLength'
      />
      <TextField
        id="outlined-password-input"
        label="Jelszó"
        type="password"
        autoComplete="current-password"
        className='loginBaseFormatLength'
      />

      <Button variant="contained" className='loginBaseFormatLength' sx={{ fontSize:'15px', background:'#4361ee' }}>BEJELENTKEZÉS</Button>

      <span>Nincs még fiókod? <Link to="/register">Regisztráció</Link></span>
    </div>
  )
}