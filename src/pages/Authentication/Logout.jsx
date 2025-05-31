import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { logoutUser } from "../../ApiService/Logout/Logout";

const styles = `
  .spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #f8f9fa;
  }

  .custom-spinner {
    width: 3rem;
    height: 3rem;
    border: 4px solid #5a67d8;
    border-top: 4px solid transparent;
    border-radius: 50%;
    animation: spin-alternate 1.5s linear infinite;
  }

  @keyframes spin-alternate {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(360deg);
    }
    51% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
`;

const Logout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLogout = async () => {
      setLoading(true);
      const refreshToken = localStorage.getItem("refreshToken");

      try {
        if (refreshToken) {
          const response = await logoutUser(refreshToken);

          if (response) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("refreshToken");
            Swal.fire({
              icon: "success",
              title: "Logged Out!",
              text: "You have been successfully logged out.",
              showConfirmButton: false,
              timer: 2000,
            });

            setTimeout(() => {
              navigate("/login");
            }, 2000);
          } else {
            navigate("/login");
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    handleLogout();
  }, [navigate]);

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="spinner-container">
          <div className="custom-spinner"></div>
        </div>
      </>
    );
  }

  return null;
};

export default Logout;
