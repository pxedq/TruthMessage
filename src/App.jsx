import { useState, useEffect } from 'react';

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "/firebaseConfig.js";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './App.css';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Home from './Home';
import About from './About';
import Notfound from './Notfound';


export default function App() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  const router = createBrowserRouter([
    { path: "/", element: <SignIn /> },
    { path: "/signup", element: <SignUp /> },
    { path: "/home", element: <Home /> },
    { path: "/about", element: <About /> },
    { path: "*", element: <Notfound /> }
  ]);

  const [user, setUser] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return unsubscribe;
  }, []);

  return (
    <div className='app'>
      <RouterProvider router={router} />
    </div>
  )
}
