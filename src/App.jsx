import { useState } from 'react';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "/firebaseConfig.js";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './App.css'

export default function App() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  const router = createBrowserRouter([
    { path: "/", element: <SignIn /> },
    { path: "/", element: <SignUp /> },
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
