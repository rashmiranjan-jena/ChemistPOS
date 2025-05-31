import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Input,
  Form,
} from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { updateUserProfile } from "../../ApiService/ChemistDashboard/ProfileCard";
import Breadcrumb from "../../components/Common/Breadcrumb";

const UserProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminDetails, profileInfo } = location.state || {};

  // Initialize form data with adminDetails and profileInfo
  const [formData, setFormData] = useState({
    username: adminDetails?.name || "",
    gender: profileInfo?.gender === "N/A" ? "" : profileInfo?.gender || "",
    whatsapp_no:
      profileInfo?.whatsapp_no === "N/A" ? "" : profileInfo?.whatsapp_no || "",
    profile_picture: null,
  });

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData({ ...formData, profile_picture: e.target.files[0] });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.username) {
      Swal.fire({
        title: "Error!",
        text: "Username is required.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("whatsapp_no", formData.whatsapp_no);
    if (formData.profile_picture) {
      formDataToSend.append("profile_picture", formData.profile_picture);
    }

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found in local storage");
      }
      const response = await updateUserProfile(userId, formDataToSend);
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Profile updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
      navigate("/dashboard");
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to update profile.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumb and Back Button */}
          <div className="d-flex align-items-center justify-content-between mb-3">
            <Breadcrumb title="Update Profile" breadcrumbItem="Profile" />
            <Button
              color="primary"
              onClick={() => navigate(-1)}
              style={{
                height: "40px",
                width: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                background: "linear-gradient(45deg, #007bff, #00c4cc)",
                border: "none",
                boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)",
                transition: "transform 0.3s ease",
              }}
              className="hover-scale"
              title="Back"
            >
              <i className="bx bx-undo" style={{ fontSize: "18px" }}></i>
            </Button>
          </div>

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="ms-3">
                      <img
                        src={
                          adminDetails?.photo ||
                          "https://img.freepik.com/free-vector/doctor-character-avatar-isolated_24877-60107.jpg"
                        }
                        alt="Profile"
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{formData.username || "User Name"}</h5>
                        <p className="mb-1">{adminDetails?.email || "N/A"}</p>
                        <p className="mb-0">
                          Mobile: {adminDetails?.mobile_no || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4">Edit Profile</h4>

          <Card>
            <CardBody>
              <Form className="form-horizontal" onSubmit={handleSubmit}>
                {/* Username Field */}
                <div className="form-group mb-3">
                  <Label className="form-label">User Name</Label>
                  <Input
                    name="username"
                    className="form-control"
                    placeholder="Enter User Name"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>

                {/* Gender Field */}
                <div className="form-group mb-3">
                  <Label className="form-label">Gender</Label>
                  <Input
                    type="select"
                    name="gender"
                    className="form-control"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Input>
                </div>

                {/* WhatsApp Number Field */}
                <div className="form-group mb-3">
                  <Label className="form-label">WhatsApp Number</Label>
                  <Input
                    name="whatsapp_no"
                    className="form-control"
                    placeholder="Enter WhatsApp Number"
                    type="text"
                    value={formData.whatsapp_no}
                    onChange={handleChange}
                  />
                </div>

                {/* Profile Picture Upload Field with Preview */}
                <div className="form-group mb-3">
                  <Label className="form-label">Profile Picture</Label>
                  <div className="d-flex align-items-center">
                    {/* Image Preview */}
                    <img
                      src={
                        formData.profile_picture
                          ? URL.createObjectURL(formData.profile_picture)
                          : adminDetails?.photo ||
                            "https://img.freepik.com/free-vector/doctor-character-avatar-isolated_24877-60107.jpg"
                      }
                      alt="Profile Preview"
                      className="avatar-md rounded-circle img-thumbnail me-3"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                    <Input
                      type="file"
                      name="profile_picture"
                      className="form-control"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div className="text-center mt-4">
                  <Button type="submit" color="primary">
                    Update Profile
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
