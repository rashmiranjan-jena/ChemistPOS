import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Label,
  Row,
  Input,
} from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb"; 
import { useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select"; 
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 

// Validation schema using Yup
const validationSchema = Yup.object({
  mrName: Yup.string().required("MR Name is required"),
  dateRange: Yup.object()
    .shape({
      startDate: Yup.date().required("Start date is required"),
      endDate: Yup.date()
        .required("End date is required")
        .min(Yup.ref("startDate"), "End date must be after start date"),
    })
    .required("Date range is required"),
  associatedBrands: Yup.array()
    .min(1, "At least one brand must be selected")
    .required("Associated Brands are required"),
});

const MrSalesReportForm = () => {
  const navigate = useNavigate();

  // State for date range
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  // Options for MR Name (simulated from MR Master)
  const mrOptions = [
    { value: "John Doe", label: "John Doe" },
    { value: "Jane Smith", label: "Jane Smith" },
    { value: "Mike Johnson", label: "Mike Johnson" },
  ];

  // Options for Associated Brands (multi-select)
  const brandOptions = [
    { value: "Brand A", label: "Brand A" },
    { value: "Brand B", label: "Brand B" },
    { value: "Brand C", label: "Brand C" },
    { value: "Brand D", label: "Brand D" },
  ];

  // Simulated sales data (replace with API call)
  const salesData = {
    "John Doe": {
      "Brand A": 10000,
      "Brand B": 15000,
      "Brand C": 8000,
      "Brand D": 12000,
    },
    "Jane Smith": {
      "Brand A": 9000,
      "Brand B": 11000,
      "Brand C": 7000,
      "Brand D": 13000,
    },
    "Mike Johnson": {
      "Brand A": 12000,
      "Brand B": 14000,
      "Brand C": 9000,
      "Brand D": 11000,
    },
  };

  // Simulated commission rates (fetched from MR Master)
  const commissionRates = {
    "John Doe": 5, // 5%
    "Jane Smith": 4.5, // 4.5%
    "Mike Johnson": 6, // 6%
  };

  const initialValues = {
    mrName: "",
    dateRange: { startDate: null, endDate: null },
    associatedBrands: [],
    totalSales: 0,
    commissionRate: 0,
    commissionAmount: 0,
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form Values:", values);
    setTimeout(() => {
      alert("MR Sales Report submitted successfully!");
      setSubmitting(false);
      navigate("/mr-sales-report-list"); // Adjust the navigation path as needed
    }, 1000);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="MR Sales Report" breadcrumbItem="Add MR Sales Report" />
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
                      Add MR Sales Report
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
                      // Auto-calculate totals and commission
                      useEffect(() => {
                        if (values.mrName && values.associatedBrands.length > 0) {
                          const mrSales = salesData[values.mrName] || {};
                          const totalSales = values.associatedBrands.reduce(
                            (sum, brand) => sum + (mrSales[brand] || 0),
                            0
                          );
                          const commissionRate = commissionRates[values.mrName] || 0;
                          const commissionAmount = (totalSales * commissionRate) / 100;

                          setFieldValue("totalSales", totalSales);
                          setFieldValue("commissionRate", commissionRate);
                          setFieldValue("commissionAmount", commissionAmount);
                        }
                      }, [values.mrName, values.associatedBrands, setFieldValue]); // Add setFieldValue to dependencies

                      return (
                        <Form>
                          <Row className="g-4">
                            {/* MR Name */}
                            <Col md="6">
                              <FormGroup>
                                <Label for="mrName" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                  MR Name
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

                            {/* Date Range */}
                            <Col md="6">
                              <FormGroup>
                                <Label for="dateRange" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                  Date Range
                                </Label>
                                <DatePicker
                                  selectsRange={true}
                                  startDate={startDate}
                                  endDate={endDate}
                                  onChange={(update) => {
                                    setDateRange(update);
                                    setFieldValue("dateRange", { startDate: update[0], endDate: update[1] });
                                  }}
                                  onBlur={() => setFieldTouched("dateRange", true)}
                                  dateFormat="dd/MM/yyyy"
                                  placeholderText="Select Date Range"
                                  className={`form-control ${errors.dateRange && touched.dateRange ? "is-invalid" : ""}`}
                                  style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                                />
                                <ErrorMessage name="dateRange.startDate" component="div" className="invalid-feedback" />
                                <ErrorMessage name="dateRange.endDate" component="div" className="invalid-feedback" />
                              </FormGroup>
                            </Col>

                            {/* Associated Brands (Multi-Select) */}
                            <Col md="6">
                              <FormGroup>
                                <Label for="associatedBrands" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                  Associated Brands
                                </Label>
                                <Select
                                  isMulti
                                  options={brandOptions}
                                  name="associatedBrands"
                                  id="associatedBrands"
                                  value={brandOptions.filter((option) => values.associatedBrands.includes(option.value))}
                                  onChange={(selectedOptions) => {
                                    setFieldValue("associatedBrands", selectedOptions ? selectedOptions.map((option) => option.value) : []);
                                  }}
                                  onBlur={() => setFieldTouched("associatedBrands", true)}
                                  className={errors.associatedBrands && touched.associatedBrands ? "is-invalid" : ""}
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      borderRadius: "8px",
                                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                      borderColor: errors.associatedBrands && touched.associatedBrands ? "#dc3545" : base.borderColor,
                                      "&:hover": {
                                        borderColor: errors.associatedBrands && touched.associatedBrands ? "#dc3545" : base.borderColor,
                                      },
                                      ...(state.isFocused && {
                                        borderColor: "#007bff",
                                        boxShadow: "0 0 8px rgba(0, 123, 255, 0.3)",
                                      }),
                                    }),
                                    multiValue: (base) => ({
                                      ...base,
                                      backgroundColor: "#007bff",
                                      color: "#fff",
                                    }),
                                    multiValueLabel: (base) => ({
                                      ...base,
                                      color: "#fff",
                                    }),
                                  }}
                                />
                                <ErrorMessage name="associatedBrands" component="div" className="invalid-feedback" />
                              </FormGroup>
                            </Col>

                            {/* Total Sales for MR’s Brands (Auto-Calculated) */}
                            <Col md="6">
                              <FormGroup>
                                <Label className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                  Total Sales for MR’s Brands
                                </Label>
                                <Input
                                  type="text"
                                  value={`₹${values.totalSales.toLocaleString()}`}
                                  readOnly
                                  className="form-control"
                                  style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px", backgroundColor: "#f8f9fa" }}
                                />
                              </FormGroup>
                            </Col>

                            {/* Commission Rate (Auto-Fetched) */}
                            <Col md="6">
                              <FormGroup>
                                <Label className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                  Commission Rate (%)
                                </Label>
                                <Input
                                  type="text"
                                  value={`${values.commissionRate}%`}
                                  readOnly
                                  className="form-control"
                                  style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px", backgroundColor: "#f8f9fa" }}
                                />
                              </FormGroup>
                            </Col>

                            {/* Commission Amount (Auto-Calculated) */}
                            <Col md="6">
                              <FormGroup>
                                <Label className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                  Commission Amount
                                </Label>
                                <Input
                                  type="text"
                                  value={`₹${values.commissionAmount.toLocaleString()}`}
                                  readOnly
                                  className="form-control"
                                  style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px", backgroundColor: "#f8f9fa" }}
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

export default MrSalesReportForm;