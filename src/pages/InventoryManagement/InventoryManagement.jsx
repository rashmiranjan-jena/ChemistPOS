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
import {
  FaFileAlt,
  FaIdCard,
  FaEye,
  FaExclamationTriangle,
  FaClock,
} from "react-icons/fa";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";

const InventoryManagement = () => {
  const navigate = useNavigate();

  const dashboardData = [
    {
      title: "Purchase Inventory",
      route: "/purchase-inventory",
      icon: <FaIdCard />,
      color: "#007bff",
      count: "500",
    },
    {
      title: "Expired Management Inventory",
      route: "/expired-date-inventory",
      icon: <FaFileAlt />,
      color: "#f44336",
      count: "20",
    },
    {
      title: "Supplier Wise Inventory",
      route: "/supplier-wise-inventory",
      icon: <FaIdCard />,
      color: "#28a745",
      count: "150",
    },
    {
      title: "Low Stock Inventory",
      route: "/low-stock-inventory",
      icon: <FaFileAlt />,
      color: "#ffc107",
      count: "30",
    },
    {
      title: "Total Inventory",
      route: "/total-inventory",
      icon: <FaIdCard />,
      color: "#17a2b8",
      count: "200",
    },
    {
      title: "Sales Wise Inventory",
      route: "/sales-wise-inventory",
      icon: <FaFileAlt />,
      color: "#6610f2",
      count: "180",
    },
    {
      title: "Availability Inventory",
      route: "/availability-inventory",
      icon: <FaIdCard />,
      color: "#dc3545",
      count: "450",
    },
    {
      title: "Expired Drugs",
      route: "/expired-drugs-inventory",
      icon: <FaExclamationTriangle />,
      color: "#f44336",
      count: "20",
      description: "Manage already expired medications",
      badge: "Critical",
    },
    {
      title: "About to Expire",
      route: "/about-to-expire-inventory",
      icon: <FaClock />,
      color: "#ff9800",
      count: "35",
      description: "Drugs expiring within 30 days",
      badge: "Urgent",
    },
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
          <Breadcrumbs
            title="Inventory"
            breadcrumbItem="Management Dashboard"
          />

          <Row>
            <Col xs="12">
              <Card
                className="shadow-lg"
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  background: "#f8f9fa",
                }}
              >
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
                      Inventory Management Dashboard
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
                      <i
                        className="bx bx-undo"
                        style={{ fontSize: "30px" }}
                      ></i>
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
                            transition:
                              "transform 0.3s ease, box-shadow 0.3s ease",
                            overflow: "hidden",
                            position: "relative",
                            cursor: "pointer",
                          }}
                          onClick={() => handleCardClick(item.route)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(-10px) scale(1.02)";
                            e.currentTarget.style.boxShadow = `0 12px 25px ${item.color}40`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(0) scale(1)";
                            e.currentTarget.style.boxShadow =
                              "0 6px 15px rgba(0, 0, 0, 0.1)";
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
                                e.stopPropagation();
                                handleCardClick(item.route);
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.transform = "scale(1.2)")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = "scale(1)")
                              }
                            />
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: "0",
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

export default InventoryManagement;
