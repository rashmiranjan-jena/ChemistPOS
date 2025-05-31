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

// Validation schema using Yup (no user input fields require validation here)
const validationSchema = Yup.object({});

const SalesWiseInventoryForm = () => {
  const navigate = useNavigate();

  const initialValues = {
    salesInvoiceNo: "INV20250309", // Auto-filled
    salesDate: "2025-03-09", // Auto-filled (current date as per your setup)
    productName: "Sample Product", // Auto-filled
    quantitySold: 50, // Auto-filled
    remainingStock: 0, // Auto-calculated
  };

  // Sample initial stock data (replace with real data from API/database)
  const initialStock = 200; // Example initial stock for the product

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form Values:", values);
    setTimeout(() => {
      alert("Sales-wise inventory details submitted successfully!");
      setSubmitting(false);
      navigate("/sales-inventory-list"); // Adjust the navigation path as needed
    }, 1000);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Inventory Management" breadcrumbItem="Sales-Wise Inventory" />
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
                      Sales-Wise Inventory
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
                    {({ values, setFieldValue, isSubmitting }) => {
                      // Calculate Remaining Stock when quantitySold changes
                      useEffect(() => {
                        const remaining = initialStock - values.quantitySold;
                        setFieldValue("remainingStock", remaining >= 0 ? remaining : 0); // Ensure no negative stock
                      }, [values.quantitySold, setFieldValue]);

                      return (
                        <Form>
                          <Row className="g-4">
                            {/* Sales Invoice No. (Auto) */}
                            <Col md="6">
                              <FormGroup>
                                <Label
                                  for="salesInvoiceNo"
                                  className="fw-bold text-dark"
                                  style={{ fontSize: "14px" }}
                                >
                                  Sales Invoice No.
                                </Label>
                                <Field
                                  as={Input}
                                  type="text"
                                  name="salesInvoiceNo"
                                  id="salesInvoiceNo"
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

                            {/* Sales Date (Auto) */}
                            <Col md="6">
                              <FormGroup>
                                <Label
                                  for="salesDate"
                                  className="fw-bold text-dark"
                                  style={{ fontSize: "14px" }}
                                >
                                  Sales Date
                                </Label>
                                <Field
                                  as={Input}
                                  type="date"
                                  name="salesDate"
                                  id="salesDate"
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

                            {/* Quantity Sold (Auto) */}
                            <Col md="6">
                              <FormGroup>
                                <Label
                                  for="quantitySold"
                                  className="fw-bold text-dark"
                                  style={{ fontSize: "14px" }}
                                >
                                  Quantity Sold
                                </Label>
                                <Field
                                  as={Input}
                                  type="number"
                                  name="quantitySold"
                                  id="quantitySold"
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

                            {/* Remaining Stock (Auto Calculation) */}
                            <Col md="6">
                              <FormGroup>
                                <Label
                                  for="remainingStock"
                                  className="fw-bold text-dark"
                                  style={{ fontSize: "14px" }}
                                >
                                  Remaining Stock
                                </Label>
                                <Field
                                  as={Input}
                                  type="number"
                                  name="remainingStock"
                                  id="remainingStock"
                                  disabled
                                  className="form-control"
                                  style={{
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    padding: "10px",
                                    backgroundColor: values.remainingStock <= 10 ? "#f8d7da" : "#e9ecef", // Highlight low stock
                                  }}
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

export default SalesWiseInventoryForm;