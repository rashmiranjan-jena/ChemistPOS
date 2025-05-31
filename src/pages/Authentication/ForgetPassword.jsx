import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Alert,
  Input,
  Label,
  Form,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import profile from "../../assets/images/profile-img.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const styles = `
  .forgot-wrapper {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    padding: 20px;
  }

  .forgot-card {
    border: none;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    overflow: hidden;
    transition: transform 0.3s ease;
  }

  .forgot-card:hover {
    transform: translateY(-5px);
  }

  .forgot-header {
    background: linear-gradient(45deg, #5a67d8, #7f9cf5);
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }

  .forgot-header::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: rgba(255, 255, 255, 0.1);
    transform: rotate(30deg);
    pointer-events: none;
  }

  .profile-img {
    position: absolute;
    right: 20px;
    bottom: -20px;
    width: 150px;
    opacity: 0.9;
    filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2));
  }

  .form-control {
    border-radius: 10px;
    border: 2px solid #e2e8f0;
    padding: 12px;
    transition: all 0.3s ease;
  }

  .form-control:focus {
    border-color: #5a67d8;
    box-shadow: 0 0 0 3px rgba(90, 103, 216, 0.2);
  }

  .btn-forgot {
    border-radius: 50px;
    padding: 12px 30px;
    background: linear-gradient(45deg, #5a67d8, #7f9cf5);
    border: none;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .btn-forgot:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(90, 103, 216, 0.4);
  }

  .password-toggle {
    background: none;
    border: none;
    color: #5a67d8;
  }

  .footer-links a {
    color: #64748b;
    transition: color 0.3s ease;
  }

  .footer-links a:hover {
    color: #5a67d8;
  }
`;

const ForgetPasswordPage = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState("email");
  const [userOtp, setUserOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  document.title = "Forgot Password | Vichaar Lab";

  const emailValidation = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email")
        .required("Please Enter Your Email"),
    }),
    onSubmit: async (values) => {
      setSuccessMessage("");
      setErrorMessage("");
      setLoading(true);
      try {
        await axios.post(`${API_BASE_URL}api/admin-forgot-password/`, values);
        setStep("otp");
        setSuccessMessage("OTP sent to your email. Enter OTP to continue.");
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Something went wrong. Try again."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const handleOtpSubmit = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}api/admin-verify-otp/`, {
        email: emailValidation.values.email,
        otp: userOtp,
      });
      setStep("password");
      setSuccessMessage("OTP verified. Enter your new password.");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordValidation = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Please confirm your password"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await axios.post(`${API_BASE_URL}api/admin-reset-password/`, {
          email: emailValidation.values.email,
          password: values.newPassword,
        });
        setSuccessMessage(
          "Password reset successfully! Redirecting to login..."
        );
        setTimeout(() => navigate("/login"), 1000);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Failed to reset password."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <style>{styles}</style>
      <div className="forgot-wrapper">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="forgot-card">
                <div className="forgot-header">
                  <h4 className="text-white mb-2">Reset Password</h4>
                  <p className="text-white opacity-75">
                    Follow the steps to reset your password
                  </p>
                  <img src={profile} alt="profile" className="profile-img" />
                </div>
                <CardBody className="p-4">
                  {errorMessage && (
                    <Alert color="danger" className="rounded-pill mb-4">
                      {errorMessage}
                    </Alert>
                  )}
                  {successMessage && (
                    <Alert color="success" className="rounded-pill mb-4">
                      {successMessage}
                    </Alert>
                  )}

                  {step === "email" && (
                    <Form onSubmit={emailValidation.handleSubmit} noValidate>
                      <div className="mb-4">
                        <Label className="form-label fw-semibold">Email</Label>
                        <Input
                          name="email"
                          type="email"
                          placeholder="Enter email"
                          value={emailValidation.values.email}
                          onChange={emailValidation.handleChange}
                          onBlur={emailValidation.handleBlur}
                          disabled={loading}
                          className="form-control"
                        />
                      </div>
                      <div className="d-grid">
                        <button
                          className="btn btn-forgot"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" />
                              Sending...
                            </>
                          ) : (
                            "Send OTP"
                          )}
                        </button>
                      </div>
                    </Form>
                  )}

                  {step === "otp" && (
                    <div>
                      <div className="mb-4">
                        <Label className="form-label fw-semibold">
                          Enter OTP
                        </Label>
                        <Input
                          type="text"
                          placeholder="Enter OTP"
                          value={userOtp}
                          onChange={(e) => setUserOtp(e.target.value)}
                          disabled={loading}
                          className="form-control"
                        />
                      </div>
                      <div className="d-grid">
                        <button
                          className="btn btn-forgot"
                          onClick={handleOtpSubmit}
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" />
                              Verifying...
                            </>
                          ) : (
                            "Verify OTP"
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {step === "password" && (
                    <Form onSubmit={passwordValidation.handleSubmit} noValidate>
                      <div className="mb-4">
                        <Label className="form-label fw-semibold">
                          New Password
                        </Label>
                        <div className="position-relative">
                          <Input
                            name="newPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            value={passwordValidation.values.newPassword}
                            onChange={passwordValidation.handleChange}
                            onBlur={passwordValidation.handleBlur}
                            disabled={loading}
                            className="form-control"
                          />
                          <button
                            type="button"
                            className="password-toggle position-absolute top-50 end-0 translate-middle-y pe-3"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>
                      <div className="mb-4">
                        <Label className="form-label fw-semibold">
                          Confirm Password
                        </Label>
                        <div className="position-relative">
                          <Input
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            value={passwordValidation.values.confirmPassword}
                            onChange={passwordValidation.handleChange}
                            onBlur={passwordValidation.handleBlur}
                            disabled={loading}
                            className="form-control"
                          />
                          <button
                            type="button"
                            className="password-toggle position-absolute top-50 end-0 translate-middle-y pe-3"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            disabled={loading}
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>
                      <div className="d-grid">
                        <button
                          className="btn btn-forgot"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" />
                              Resetting...
                            </>
                          ) : (
                            "Reset Password"
                          )}
                        </button>
                      </div>
                    </Form>
                  )}
                </CardBody>
              </Card>
              <div className="mt-4 text-center footer-links">
                <p className="text-white">
                  Remembered your password?{" "}
                  <Link
                    to="/login"
                    className="fw-semibold text-decoration-underline text-white"
                  >
                    Login Now
                  </Link>
                </p>
                <p className="text-white opacity-75">
                  © {new Date().getFullYear()} Vichaar Lab • Made with ❤️
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ForgetPasswordPage;