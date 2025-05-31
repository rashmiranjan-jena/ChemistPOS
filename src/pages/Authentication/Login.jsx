import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../ApiService/Login/Login";
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
import profile from "../../assets/images/profile-img.png";

const styles = `
  .login-wrapper {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    padding: 20px;
  }

  .login-card {
    border: none;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    overflow: hidden;
    transition: transform 0.3s ease;
  }

  .login-card:hover {
    transform: translateY(-5px);
  }

  .login-header {
    background: linear-gradient(45deg, #5a67d8, #7f9cf5);
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }

  .login-header::before {
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

  .btn-login {
    border-radius: 50px;
    padding: 12px 30px;
    background: linear-gradient(45deg, #5a67d8, #7f9cf5);
    border: none;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .btn-login:hover {
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

  .login-type-toggle {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
  }

  .login-type-btn {
    padding: 8px 20px;
    border-radius: 20px;
    border: 2px solid #5a67d8;
    background: none;
    color: #5a67d8;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .login-type-btn.active {
    background: #5a67d8;
    color: white;
  }

  .login-type-btn:hover:not(.active) {
    background: rgba(90, 103, 216, 0.1);
  }
`;

const Login = () => {
  document.title = "Login | Vichaar Lab";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState("admin");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      identifier: formData.username.trim(),
      password: formData.password,
      login_type: loginType,
    };

    try {
      const response = await loginUser(payload);
      console.log(response, "test");
      if (response.access && response.refresh) {
        localStorage.setItem("authToken", response.access);
        localStorage.setItem("refreshToken", response.refresh);
        localStorage.setItem("userId", response.id);
        localStorage.setItem("userRole", response.role);

        navigate(`/dashboard`);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.log(err.response?.data?.error || err.message);
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-wrapper">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="login-card">
                <div className="login-header">
                  <h4 className="text-white mb-2">Welcome Back!</h4>
                  <p className="text-white opacity-75">
                    Enter your credentials to access Vichaar Lab
                  </p>
                  <img src={profile} alt="profile" className="profile-img" />
                </div>
                <CardBody className="p-4">
                  <div className="login-type-toggle">
                    <button
                      className={`login-type-btn ${
                        loginType === "admin" ? "active" : ""
                      }`}
                      onClick={() => setLoginType("admin")}
                      disabled={loading}
                    >
                      Admin Login
                    </button>
                    <button
                      className={`login-type-btn ${
                        loginType === "employee" ? "active" : ""
                      }`}
                      onClick={() => setLoginType("employee")}
                      disabled={loading}
                    >
                      Employee Login
                    </button>
                  </div>
                  <Form onSubmit={handleLogin} noValidate>
                    {error && (
                      <Alert color="danger" className="rounded-pill mb-4">
                        {error}
                      </Alert>
                    )}
                    <div className="mb-4">
                      <Label className="form-label fw-semibold">
                        Email or Mobile
                      </Label>
                      <Input
                        name="username"
                        type="text"
                        placeholder="Enter email or mobile"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-4">
                      <Label className="form-label fw-semibold">Password</Label>
                      <div className="position-relative">
                        <Input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          value={formData.password}
                          onChange={handleChange}
                          required
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
                    </div>
                    <div className="d-grid">
                      <button
                        className="btn btn-login"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Signing In...
                          </>
                        ) : (
                          `Sign In as ${
                            loginType === "admin" ? "Admin" : "Employee"
                          }`
                        )}
                      </button>
                    </div>
                    <div className="mt-3 text-center">
                      <Link
                        to="/forgot-password"
                        className="text-decoration-underline footer-links"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  </Form>
                </CardBody>
              </Card>
              <div className="mt-4 text-center footer-links">
                <p className="text-white">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="fw-semibold text-decoration-underline text-white"
                  >
                    Register Now
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

export default Login;
