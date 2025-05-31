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
  customerName: Yup.string()
    .required("Customer Name is required")
    .oneOf(["B2C", "B2B", "Corporate"], "Invalid Customer Type"),
  paymentMode: Yup.string()
    .required("Payment Mode is required")
    .oneOf(["Cash", "Card", "UPI", "Bank Transfer"], "Invalid Payment Mode"),
  amountReceived: Yup.number()
    .required("Amount Received is required")
    .min(0, "Amount cannot be negative"),
  referenceNo: Yup.string().when("paymentMode", {
    is: (mode) => ["UPI", "Bank Transfer"].includes(mode),
    then: Yup.string().required("Reference No. is required for UPI/Bank Transfer"),
    otherwise: Yup.string().notRequired(),
  }),
});

const ReceivedAmountForm = () => {
  const navigate = useNavigate();

  // Generate auto values for Date & Time and Invoice No.
  const currentDateTime = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const generateInvoiceNo = () => `INV${Date.now().toString().slice(-6)}`; // Simple auto-generated invoice number

  const initialValues = {
    dateTime: currentDateTime,
    invoiceNo: generateInvoiceNo(),
    customerName: "",
    paymentMode: "",
    amountReceived: "",
    referenceNo: "",
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form Values:", values);
    setTimeout(() => {
      alert("Received Amount submitted successfully!");
      setSubmitting(false);
      navigate("/received-amount-list"); // Adjust the navigation path as needed
    }, 1000);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Payments" breadcrumbItem="Add Received Amount" />
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
                      Add Received Amount
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
                    {({ values, isSubmitting, errors, touched }) => (
                      <Form>
                        <Row className="g-4">
                          {/* Date & Time (Auto) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="dateTime" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Date & Time
                              </Label>
                              <Input
                                type="text"
                                name="dateTime"
                                id="dateTime"
                                value={values.dateTime}
                                disabled
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                            </FormGroup>
                          </Col>

                          {/* Invoice No. (Auto) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="invoiceNo" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Invoice No.
                              </Label>
                              <Input
                                type="text"
                                name="invoiceNo"
                                id="invoiceNo"
                                value={values.invoiceNo}
                                disabled
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                            </FormGroup>
                          </Col>

                          {/* Customer Name (Dropdown) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="customerName" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Customer Name
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="customerName"
                                id="customerName"
                                className={`form-control ${errors.customerName && touched.customerName ? "is-invalid" : ""}`}
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              >
                                <option value="">Select Customer Type</option>
                                <option value="B2C">B2C</option>
                                <option value="B2B">B2B</option>
                                <option value="Corporate">Corporate</option>
                              </Field>
                              <ErrorMessage name="customerName" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>

                          {/* Payment Mode (Dropdown) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="paymentMode" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Payment Mode
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="paymentMode"
                                id="paymentMode"
                                className={`form-control ${errors.paymentMode && touched.paymentMode ? "is-invalid" : ""}`}
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              >
                                <option value="">Select Payment Mode</option>
                                <option value="Cash">Cash</option>
                                <option value="Card">Card</option>
                                <option value="UPI">UPI</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                              </Field>
                              <ErrorMessage name="paymentMode" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>

                          {/* Amount Received (Input) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="amountReceived" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Amount Received
                              </Label>
                              <Field
                                as={Input}
                                type="number"
                                name="amountReceived"
                                id="amountReceived"
                                placeholder="Enter amount received"
                                className={`form-control ${errors.amountReceived && touched.amountReceived ? "is-invalid" : ""}`}
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                              <ErrorMessage name="amountReceived" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>

                          {/* Reference No. (Conditional Input) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="referenceNo" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Reference No.
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="referenceNo"
                                id="referenceNo"
                                placeholder="Enter reference no. (if applicable)"
                                disabled={["Cash", "Card"].includes(values.paymentMode)}
                                className={`form-control ${errors.referenceNo && touched.referenceNo ? "is-invalid" : ""}`}
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                              <ErrorMessage name="referenceNo" component="div" className="invalid-feedback" />
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

export default ReceivedAmountForm;