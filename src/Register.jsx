import React from 'react';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

export default function Register() {

  return (
    <div className='login'>
      <div id='loginTitle'>Regisztáció</div>

      <TextField
        id="outlined-search"
        label="Felhasználónév"
        type="search"
        className='loginBaseFormatLength'
      />
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

      <Button variant="contained" className='loginBaseFormatLength' sx={{ fontSize:'15px', background:'#4361ee' }}>REGISZTÁCIÓ</Button>

      <span>Már van fiókod? <Link to="/login" >Bejelentkezés</Link></span>
    </div>
  )
}