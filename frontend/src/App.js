import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./components/login";
import Home from './components/data';
import AdminDashboard from './components/adminPage';
import Header from './components/Header';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/admin" element={<AdminDashboard/>} />
        <Route path="/header" element={<Header/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
