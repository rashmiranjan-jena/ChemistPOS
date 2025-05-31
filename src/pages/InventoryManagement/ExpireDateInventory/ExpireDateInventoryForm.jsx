import React, { useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schema using Yup
const validationSchema = Yup.object({
  alertLevel: Yup.number()
    .required("Alert Level is required")
    .min(1, "Alert Level must be at least 1 day")
    .max(365, "Alert Level cannot exceed 365 days"),
});

const ExpireDateInventoryForm = () => {
  const navigate = useNavigate();

  const initialValues = {
    productName: "Sample Product", // Auto-filled
    productId: "EXP12345", // Auto-filled
    expiryDate: "2025-06-09", // Auto-filled (example expiry date)
    quantity: 100, // Auto-filled
    daysToExpiry: 0, // Auto-calculated
    alertLevel: "", // User input for threshold
  };

  // Function to calculate days to expiry
  const calculateDaysToExpiry = (expiryDate) => {
    const today = new Date("2025-03-09"); // Current date as per your setup
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : 0; // Return 0 if expired
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form Values:", values);
    setTimeout(() => {
      alert("Expiry details submitted successfully!");
      setSubmitting(false);
      navigate("/expiry-inventory-list"); // Adjust the navigation path as needed
    }, 1000);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Inventory Management" breadcrumbItem="Expiry Date Inventory" />
          <Row>
            <Col xs="12">
              <Card className="shadow-lg" style={{ borderRadius: "15px", overflow: "hidden" }}>
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
                      Expiry Date Inventory
                    </h4>
                    <Button
                      color="secondary"
                      onClick={() => navigate(-1)}
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

                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ values, setFieldValue, isSubmitting, errors, touched }) => {
                      // Calculate Days to Expiry when expiryDate changes
                      useEffect(() => {
                        const days = calculateDaysToExpiry(values.expiryDate);
                        setFieldValue("daysToExpiry", days);
                      }, [values.expiryDate, setFieldValue]);

                      return (
                        <Form>
                          <Row className="g-4">
                            {/* Product Name (Auto) */}
                            <Col md="6">
                              <FormGroup>
                                <Label
                                  for="productName"
                                  className="fw-bold text-dark"
                                  style={{ fontSize: "14px" }}
                                >
                                  Product Name
                                </Label>
                                <Field
                                  as={Input}
                                  type="text"
                                  name="productName"
                                  id="productName"
                                  disabled
                                  className="form-control"
                                  style={{
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    padding: "10px",
                                  }}
                                />
                              </FormGroup>
                            </Col>

                            {/* Product ID (Auto) */}
                            <Col md="6">
                              <FormGroup>
                                <Label
                                  for="productId"
                                  className="fw-bold text-dark"
                                  style={{ fontSize: "14px" }}
                                >
                                  Product ID
                                </Label>
                                <Field
                                  as={Input}
                                  type="text"
                                  name="productId"
                                  id="productId"
                                  disabled
                                  className="form-control"
                                  style={{
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    padding: "10px",
                                  }}
                                />
                              </FormGroup>
                            </Col>

                            {/* Expiry Date (Auto) */}
                            <Col md="6">
                              <FormGroup>
                                <Label
                                  for="expiryDate"
                                  className="fw-bold text-dark"
                                  style={{ fontSize: "14px" }}
                                >
                                  Expiry Date
                                </Label>
                                <Field
                                  as={Input}
                                  type="date"
                                  name="expiryDate"
                                  id="expiryDate"
                                  disabled
                                  className="form-control"
                                  style={{
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    padding: "10px",
                                  }}
                                />
                              </FormGroup>
                            </Col>

                            {/* Quantity (Auto) */}
                            <Col md="6">
                              <FormGroup>
                                <Label
                                  for="quantity"
                                  className="fw-bold text-dark"
                                  style={{ fontSize: "14px" }}
                                >
                                  Quantity
                                </Label>
                                <Field
                                  as={Input}
                                  type="number"
                                  name="quantity"
                                  id="quantity"
                                  disabled
                                  className="form-control"
                                  style={{
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    padding: "10px",
                                  }}
                                />
                              </FormGroup>
                            </Col>

                            {/* Days to Expiry (Auto Calculation) */}
                            <Col md="6">
                              <FormGroup>
                                <Label
                                  for="daysToExpiry"
                                  className="fw-bold text-dark"
                                  style={{ fontSize: "14px" }}
                                >
                                  Days to Expiry
                                </Label>
                                <Field
                                  as={Input}
                                  type="number"
                                  name="daysToExpiry"
                                  id="daysToExpiry"
                                  disabled
                                  className="form-control"
                                  style={{
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    padding: "10px",
                                    backgroundColor:
                                      values.daysToExpiry <= values.alertLevel && values.alertLevel
                                        ? "#f8d7da"
                                        : "#e9ecef",
                                  }}
                                />
                              </FormGroup>
                            </Col>

                            {/* Alert Level (Set Threshold) */}
                            <Col md="6">
                              <FormGroup>
                                <Label
                                  for="alertLevel"
                                  className="fw-bold text-dark"
                                  style={{ fontSize: "14px" }}
                                >
                                  Alert Level (Days)
                                </Label>
                                <Field
                                  as={Input}
                                  type="number"
                                  name="alertLevel"
                                  id="alertLevel"
                                  placeholder="Enter alert threshold in days"
                                  className={`form-control ${
                                    errors.alertLevel && touched.alertLevel ? "is-invalid" : ""
                                  }`}
                                  style={{
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    padding: "10px",
                                  }}
                                />
                                <ErrorMessage
                                  name="alertLevel"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </FormGroup>
                            </Col>

                            {/* Submit Button */}
                            <Col md="12" className="text-end">
                              <Button
                                type="submit"
                                color="primary"
                                disabled={isSubmitting}
                                style={{
                                  padding: "10px 25px",
                                  borderRadius: "8px",
                                  boxShadow: "0 4px 10px rgba(0, 123, 255, 0.3)",
                                  transition: "transform 0.3s ease",
                                }}
                                className="hover-scale"
                              >
                                {isSubmitting ? "Submitting..." : "Submit"}
                              </Button>
                            </Col>
                          </Row>
                        </Form>
                      );
                    }}
                  </Formik>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Inline CSS for hover effects */}
      <style jsx>{`
        .hover-scale:hover {
          transform: scale(1.05) !important;
        }
        .form-control:focus {
          border-color: #007bff;
          box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
        }
        .invalid-feedback {
          font-size: 12px;
          color: #dc3545;
        }
      `}</style>
    </React.Fragment>
  );
};

export default ExpireDateInventoryForm;