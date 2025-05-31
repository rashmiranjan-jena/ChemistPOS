import React, { useState, useEffect } from "react";
import { Card, CardBody, Button, Badge, Spinner } from "reactstrap";
import { FaEnvelope, FaEdit, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getUserDetails } from "../../ApiService/ChemistDashboard/ProfileCard";

const ProfileCard = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("User ID not found in local storage");
        }
        const response = await getUserDetails(userId);
        const customerDetails = response?.customer_details;
        setUserDetails({
          name: customerDetails?.username ?? "N/A",
          email: customerDetails?.email ?? "N/A",
          mobile_no: customerDetails?.mobile_no ?? "N/A",
          photo: customerDetails?.profile_picture
            ? `${import.meta.env.VITE_API_BASE_URL}${
                customerDetails.profile_picture
              }`
            : "https://img.freepik.com/free-vector/doctor-character-avatar-isolated_24877-60107.jpg",
          gender: customerDetails?.gender ?? "N/A",
          whatsapp_no: customerDetails?.whatsapp_no ?? "N/A",
          role: customerDetails?.role ?? "N/A",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError(error.message);
        Swal.fire({
          title: "Error!",
          text: error.message ?? "Failed to fetch user details.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleNavigate = () => {
    const adminDetails = {
      name: userDetails?.name,
      email: userDetails?.email,
      mobile_no: userDetails?.mobile_no,
      photo: userDetails?.photo,
    };
    const profileInfo = {
      gender: userDetails?.gender,
      whatsapp_no: userDetails?.whatsapp_no,
    };
    navigate("/profile", { state: { adminDetails, profileInfo } });
  };

  if (loading) {
    return (
      <Card className="profile-card mb-3">
        <CardBody className="text-center">
          <Spinner color="primary" />
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="profile-card mb-3">
        <CardBody className="text-center">
          <p className="text-danger">{error}</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="profile-card mb-2 mx-auto" style={{ height: "323px", width: "100%" }}>

      <CardBody className="text-center">
        <img
          src={userDetails.photo}
          alt="User"
          className="rounded-circle mb-3"
          style={{
            width: "80px",
            height: "80px",
            objectFit: "cover",
            border: "3px solid #e3e6f0",
          }}
        />
        <h5 className="mb-1" style={{ color: "#1a202c" }}>
          {userDetails.name}
        </h5>
        <p className="text-muted mb-3" style={{ fontSize: "14px" }}>
          {userDetails.role?.toUpperCase()}
        </p>

        <div className="d-flex flex-column align-items-center mb-4">
          <Badge
            className="mb-2 profile-badge"
            style={{
              backgroundColor: "#e6fffa",
              color: "#b0a072",
              padding: "8px 14px",
              fontSize: "14px",
              borderRadius: "12px",
            }}
          >
            <FaEnvelope className="me-2" />
            <span style={{ color: "#b0b0b0" }}>{userDetails.email}</span>
          </Badge>
          <Badge
            className="mb-2 profile-badge"
            style={{
              backgroundColor: "#e6f0ff",
              color: "#07a5fa",
              padding: "8px 14px",
              fontSize: "14px",
              borderRadius: "12px",
            }}
          >
            <FaPhone className="me-2" />
            <span style={{ color: "#b0b0b0" }}>{userDetails.mobile_no}</span>
          </Badge>
        </div>

        <Button
          className="profile-btn w-100"
          onClick={handleNavigate}
          title="Edit your profile details"
        >
          <FaEdit className="me-2" /> Update Profile
        </Button>
      </CardBody>
      <style jsx>{`
        .profile-card {
          border: none;
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .profile-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
        .text-center {
          padding: 20px;
        }
        .profile-badge {
          display: inline-flex;
          align-items: center;
          font-weight: 500;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease;
        }
        .profile-badge:hover {
          transform: scale(1.05);
        }
        .profile-btn {
          background: linear-gradient(90deg, #4a90e2, #63b3ed);
          border: none;
          border-radius: 10px;
          padding: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .profile-btn:hover {
          background: linear-gradient(90deg, #2b6cb0, #4299e1);
          transform: scale(1.02);
        }
      `}</style>
    </Card>
  );
};

ProfileCard.propTypes = {};

export default ProfileCard;
