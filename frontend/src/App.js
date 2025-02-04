// import React, { useState } from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import Login from "./components/login";
// import Home from './components/adminPage';
// import Private from './components/pc';

// const App = () => {
//   const token = localStorage.getItem('token');

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={token ? <Login /> : <Navigate to="/home" />} />

//         <Route element={<Private />}>
//           <Route path="/home" element={<Home />} />
//         </Route>
        
//         <Route path="/" element={<Login/>} />

//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;


import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";
import Home from "./components/adminPage";
import PrivateRoute from "./protectRoute/pc";

const App = () => {

  
  const token = localStorage.getItem('token');
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route - Redirect to home if logged in */}
        <Route path="/" element={token ? <Navigate to="/home" /> : <Login />} />

        {/* Private Route - Only accessible if logged in */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
        </Route>

        {/* Catch-all route - Redirects invalid URLs to login */}
        <Route path="*" element={<Navigate to={token ? "/home" : "/"} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
