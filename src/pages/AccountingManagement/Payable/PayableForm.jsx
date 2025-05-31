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
  supplierName: Yup.string().required("Supplier Name is required"),
  invoiceNo: Yup.string().required("Purchase Invoice No. is required"),
  dueDate: Yup.date()
    .required("Due Date is required")
    .min(new Date(), "Due Date cannot be in the past"),
  amountPayable: Yup.number()
    .required("Amount Payable is required")
    .min(0, "Amount Payable cannot be negative"),
  paymentStatus: Yup.string()
    .required("Payment Status is required")
    .oneOf(["Pending", "Partially Paid", "Paid"], "Invalid Payment Status"),
});

const PayableForm = () => {
  const navigate = useNavigate();

  // Sample supplier list for dropdown (replace with actual data from API)
  const suppliers = [
    { id: 1, name: "MediCorp" },
    { id: 2, name: "PharmaPlus" },
    { id: 3, name: "HealthSupplies" },
  ];

  // Initial values with sensible defaults
  const initialValues = {
    supplierName: "",
    invoiceNo: `INV-${Date.now()}`, // Auto-generated example
    dueDate: new Date().toISOString().split("T")[0], // Today's date
    amountPayable: "",
    paymentStatus: "Pending", // Default status
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form Values:", values);
    setTimeout(() => {
      alert("Payable details submitted successfully!");
      setSubmitting(false);
      navigate("/payable-list"); // Adjust the navigation path as needed
    }, 1000);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Finance" breadcrumbItem="Add Payable" />
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
                      Add Payable
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
                                  <option key={supplier.id} value={supplier.name}>
                                    {supplier.name}
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage name="supplierName" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>

                          {/* Purchase Invoice No. (Auto) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="invoiceNo" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Purchase Invoice No.
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

                          {/* Due Date (Auto) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="dueDate" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Due Date
                              </Label>
                              <Field
                                as={Input}
                                type="date"
                                name="dueDate"
                                id="dueDate"
                                className={`form-control ${errors.dueDate && touched.dueDate ? "is-invalid" : ""}`}
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                              <ErrorMessage name="dueDate" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>

                          {/* Amount Payable (Auto) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="amountPayable" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Amount Payable ($)
                              </Label>
                              <Field
                                as={Input}
                                type="number"
                                name="amountPayable"
                                id="amountPayable"
                                placeholder="Enter Amount"
                                className={`form-control ${errors.amountPayable && touched.amountPayable ? "is-invalid" : ""}`}
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                              <ErrorMessage name="amountPayable" component="div" className="invalid-feedback" />
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

export default PayableForm;