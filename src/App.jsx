import { initializeApp } from "firebase/app";
import { firebaseConfig } from "/firebaseConfig.js";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './App.css';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import About from './About';
import Notfound from './Notfound';

export default function App() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/about", element: <About /> },
    { path: "*", element: <Notfound /> }
  ]);

  return (
    <div className='app'>
      <RouterProvider router={router} />
    </div>
  )
}