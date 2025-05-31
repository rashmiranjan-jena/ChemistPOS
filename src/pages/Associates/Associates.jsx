import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
} from "reactstrap";
import { FaUsers, FaUserMd, FaIndustry, FaTruck, FaStore, FaMoneyCheckAlt, FaTags, FaBox, FaUserTag, FaCogs, FaEye, FaUserFriends } from "react-icons/fa"; // Added FaUserFriends for Customer Type Master
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";

const Associates = () => {
  const navigate = useNavigate();

  const dashboardData = [
    { title: "Employee", route: "/add-new-employee-list", icon: <FaUsers />, color: "#007bff", count: "150" },
    { title: "Doctor", route: "/add-new-doctor-list", icon: <FaUserMd />, color: "#00c4cc", count: "75" },
    { title: "Manufacturer", route: "/manufacturer-management-list", icon: <FaIndustry />, color: "#ff5722", count: "20" },
    { title: "Supplier", route: "/supplier-management-list", icon: <FaTruck />, color: "#4caf50", count: "45" },
    { title: "Seller", route: "/seller-management-list", icon: <FaStore />, color: "#9c27b0", count: "60" },
    { title: "Commission", route: "/commission-master-list", icon: <FaMoneyCheckAlt />, color: "#f44336", count: "120" },
    { title: "Discount", route: "/discount-master-list", icon: <FaTags />, color: "#673ab7", count: "90" },
    { title: "Supplier Type Master", route: "/supplier-type-master-list", icon: <FaBox />, color: "#ff9800", count: "10" },
    { title: "Seller Type Master", route: "/seller-master-list", icon: <FaUserTag />, color: "#2196f3", count: "15" },
    { title: "Manufacturer Type Master", route: "/manufacturer-type-list", icon: <FaCogs />, color: "#607d8b", count: "8" },
    { title: "Customer Type Master", route: "/customer-type-master-list", icon: <FaUserFriends />, color: "#e91e63", count: "25" }, // New entry
  ];

  const handleBack = () => {
    navigate(-1); // Goes back to previous page in history
  };

  const handleCardClick = (route) => {
    navigate(route); // Navigate to the specified route when card or eye is clicked
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Associates"
            breadcrumbItem="Dashboard"
          />

          <Row>
            <Col xs="12">
              <Card className="shadow-lg" style={{ borderRadius: "20px", overflow: "hidden", background: "#f8f9fa" }}>
                <CardBody className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4
                      className="text-primary"
                      style={{
                        fontWeight: "700",
                        letterSpacing: "1px",
                        background: "linear-gradient(90deg, #007bff, #f44336)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Associates Dashboard
                    </h4>
                    <Button
                      color="secondary"
                      onClick={handleBack}
                      style={{
                        height: "35px",
                        width: "35px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                        transition: "transform 0.3s ease",
                      }}
                      className="hover-scale"
                      title="Back"
                    >
                      <i className="bx bx-undo" style={{ fontSize: "30px" }}></i>
                    </Button>
                  </div>

                  <Row className="g-4">
                    {dashboardData.map((item, index) => (
                      <Col xs="12" sm="6" lg="4" xl="3" key={index}>
                        <Card
                          className="shadow-sm border-0 h-100"
                          style={{
                            background: `linear-gradient(135deg, ${item.color}10, #ffffff)`,
                            borderRadius: "15px",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            overflow: "hidden",
                            position: "relative",
                            cursor: "pointer",
                          }}
                          onClick={() => handleCardClick(item.route)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
                            e.currentTarget.style.boxShadow = `0 12px 25px ${item.color}40`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0) scale(1)";
                            e.currentTarget.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.1)";
                          }}
                        >
                          <CardBody className="p-3 text-center">
                            <div
                              style={{
                                fontSize: "40px",
                                color: item.color,
                                marginBottom: "15px",
                              }}
                            >
                              {item.icon}
                            </div>
                            <CardTitle
                              tag="h5"
                              className="mb-2"
                              style={{
                                fontWeight: "600",
                                color: "#333",
                                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              {item.title}
                            </CardTitle>
                            <h3
                              style={{
                                fontWeight: "700",
                                color: item.color,
                                marginBottom: "10px",
                              }}
                            >
                              {item.count}
                            </h3>
                            <FaEye
                              style={{
                                fontSize: "24px",
                                color: item.color,
                                cursor: "pointer",
                                transition: "transform 0.3s ease",
                              }}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevents card click from firing
                                handleCardClick(item.route);
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.2)"}
                              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                            />
                            {/* Decorative gradient overlay */}
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "4px",
                                background: `linear-gradient(90deg, ${item.color}, ${item.color}80)`,
                              }}
                            ></div>
                          </CardBody>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <style jsx>{`
        .hover-scale:hover {
          transform: scale(1.1) !important;
        }
      `}</style>
    </React.Fragment>
  );
};

export default Associates;