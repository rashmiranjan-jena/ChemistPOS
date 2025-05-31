import React from "react";
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
  date: Yup.date().required("Date is required"),
  invoiceNo: Yup.string().required("Invoice No. is required"),
  gstCollected: Yup.number()
    .required("GST Collected is required")
    .min(0, "GST Collected cannot be negative"),
});

const TaxOutputForm = () => {
  const navigate = useNavigate();

  // Initial values with sensible defaults
  const initialValues = {
    date: new Date().toISOString().slice(0, 10), // Current date in YYYY-MM-DD format
    invoiceNo: "",
    gstCollected: "", // Could be auto-filled from sales data in a real scenario
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form Values:", values);
    setTimeout(() => {
      alert("Tax Output details submitted successfully!");
      setSubmitting(false);
      navigate("/tax-output-list"); // Adjust the navigation path as needed
    }, 1000);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Tax Management" breadcrumbItem="Add Tax Output" />
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
                      Add Tax Output
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
                    {({ values, setFieldValue, isSubmitting, errors, touched }) => (
                      <Form>
                        <Row className="g-4">
                          {/* Date */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="date" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Date
                              </Label>
                              <Field
                                as={Input}
                                type="date"
                                name="date"
                                id="date"
                                className={`form-control ${errors.date && touched.date ? "is-invalid" : ""}`}
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                              <ErrorMessage name="date" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>

                          {/* Invoice No. */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="invoiceNo" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Invoice No.
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="invoiceNo"
                                id="invoiceNo"
                                placeholder="Enter Invoice No."
                                className={`form-control ${errors.invoiceNo && touched.invoiceNo ? "is-invalid" : ""}`}
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                              <ErrorMessage name="invoiceNo" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>

                          {/* GST Collected (Auto - Editable for now) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="gstCollected" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                GST Collected ($)
                              </Label>
                              <Field
                                as={Input}
                                type="number"
                                name="gstCollected"
                                id="gstCollected"
                                placeholder="Enter GST Collected"
                                className={`form-control ${errors.gstCollected && touched.gstCollected ? "is-invalid" : ""}`}
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                              <ErrorMessage name="gstCollected" component="div" className="invalid-feedback" />
                              <small className="text-muted">
                                Note: This could be auto-filled from sales invoice data in a real scenario.
                              </small>
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
                    )}
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

export default TaxOutputForm;