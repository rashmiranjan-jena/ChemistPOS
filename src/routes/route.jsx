// src/routes/route.js
import React from "react";
import { Navigate } from "react-router-dom";

const Authmiddleware = ({ children }) => {
  const authToken = localStorage.getItem("authToken");  

  
  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Authmiddleware;
