import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const authToken = localStorage.getItem('authToken');  
  
  return (
    <Route
      {...rest}
      render={(props) => 
        authToken ? (
          <Component {...props} />  
        ) : (
          <Redirect to="/login" /> 
        )
      }
    />
  );
};

export default ProtectedRoute;
