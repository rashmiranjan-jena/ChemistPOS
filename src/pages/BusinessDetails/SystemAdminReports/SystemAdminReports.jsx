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
import { FaBuilding, FaStore, FaUsers, FaUserTag } from "react-icons/fa"; // Icons for each report
import Breadcrumbs from "../../../components/Common/Breadcrumb"; // Assuming this path is correct
import { useNavigate } from "react-router-dom";

const SystemAdminReports = () => {
  const navigate = useNavigate();

  // Report data with routes and icons
  const reports = [
    {
      title: "Company Registration Report",
      description: "Details of registered businesses",
      route: "/company-registration-report",
      icon: <FaBuilding />,
      color: "#007bff",
    },
    {
      title: "Store List Report",
      description: "All stores under a company",
      route: "/store-list-report",
      icon: <FaStore />,
      color: "#00c4cc",
    },
    {
      title: "Department-wise Employee Report",
      description: "Employee distribution by department",
      route: "/department-employee-report",
      icon: <FaUsers />,
      color: "#ff5722",
    },
    {
      title: "Designation Report",
      description: "Roles assigned and usage",
      route: "/designation-report",
      icon: <FaUserTag />,
      color: "#4caf50",
    },
  ];

  const handleBack = () => {
    navigate(-1); // Goes back to previous page in history
  };

  const handleCardClick = (route) => {
    navigate(route); // Navigate to the specified report page
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="System Admin"
            breadcrumbItem="Reports"
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
                      System Admin Reports
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
                    {reports.map((report, index) => (
                      <Col xs="12" sm="6" lg="4" key={index}>
                        <Card
                          className="shadow-sm border-0 h-100"
                          style={{
                            background: `linear-gradient(135deg, ${report.color}10, #ffffff)`,
                            borderRadius: "15px",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            cursor: "pointer",
                            overflow: "hidden",
                            position: "relative",
                          }}
                          onClick={() => handleCardClick(report.route)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
                            e.currentTarget.style.boxShadow = `0 12px 25px ${report.color}40`;
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
                                color: report.color,
                                marginBottom: "15px",
                              }}
                            >
                              {report.icon}
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
                              {report.title}
                            </CardTitle>
                            <p
                              style={{
                                fontSize: "14px",
                                color: "#666",
                                margin: "0",
                              }}
                            >
                              {report.description}
                            </p>
                            {/* Decorative gradient overlay */}
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "4px",
                                background: `linear-gradient(90deg, ${report.color}, ${report.color}80)`,
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

export default SystemAdminReports;