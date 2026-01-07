import React from 'react';
import { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';

export default function SignIn() {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loginError, setLoginError] = useState(false);
  let [errorText, setErrorText] = useState("");

  return (
    <div className='login'>
      <div id='loginTitle'>Sign in</div>

      <TextField
        id="outlined-search"
        label="Email"
        type="search"
        className='loginBaseFormatLength'
      />
      <TextField
        id="outlined-password-input"
        label="Password"
        type="password"
        autoComplete="current-password"
        className='loginBaseFormatLength'
      />

      <Button variant="contained" className='loginBaseFormatLength' sx={{ fontSize:'15px', background:'#4361ee' }}>Sign IN</Button>

      <p>OR</p>

      <span>Doesn't have an account? Sign up</span>
    </div>
  )
}
