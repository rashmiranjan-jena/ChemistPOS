import React from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import { useNavigate } from "react-router-dom";

import avatar1 from "../../assets/images/users/avatar-1.jpg";
import profileImg from "../../assets/images/profile-img.png";

// Safe JSON parsing function
const safeParse = (key, fallback = {}) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error parsing ${key}:`, error);
    return fallback;
  }
};

const WelcomeComp = () => {
  const navigate = useNavigate();
  
  const adminData = safeParse("adminDetails");
  const adminProfileData = safeParse("profileInfo");

  const handleViewProfile = () => {
    navigate("/profile", {
      state: { adminDetails: adminData, profileInfo: adminProfileData },
    });
  };

  return (
    <React.Fragment>
      <Card className="overflow-hidden">
        <div className="bg-primary-subtle">
          <Row>
            <Col xs="7">
              <div className="text-primary p-3">
                <h5 className="text-primary">
                  Welcome Back, {adminData?.username || "Admin"}!
                </h5>
                <p>Admin Dashboard</p>
              </div>
            </Col>
            <Col xs="5" className="align-self-end">
              <img src={profileImg} alt="Profile" className="img-fluid" />
            </Col>
          </Row>
        </div>
        <CardBody className="pt-0">
          <Row>
            <Col sm="4">
              <div className="avatar-md profile-user-wid mb-4">
                <img
                  src={
                    adminProfileData?.profile_picture
                      ? `${import.meta.env.VITE_API_BASE_URL}${adminProfileData.profile_picture}`
                      : profileImg
                  }
                  alt="Profile"
                  className="img-fluid"
                />
              </div>
              <h5 className="font-size-15 text-truncate">
                {adminData?.username || "Admin"}
              </h5>
              <p className="text-muted mb-0 text-truncate">
                {adminData?.email || "No Email"}
              </p>
            </Col>

            <Col sm="8">
              <div className="pt-4">
                <Row>
                  <Col xs="6">
                    <h5 className="font-size-15">
                      {adminData?.mobile_no || "N/A"}
                    </h5>
                    <p className="text-muted mb-0">Mobile No</p>
                  </Col>
                  <Col xs="6">
                    <h5 className="font-size-15">
                      {adminData?.is_staff ? "Staff" : "User"}
                    </h5>
                    <p className="text-muted mb-0">Role</p>
                  </Col>
                </Row>
                <div className="mt-4">
                  <button
                    onClick={handleViewProfile}
                    className="btn btn-primary btn-sm"
                  >
                    Update Profile <i className="mdi mdi-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default WelcomeComp;
