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
  supplierName: Yup.string()
    .required("Supplier Name is required"),
  paymentMode: Yup.string()
    .required("Payment Mode is required")
    .oneOf(["Cash", "Card", "UPI", "Bank Transfer"], "Invalid Payment Mode"),
  amountPaid: Yup.number()
    .required("Amount Paid is required")
    .min(0, "Amount cannot be negative"),
  referenceNo: Yup.string().when("paymentMode", {
    is: (mode) => ["UPI", "Bank Transfer"].includes(mode),
    then: Yup.string().required("Reference No. is required for UPI/Bank Transfer"),
    otherwise: Yup.string().notRequired(),
  }),
});

const PaidAmountForm = () => {
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

  // Sample supplier list (replace with actual data from your API or state)
  const suppliers = [
    "MediCorp",
    "PharmaPlus",
    "HealthSupplies",
    "BioLabs",
  ];

  const initialValues = {
    dateTime: currentDateTime,
    supplierName: "",
    paymentMode: "",
    invoiceNo: generateInvoiceNo(),
    amountPaid: "",
    referenceNo: "",
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form Values:", values);
    setTimeout(() => {
      alert("Paid Amount submitted successfully!");
      setSubmitting(false);
      navigate("/paid-amount-list"); // Adjust the navigation path as needed
    }, 1000);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Payments" breadcrumbItem="Add Paid Amount" />
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
                      Add Paid Amount
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

                          {/* Supplier Name (Dropdown) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="supplierName" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Supplier Name
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="supplierName"
                                id="supplierName"
                                className={`form-control ${errors.supplierName && touched.supplierName ? "is-invalid" : ""}`}
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              >
                                <option value="">Select Supplier</option>
                                {suppliers.map((supplier) => (
                                  <option key={supplier} value={supplier}>
                                    {supplier}
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage name="supplierName" component="div" className="invalid-feedback" />
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

                          {/* Amount Paid (Input) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="amountPaid" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Amount Paid
                              </Label>
                              <Field
                                as={Input}
                                type="number"
                                name="amountPaid"
                                id="amountPaid"
                                placeholder="Enter amount paid"
                                className={`form-control ${errors.amountPaid && touched.amountPaid ? "is-invalid" : ""}`}
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                              <ErrorMessage name="amountPaid" component="div" className="invalid-feedback" />
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

export default PaidAmountForm;