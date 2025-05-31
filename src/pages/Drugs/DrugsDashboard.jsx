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
import { FaFileAlt, FaIdCard, FaEye } from "react-icons/fa";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";

const DrugsDashboard = () => {
  const navigate = useNavigate();

  const dashboardData = [
    {
      title: "Group Category",
      route: "/group-category-list",
      icon: <FaIdCard />,
      color: "#007bff",
      count: "50",
    },
    {
      title: "Group Disease",
      route: "/group-disease-list",
      icon: <FaFileAlt />,
      color: "#00c4cc",
      count: "30",
    },
    {
      title: "Generic Description",
      route: "/generic-descripsation-list",
      icon: <FaFileAlt />,
      color: "#f44336",
      count: "120",
    },
    {
      title: "Brand",
      route: "/brand-list",
      icon: <FaIdCard />,
      color: "#28a745",
      count: "80",
    },
    {
      title: "Strength",
      route: "/strength-list",
      icon: <FaFileAlt />,
      color: "#ffc107",
      count: "45",
    },
    {
      title: "Category",
      route: "/category-list",
      icon: <FaFileAlt />,
      color: "#6610f2",
      count: "25",
    },
    {
      title: "Sub Category",
      route: "/sub-category-list",
      icon: <FaIdCard />,
      color: "#17a2b8",
      count: "60",
    },
    {
      title: "Disease",
      route: "/disease-list",
      icon: <FaIdCard />,
      color: "#dc3545",
      count: "35",
    },
    {
      title: "Product Type",
      route: "/product-type-list",
      icon: <FaFileAlt />,
      color: "#20c997",
      count: "15",
    },
    {
      title: "Drug Form",
      route: "/drug-form-list",
      icon: <FaIdCard />,
      color: "#fd7e14",
      count: "40",
    },
    {
      title: "Drug Type",
      route: "/drug-type-list",
      icon: <FaFileAlt />,
      color: "#6f42c1",
      count: "20",
    },
    {
      title: "Unit And Measurement",
      route: "/measurementunitlist",
      icon: <FaFileAlt />,
      color: "#007bff",
      count: "15",
    },
    {
      title: "Product",
      route: "/drug-list",
      icon: <FaIdCard />,
      color: "#e83e8c",
      count: "100",
    },
    // {
    //   title: "Drugs Report",
    //   route: "/drug-report-list",
    //   icon: <FaFileAlt />,
    //   color: "#343a40",
    //   count: "10",
    // },
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
          <Breadcrumbs title="Drugs" breadcrumbItem="Dashboard" />

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
                      Drugs Dashboard
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

export default DrugsDashboard;
