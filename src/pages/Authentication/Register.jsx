import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  CardBody,
  Card,
  Container,
  Form,
  Input,
  Label,
  Alert,
} from "reactstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as Yup from "yup";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { registerUser } from "../../ApiService/Login/Register";
import profileImg from "../../assets/images/profile-img.png";

const styles = `
  .register-wrapper {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    padding: 20px;
  }

  .register-card {
    border: none;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    overflow: hidden;
    transition: transform 0.3s ease;
  }

  .register-card:hover {
    transform: translateY(-5px);
  }

  .register-header {
    background: linear-gradient(45deg, #5a67d8, #7f9cf5);
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }

  .register-header::before {
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

  .btn-register {
    border-radius: 50px;
    padding: 12px 30px;
    background: linear-gradient(45deg, #5a67d8, #7f9cf5);
    border: none;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .btn-register:hover {
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

const Register = () => {
  document.title = "Register | Vichaar Lab";
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validation = useFormik({
    initialValues: {
      email: "",
      username: "",
      mobile: "",
      password: "",
      userType: "employee",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email")
        .required("Please enter your email"),
      username: Yup.string().required("Please enter your username"),
      mobile: Yup.string()
        .matches(/^\d{10}$/, "Mobile number must be 10 digits")
        .required("Please enter your mobile number"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .matches(
          /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
          "Password must contain at least one letter, one number, and one special character"
        )
        .required("Please enter your password"),
      userType: Yup.string()
        .oneOf(["admin", "employee"], "Please select a valid user type")
        .required("Please select user type"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      try {
        const payload = {
          email: values.email,
          username: values.username,
          mobile_no: values.mobile,
          password: values.password,
          user_type: values.userType,
        };

        const response = await registerUser(payload);
        if (response) {
          Swal.fire({
            title: "Success!",
            text: "Registration successful!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => navigate("/login"));
        }
      } catch (error) {
        setError(
          error?.response?.data?.error ||
            "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <>
      <style>{styles}</style>
      <div className="register-wrapper">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="register-card">
                <div className="register-header">
                  <h4 className="text-white mb-2">Create Account</h4>
                  <p className="text-white opacity-75">
                    Get started with Vichaar Lab
                  </p>
                  <img src={profileImg} alt="profile" className="profile-img" />
                </div>
                <CardBody className="p-4">
                  <Form onSubmit={validation.handleSubmit} noValidate>
                    {error && (
                      <Alert color="danger" className="rounded-pill mb-4">
                        {error}
                      </Alert>
                    )}
                    <div className="mb-4">
                      <Label className="form-label fw-semibold">
                        User Type
                      </Label>
                      <Input
                        name="userType"
                        type="select"
                        {...validation.getFieldProps("userType")}
                        disabled={loading}
                        className="form-control"
                      >
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                      </Input>
                      {validation.touched.userType &&
                        validation.errors.userType && (
                          <div className="text-danger mt-1">
                            {validation.errors.userType}
                          </div>
                        )}
                    </div>

                    <div className="mb-4">
                      <Label className="form-label fw-semibold">Email</Label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Enter email"
                        {...validation.getFieldProps("email")}
                        disabled={loading}
                        className="form-control"
                      />
                      {validation.touched.email && validation.errors.email && (
                        <div className="text-danger mt-1">
                          {validation.errors.email}
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <Label className="form-label fw-semibold">Username</Label>
                      <Input
                        name="username"
                        type="text"
                        placeholder="Enter username"
                        {...validation.getFieldProps("username")}
                        disabled={loading}
                        className="form-control"
                      />
                      {validation.touched.username &&
                        validation.errors.username && (
                          <div className="text-danger mt-1">
                            {validation.errors.username}
                          </div>
                        )}
                    </div>

                    <div className="mb-4">
                      <Label className="form-label fw-semibold">
                        Mobile Number
                      </Label>
                      <Input
                        name="mobile"
                        type="text"
                        placeholder="Enter mobile number"
                        {...validation.getFieldProps("mobile")}
                        disabled={loading}
                        className="form-control"
                      />
                      {validation.touched.mobile &&
                        validation.errors.mobile && (
                          <div className="text-danger mt-1">
                            {validation.errors.mobile}
                          </div>
                        )}
                    </div>

                    <div className="mb-4">
                      <Label className="form-label fw-semibold">Password</Label>
                      <div className="position-relative">
                        <Input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          {...validation.getFieldProps("password")}
                          disabled={loading}
                          className="form-control"
                        />
                        <button
                          type="button"
                          className="password-toggle position-absolute top-50 end-0 translate-middle-y pe-3"
                          onClick={togglePasswordVisibility}
                          disabled={loading}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {validation.touched.password &&
                        validation.errors.password && (
                          <div className="text-danger mt-1">
                            {validation.errors.password}
                          </div>
                        )}
                    </div>

                    <div className="d-grid">
                      <button
                        className="btn btn-register"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Registering...
                          </>
                        ) : (
                          "Register"
                        )}
                      </button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
              <div className="mt-4 text-center footer-links">
                <p className="text-white">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="fw-semibold text-decoration-underline text-white"
                  >
                    Sign In
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

export default Register;
