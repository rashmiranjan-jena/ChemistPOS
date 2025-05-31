import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <h1 className="display-1 text-warning">🚧</h1>
      <h3 className="mb-3">Work in Progress</h3>
      <p className="text-muted">
        This page is currently under construction. Please check back later.
      </p>
      <button
        onClick={() => navigate("/dashboard")}
        className="btn btn-primary"
      >
        Go to Home
      </button>
    </div>
  );
};

export default ErrorPage;
