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
import { FaCreditCard, FaHistory, FaClock } from "react-icons/fa"; // Icons for each card
import Breadcrumbs from "../../../components/Common/Breadcrumb"; // Assuming this path is correct
import { useNavigate } from "react-router-dom";

const SupplierManagementDashboard = () => {
  const navigate = useNavigate();

  // Dashboard data with sample values
  const dashboardData = [
    {
      title: "Supplier Credit Report",
      value: "$10,500",
      description: "Total credit outstanding",
      icon: <FaCreditCard />,
      color: "#007bff",
    },
    {
      title: "Purchase History Report",
      value: "75",
      description: "Total purchases recorded",
      icon: <FaHistory />,
      color: "#00c4cc",
    },
    {
      title: "Payment Due Report",
      value: "8",
      description: "Pending payments due",
      icon: <FaClock />,
      color: "#ff5722",
    },
  ];

  const handleBack = () => {
    navigate(-1); // Goes back to previous page in history
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Supplier Management"
            breadcrumbItem="Management Dashboard"
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
                        background: "linear-gradient(90deg, #007bff, #00c4cc)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Supplier Management Dashboard
                    </h4>
                    <Button
                      color="secondary"
                      onClick={handleBack}
                      style={{
                        height: "50px",
                        width: "50px",
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
                      <Col xs="12" sm="6" lg="4" key={index}>
                        <Card
                          className="shadow-sm border-0 h-100"
                          style={{
                            background: `linear-gradient(135deg, ${item.color}10, #ffffff)`,
                            borderRadius: "15px",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            overflow: "hidden",
                            position: "relative",
                          }}
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
                              {item.value}
                            </h3>
                            <p
                              style={{
                                fontSize: "14px",
                                color: "#666",
                                margin: "0",
                              }}
                            >
                              {item.description}
                            </p>
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

      {/* Inline CSS for hover effects */}
      <style jsx>{`
        .hover-scale:hover {
          transform: scale(1.1) !important;
        }
      `}</style>
    </React.Fragment>
  );
};

export default SupplierManagementDashboard;