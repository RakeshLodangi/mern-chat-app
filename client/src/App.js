import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import Chat from './pages/Chat';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';

import { setAuthToken } from './utils/api';
import { useAuth } from './context/AuthContext';

import './Chat.css';


function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user?.token) {
      setAuthToken(user.token)
    }
  }, [user]);

  useEffect(() => {
    if (user && (location.pathname === '/login' )) {
      navigate('/chats');
    }
  }, [user, location, navigate]);

  return (
    <div className="App">
      <Navbar user={user} onLogout={ logout }/>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
              path="/chats" 
              element={user ? <Chat /> : <Navigate to="/login" />} 
          />
          <Route 
              path="/" 
              element={<Navigate to={user ? "/chats" : "/login"} />}
          />
        </Routes>
      
    </div>
  );
}

export default App;
