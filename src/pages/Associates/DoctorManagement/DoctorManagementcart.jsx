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
import { FaArrowRight } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate, useLocation } from "react-router-dom";

const DoctorManagementCart = () => {
  const location = useLocation();
  const id = location.state?.id || null;
  console.log("id", id);
  const navigate = useNavigate();

  const cards = id
    ? [
        {
          title: "Basic Details",
          route: "/doctor-basic-details",
          backgroundGradient: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
          topGradient: "linear-gradient(90deg, #42a5f5, #1976d2)",
          arrowColor: "#1976d2",
        },
        {
          title: "Activity Details",
          route: "/doctor-activity-details",
          backgroundGradient: "linear-gradient(135deg, #e0f7fa, #b2ebf2)",
          topGradient: "linear-gradient(90deg, #26c6da, #00acc1)",
          arrowColor: "#00acc1",
        },
      ]
    : [
        {
          title: "Basic Details",
          route: "/doctor-basic-details",
          backgroundGradient: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
          topGradient: "linear-gradient(90deg, #42a5f5, #1976d2)",
          arrowColor: "#1976d2",
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
            title="Doctor Management"
            breadcrumbItem="Doctor Details"
          />

          <Row>
            <Col xs="12">
              <Card
                className="shadow-lg"
                style={{ borderRadius: "15px", overflow: "hidden" }}
              >
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
                      Doctor Management
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
                    {cards.map((card, index) => (
                      <Col xs="12" sm="6" lg="4" key={index}>
                        <Card
                          className="shadow-sm border-0 h-100"
                          style={{
                            background: card.backgroundGradient,
                            borderRadius: "12px",
                            transition:
                              "transform 0.3s ease, box-shadow 0.3s ease",
                            cursor: "pointer",
                            overflow: "hidden",
                            position: "relative",
                          }}
                          onClick={() => handleCardClick(card.route)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(-5px) rotate(1deg)";
                            e.currentTarget.style.boxShadow =
                              "0 10px 20px rgba(0, 123, 255, 0.3)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(0) rotate(0)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 10px rgba(0, 0, 0, 0.1)";
                          }}
                        >
                          <CardBody className="d-flex align-items-center justify-content-between p-3">
                            <CardTitle
                              tag="h5"
                              className="mb-0 text-dark"
                              style={{
                                fontWeight: "600",
                                color: "#333",
                                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              {card.title}
                            </CardTitle>
                            <FaArrowRight
                              style={{
                                fontSize: "20px",
                                color: card.arrowColor,
                                transition: "transform 0.3s ease",
                              }}
                              className="hover-arrow"
                            />
                          </CardBody>
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "5px",
                              background: card.topGradient,
                            }}
                          ></div>
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
        .hover-arrow {
          transform: translateX(0);
        }
        .card:hover .hover-arrow {
          transform: translateX(5px);
        }
      `}</style>
    </React.Fragment>
  );
};

export default DoctorManagementCart;
