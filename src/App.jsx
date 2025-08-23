import React, { useState,useEffect } from 'react';
import { useDispatch } from 'react-redux';
import authService from './appwrite/auth.js';
import { login, logout } from './store/authSlice';
import {Header} from './components';
import {Footer} from './components';
import { Outlet } from 'react-router-dom';
import './index.css'

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      })
      .catch((error) => {
        console.error("Error fetching current user:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return !loading ? (
    <div className="min-h-screen flex flex-wrap justify-between bg-gray-400">
      <div className='w-full block'>
        <Header/>
        <main>
          <Outlet/>
        </main>
        <Footer/>
      </div>
    </div>
  ) : (
    <div className="loading">Loading...</div>
  );
}

export default App
