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
  counterName: Yup.string().required("Counter Name is required"),
  totalCashCollected: Yup.number()
    .required("Total Cash Collected is required")
    .min(0, "Total Cash Collected cannot be negative"),
  notes: Yup.string().max(500, "Notes cannot exceed 500 characters"),
});

const DayCloseProcessForm = () => {
  const navigate = useNavigate();

  // Sample counters for dropdown (replace with actual data from your API or state)
  const counters = ["Counter 1", "Counter 2", "Counter 3"];

  // Initial values with some fields auto-populated (mock data)
  const initialValues = {
    counterName: "",
    dateTime: new Date().toISOString().slice(0, 16), // Auto: Current date & time
    totalSales: 15000, // Auto: Mock from Daily Sales Report
    totalCashCollected: "",
    totalCreditSales: 3000, // Auto: Mock calculation
    totalGSTCollected: 2700, // Auto: Mock calculation
    totalDiscountsGiven: 500, // Auto: Mock calculation
    totalExpenses: 2000, // Auto: Mock calculation
    closingCashBalance: 0, // Auto: Calculated on submit
    notes: "",
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const closingCashBalance =
      values.totalCashCollected - values.totalExpenses;
    const updatedValues = { ...values, closingCashBalance };

    console.log("Form Values:", updatedValues);
    setTimeout(() => {
      alert("Day Close Process submitted successfully!");
      setSubmitting(false);
      navigate("/day-close-process-list"); 
    }, 1000);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Finance" breadcrumbItem="Add Day Close Process" />
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
                      Add Day Close Process
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
                          {/* Counter Name (Dropdown - Auto) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="counterName" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Counter Name
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="counterName"
                                id="counterName"
                                className={`form-control ${errors.counterName && touched.counterName ? "is-invalid" : ""}`}
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              >
                                <option value="">Select Counter</option>
                                {counters.map((counter) => (
                                  <option key={counter} value={counter}>
                                    {counter}
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage name="counterName" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>

                          {/* Date & Time (Auto) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="dateTime" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Date & Time
                              </Label>
                              <Field
                                as={Input}
                                type="datetime-local"
                                name="dateTime"
                                id="dateTime"
                                disabled
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                            </FormGroup>
                          </Col>

                          {/* Total Sales (Auto - from Daily Sales Report) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="totalSales" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Total Sales
                              </Label>
                              <Field
                                as={Input}
                                type="number"
                                name="totalSales"
                                id="totalSales"
                                disabled
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                            </FormGroup>
                          </Col>

                          {/* Total Cash Collected (Input) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="totalCashCollected" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Total Cash Collected
                              </Label>
                              <Field
                                as={Input}
                                type="number"
                                name="totalCashCollected"
                                id="totalCashCollected"
                                placeholder="Enter total cash collected"
                                className={`form-control ${errors.totalCashCollected && touched.totalCashCollected ? "is-invalid" : ""}`}
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                              <ErrorMessage name="totalCashCollected" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>

                          {/* Total Credit Sales (Auto) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="totalCreditSales" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Total Credit Sales
                              </Label>
                              <Field
                                as={Input}
                                type="number"
                                name="totalCreditSales"
                                id="totalCreditSales"
                                disabled
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                            </FormGroup>
                          </Col>

                          {/* Total GST Collected (Auto) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="totalGSTCollected" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Total GST Collected
                              </Label>
                              <Field
                                as={Input}
                                type="number"
                                name="totalGSTCollected"
                                id="totalGSTCollected"
                                disabled
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                            </FormGroup>
                          </Col>

                          {/* Total Discounts Given (Auto) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="totalDiscountsGiven" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Total Discounts Given
                              </Label>
                              <Field
                                as={Input}
                                type="number"
                                name="totalDiscountsGiven"
                                id="totalDiscountsGiven"
                                disabled
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                            </FormGroup>
                          </Col>

                          {/* Total Expenses (Auto) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="totalExpenses" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Total Expenses
                              </Label>
                              <Field
                                as={Input}
                                type="number"
                                name="totalExpenses"
                                id="totalExpenses"
                                disabled
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                            </FormGroup>
                          </Col>

                          {/* Closing Cash Balance (Auto) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="closingCashBalance" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Closing Cash Balance
                              </Label>
                              <Field
                                as={Input}
                                type="number"
                                name="closingCashBalance"
                                id="closingCashBalance"
                                disabled
                                value={values.totalCashCollected - values.totalExpenses || 0} // Real-time calculation
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                            </FormGroup>
                          </Col>

                          {/* Notes (Optional) */}
                          <Col md="12">
                            <FormGroup>
                              <Label for="notes" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Notes (Optional)
                              </Label>
                              <Field
                                as={Input}
                                type="textarea"
                                name="notes"
                                id="notes"
                                placeholder="Enter any additional notes"
                                className={`form-control ${errors.notes && touched.notes ? "is-invalid" : ""}`}
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                              <ErrorMessage name="notes" component="div" className="invalid-feedback" />
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
                              {isSubmitting ? "Submitting..." : "Day Close"}
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

export default DayCloseProcessForm;