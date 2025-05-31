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
    .required("Customer Name is required"),
  paymentStatus: Yup.string()
    .required("Payment Status is required")
    .oneOf(["Pending", "Partially Paid", "Paid"], "Invalid Payment Status"),
});

const ReceivableForm = () => {
  const navigate = useNavigate();

  // Generate auto values for Invoice No., Due Date, and Amount Receivable
  const generateInvoiceNo = () => `INV${Date.now().toString().slice(-6)}`; // Simple auto-generated invoice number
  const generateDueDate = () => {
    const due = new Date();
    due.setDate(due.getDate() + 7); // Default due date is 7 days from now
    return due.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };
  const generateAmountReceivable = () => (Math.random() * 10000).toFixed(2); // Random amount for demo

  // Sample customer list (B2B and Corporate only, replace with actual data from your API or state)
  const customers = [
    "ABC Corp (Corporate)",
    "XYZ Ltd (B2B)",
    "DEF Inc (Corporate)",
    "GHI Enterprises (B2B)",
  ];

  const initialValues = {
    customerName: "",
    invoiceNo: generateInvoiceNo(),
    dueDate: generateDueDate(),
    amountReceivable: generateAmountReceivable(),
    paymentStatus: "",
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form Values:", values);
    setTimeout(() => {
      alert("Receivable submitted successfully!");
      setSubmitting(false);
      navigate("/receivable-list"); // Adjust the navigation path as needed
    }, 1000);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Payments" breadcrumbItem="Add Receivable" />
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
                      Add Receivable
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
                                <option value="">Select Customer</option>
                                {customers.map((customer) => (
                                  <option key={customer} value={customer}>
                                    {customer}
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage name="customerName" component="div" className="invalid-feedback" />
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

                          {/* Due Date (Auto) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="dueDate" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Due Date
                              </Label>
                              <Input
                                type="date"
                                name="dueDate"
                                id="dueDate"
                                value={values.dueDate}
                                disabled
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                            </FormGroup>
                          </Col>

                          {/* Amount Receivable (Auto) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="amountReceivable" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Amount Receivable
                              </Label>
                              <Input
                                type="number"
                                name="amountReceivable"
                                id="amountReceivable"
                                value={values.amountReceivable}
                                disabled
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                            </FormGroup>
                          </Col>

                          {/* Payment Status (Dropdown) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="paymentStatus" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Payment Status
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="paymentStatus"
                                id="paymentStatus"
                                className={`form-control ${errors.paymentStatus && touched.paymentStatus ? "is-invalid" : ""}`}
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              >
                                <option value="">Select Payment Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Partially Paid">Partially Paid</option>
                                <option value="Paid">Paid</option>
                              </Field>
                              <ErrorMessage name="paymentStatus" component="div" className="invalid-feedback" />
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

export default ReceivableForm;