import React from "react";
import { Navigate,Outlet } from "react-router-dom";

const PrivateCo = ()=>{
    const auth = localStorage.getItem('user');
    return auth ?<Outlet/>:<Navigate to='/'/>
}
export default PrivateCo;