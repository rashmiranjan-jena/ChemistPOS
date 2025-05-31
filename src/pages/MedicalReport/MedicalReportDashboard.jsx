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
import { FaFileAlt, FaUser, FaMoneyBillWave, FaClipboardList, FaEye } from "react-icons/fa";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";

const MedicalReportDashboard = () => {
  const navigate = useNavigate();

  const dashboardData = [
    { title: "MR Master", route: "/medical-report-list", icon: <FaUser />, color: "#007bff", count: "25" },
    { title: "MR Sales Report", route: "/medical-sales-report-list", icon: <FaFileAlt />, color: "#28a745", count: "150" },
    { title: "Commission", route: "/commission-payment-list", icon: <FaMoneyBillWave />, color: "#f44336", count: "5000" },
    { title: "MR Visit Log", route: "/medical-report-visit-list", icon: <FaClipboardList />, color: "#ffc107", count: "80" },
    { title: "Reports", route: "/medical-reports", icon: <FaFileAlt />, color: "#17a2b8", count: "10" },
  ];

  const handleBack = () => {
    navigate(-1);
  };

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Medical Reports" breadcrumbItem="Dashboard" />

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
                      Medical Report Dashboard
                    </h4>
                    <Button
                      color="secondary"
                      onClick={handleBack}
                      style={{
                        height: "40px",
                        width: "40px",
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
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                              }}
                            >
                              {item.title}
                            </CardTitle>
                            <h3
                              style={{
                                fontWeight: "700",
                                color: item.color,
                                marginBottom: "10px",
                                whiteSpace: "normal",
                                wordBreak: "break-word",
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
                                e.stopPropagation();
                                handleCardClick(item.route);
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.2)"}
                              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                            />
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

        @media (max-width: 768px) {
          .card-body {
            padding: 10px;
          }

          .card-title {
            font-size: 0.9rem;
          }

          h3 {
            font-size: 1.1rem;
          }

          .fa-eye {
            font-size: 20px;
          }
        }

        @media (max-width: 576px) {
          .row.g-4 {
            gap: 1rem;
          }

          .card {
            margin-bottom: 1rem;
          }

          .card-title {
            font-size: 0.8rem;
          }

          h3 {
            font-size: 1rem;
          }

          .fa-eye {
            font-size: 18px;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default MedicalReportDashboard;