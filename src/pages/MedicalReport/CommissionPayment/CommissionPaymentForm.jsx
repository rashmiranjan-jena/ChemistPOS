import React, { useState, useEffect } from "react";
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
import Breadcrumbs from "../../../components/Common/Breadcrumb"; 
import { useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select"; 

// Validation schema using Yup
const validationSchema = Yup.object({
  mrName: Yup.string().required("MR Name is required"),
  salesReportPeriod: Yup.string()
    .required("Sales Report Period is required")
    .oneOf(["Monthly", "Quarterly"], "Invalid Sales Report Period"),
  paymentMode: Yup.string()
    .required("Payment Mode is required")
    .oneOf(["Bank Transfer", "Cheque", "Cash"], "Invalid Payment Mode"),
  paymentStatus: Yup.string()
    .required("Payment Status is required")
    .oneOf(["Pending", "Paid"], "Invalid Payment Status"),
  paymentReceipt: Yup.mixed()
    .required("Payment Receipt is required")
    .test("fileFormat", "Only PDF or image files are allowed", (value) => {
      return value && (value.type === "application/pdf" || value.type.startsWith("image/"));
    })
    .test("fileSize", "File size must be less than 5MB", (value) => {
      return value && value.size <= 5 * 1024 * 1024; // 5MB limit
    }),
});

const CommissionPaymentForm = () => {
  const navigate = useNavigate();

  // State for file upload preview
  const [fileName, setFileName] = useState("");

  // Options for MR Name (simulated from MR Master)
  const mrOptions = [
    { value: "John Doe", label: "John Doe" },
    { value: "Jane Smith", label: "Jane Smith" },
    { value: "Mike Johnson", label: "Mike Johnson" },
  ];

  // Options for Sales Report Period
  const periodOptions = [
    { value: "", label: "Select Period" },
    { value: "Monthly", label: "Monthly" },
    { value: "Quarterly", label: "Quarterly" },
  ];

  // Options for Payment Mode
  const paymentModeOptions = [
    { value: "", label: "Select Payment Mode" },
    { value: "Bank Transfer", label: "Bank Transfer" },
    { value: "Cheque", label: "Cheque" },
    { value: "Cash", label: "Cash" },
  ];

  // Options for Payment Status
  const paymentStatusOptions = [
    { value: "", label: "Select Payment Status" },
    { value: "Pending", label: "Pending" },
    { value: "Paid", label: "Paid" },
  ];

  // Simulated commission amounts (replace with API call)
  const commissionData = {
    "John Doe": {
      Monthly: 1250,
      Quarterly: 3750,
    },
    "Jane Smith": {
      Monthly: 315,
      Quarterly: 945,
    },
    "Mike Johnson": {
      Monthly: 1380,
      Quarterly: 4140,
    },
  };

  const initialValues = {
    mrName: "",
    salesReportPeriod: "",
    totalCommissionAmount: 0,
    paymentMode: "",
    paymentStatus: "",
    paymentReceipt: null,
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form Values:", values);
    setTimeout(() => {
      alert("Commission Payment submitted successfully!");
      setSubmitting(false);
      navigate("/commission-payment-list"); // Adjust the navigation path as needed
    }, 1000);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Commission Payments" breadcrumbItem="Add Commission Payment" />
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
                      Add Commission Payment
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
                    {({ values, setFieldValue, setFieldTouched, isSubmitting, errors, touched }) => {
                      // Auto-calculate total commission amount
                      useEffect(() => {
                        if (values.mrName && values.salesReportPeriod) {
                          const commission = commissionData[values.mrName]?.[values.salesReportPeriod] || 0;
                          setFieldValue("totalCommissionAmount", commission);
                        }
                      }, [values.mrName, values.salesReportPeriod, setFieldValue]);

                      return (
                        <Form>
                          <Row className="g-4">
                            {/* MR Name */}
                            <Col md="6">
                              <FormGroup>
                                <Label for="mrName" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                  Select MR
                                </Label>
                                <Select
                                  options={mrOptions}
                                  name="mrName"
                                  id="mrName"
                                  value={mrOptions.find((option) => option.value === values.mrName)}
                                  onChange={(selectedOption) => {
                                    setFieldValue("mrName", selectedOption ? selectedOption.value : "");
                                  }}
                                  onBlur={() => setFieldTouched("mrName", true)}
                                  className={errors.mrName && touched.mrName ? "is-invalid" : ""}
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      borderRadius: "8px",
                                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                      borderColor: errors.mrName && touched.mrName ? "#dc3545" : base.borderColor,
                                      "&:hover": {
                                        borderColor: errors.mrName && touched.mrName ? "#dc3545" : base.borderColor,
                                      },
                                      ...(state.isFocused && {
                                        borderColor: "#007bff",
                                        boxShadow: "0 0 8px rgba(0, 123, 255, 0.3)",
                                      }),
                                    }),
                                  }}
                                />
                                <ErrorMessage name="mrName" component="div" className="invalid-feedback" />
                              </FormGroup>
                            </Col>

                            {/* Sales Report Period */}
                            <Col md="6">
                              <FormGroup>
                                <Label for="salesReportPeriod" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                  Sales Report Period
                                </Label>
                                <Select
                                  options={periodOptions}
                                  name="salesReportPeriod"
                                  id="salesReportPeriod"
                                  value={periodOptions.find((option) => option.value === values.salesReportPeriod)}
                                  onChange={(selectedOption) => {
                                    setFieldValue("salesReportPeriod", selectedOption ? selectedOption.value : "");
                                  }}
                                  onBlur={() => setFieldTouched("salesReportPeriod", true)}
                                  className={errors.salesReportPeriod && touched.salesReportPeriod ? "is-invalid" : ""}
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      borderRadius: "8px",
                                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                      borderColor: errors.salesReportPeriod && touched.salesReportPeriod ? "#dc3545" : base.borderColor,
                                      "&:hover": {
                                        borderColor: errors.salesReportPeriod && touched.salesReportPeriod ? "#dc3545" : base.borderColor,
                                      },
                                      ...(state.isFocused && {
                                        borderColor: "#007bff",
                                        boxShadow: "0 0 8px rgba(0, 123, 255, 0.3)",
                                      }),
                                    }),
                                  }}
                                />
                                <ErrorMessage name="salesReportPeriod" component="div" className="invalid-feedback" />
                              </FormGroup>
                            </Col>

                            {/* Total Commission Amount (Auto-Calculated) */}
                            <Col md="6">
                              <FormGroup>
                                <Label className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                  Total Commission Amount
                                </Label>
                                <Input
                                  type="text"
                                  value={`₹${values.totalCommissionAmount.toLocaleString()}`}
                                  readOnly
                                  className="form-control"
                                  style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px", backgroundColor: "#f8f9fa" }}
                                />
                              </FormGroup>
                            </Col>

                            {/* Payment Mode */}
                            <Col md="6">
                              <FormGroup>
                                <Label for="paymentMode" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                  Payment Mode
                                </Label>
                                <Select
                                  options={paymentModeOptions}
                                  name="paymentMode"
                                  id="paymentMode"
                                  value={paymentModeOptions.find((option) => option.value === values.paymentMode)}
                                  onChange={(selectedOption) => {
                                    setFieldValue("paymentMode", selectedOption ? selectedOption.value : "");
                                  }}
                                  onBlur={() => setFieldTouched("paymentMode", true)}
                                  className={errors.paymentMode && touched.paymentMode ? "is-invalid" : ""}
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      borderRadius: "8px",
                                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                      borderColor: errors.paymentMode && touched.paymentMode ? "#dc3545" : base.borderColor,
                                      "&:hover": {
                                        borderColor: errors.paymentMode && touched.paymentMode ? "#dc3545" : base.borderColor,
                                      },
                                      ...(state.isFocused && {
                                        borderColor: "#007bff",
                                        boxShadow: "0 0 8px rgba(0, 123, 255, 0.3)",
                                      }),
                                    }),
                                  }}
                                />
                                <ErrorMessage name="paymentMode" component="div" className="invalid-feedback" />
                              </FormGroup>
                            </Col>

                            {/* Payment Status */}
                            <Col md="6">
                              <FormGroup>
                                <Label for="paymentStatus" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                  Payment Status
                                </Label>
                                <Select
                                  options={paymentStatusOptions}
                                  name="paymentStatus"
                                  id="paymentStatus"
                                  value={paymentStatusOptions.find((option) => option.value === values.paymentStatus)}
                                  onChange={(selectedOption) => {
                                    setFieldValue("paymentStatus", selectedOption ? selectedOption.value : "");
                                  }}
                                  onBlur={() => setFieldTouched("paymentStatus", true)}
                                  className={errors.paymentStatus && touched.paymentStatus ? "is-invalid" : ""}
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      borderRadius: "8px",
                                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                      borderColor: errors.paymentStatus && touched.paymentStatus ? "#dc3545" : base.borderColor,
                                      "&:hover": {
                                        borderColor: errors.paymentStatus && touched.paymentStatus ? "#dc3545" : base.borderColor,
                                      },
                                      ...(state.isFocused && {
                                        borderColor: "#007bff",
                                        boxShadow: "0 0 8px rgba(0, 123, 255, 0.3)",
                                      }),
                                    }),
                                  }}
                                />
                                <ErrorMessage name="paymentStatus" component="div" className="invalid-feedback" />
                              </FormGroup>
                            </Col>

                            {/* Upload Payment Receipt */}
                            <Col md="6">
                              <FormGroup>
                                <Label for="paymentReceipt" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                  Upload Payment Receipt (PDF/Image)
                                </Label>
                                <Input
                                  type="file"
                                  name="paymentReceipt"
                                  id="paymentReceipt"
                                  accept="application/pdf,image/*"
                                  onChange={(event) => {
                                    const file = event.currentTarget.files[0];
                                    setFieldValue("paymentReceipt", file);
                                    setFileName(file ? file.name : "");
                                  }}
                                  className={`form-control ${errors.paymentReceipt && touched.paymentReceipt ? "is-invalid" : ""}`}
                                  style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                                />
                                {fileName && (
                                  <div className="mt-2 text-muted" style={{ fontSize: "12px" }}>
                                    Selected File: {fileName}
                                  </div>
                                )}
                                <ErrorMessage name="paymentReceipt" component="div" className="invalid-feedback" />
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

export default CommissionPaymentForm;