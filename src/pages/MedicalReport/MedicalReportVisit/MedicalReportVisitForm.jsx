import React, { useState } from "react";
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
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";

// Validation schema using Yup
const validationSchema = Yup.object({
  mrName: Yup.string().required("MR Name is required"),
  discussionNotes: Yup.string().required("Discussion Notes are required"),
  requestedOrders: Yup.string().required("Requested Orders are required"),
  nextVisitDate: Yup.date().required("Next Visit Date is required").nullable(),
  mrDocuments: Yup.mixed()
    .required("MR Documents are required")
    .test("fileFormat", "Only PDF or image files are allowed", (value) => {
      return value && (value.type === "application/pdf" || value.type.startsWith("image/"));
    })
    .test("fileSize", "File size must be less than 5MB", (value) => {
      return value && value.size <= 5 * 1024 * 1024; // 5MB limit
    }),
});

const MedicalReportVisitForm = () => {
  const navigate = useNavigate();

  // State for file upload preview
  const [fileName, setFileName] = useState("");

  // State for Next Visit Date
  const [nextVisitDate, setNextVisitDate] = useState(null);

  // Options for MR Name (simulated from MR Master)
  const mrOptions = [
    { value: "John Doe", label: "John Doe" },
    { value: "Jane Smith", label: "Jane Smith" },
    { value: "Mike Johnson", label: "Mike Johnson" },
  ];

  // Auto-generated Visit Date & Time (current date and time)
  const currentDateTime = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const initialValues = {
    mrName: "",
    visitDateTime: currentDateTime,
    discussionNotes: "",
    requestedOrders: "",
    nextVisitDate: null,
    mrDocuments: null,
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form Values:", values);
    setTimeout(() => {
      alert("Medical Report Visit submitted successfully!");
      setSubmitting(false);
      navigate("/medical-report-visit-list"); 
    }, 1000);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Medical Report Visits" breadcrumbItem="Add Medical Report Visit" />
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
                      Add Medical Report Visit
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
                    {({ values, setFieldValue, setFieldTouched, isSubmitting, errors, touched }) => (
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

                          {/* Visit Date & Time (Auto) */}
                          <Col md="6">
                            <FormGroup>
                              <Label className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Visit Date & Time
                              </Label>
                              <Input
                                type="text"
                                value={values.visitDateTime}
                                readOnly
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px", backgroundColor: "#f8f9fa" }}
                              />
                            </FormGroup>
                          </Col>

                          {/* Discussion Notes */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="discussionNotes" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Discussion Notes
                              </Label>
                              <Field
                                as="textarea"
                                name="discussionNotes"
                                id="discussionNotes"
                                rows="4"
                                className={`form-control ${errors.discussionNotes && touched.discussionNotes ? "is-invalid" : ""}`}
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                              <ErrorMessage name="discussionNotes" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>

                          {/* Requested Orders */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="requestedOrders" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Requested Orders
                              </Label>
                              <Field
                                as="textarea"
                                name="requestedOrders"
                                id="requestedOrders"
                                rows="4"
                                className={`form-control ${errors.requestedOrders && touched.requestedOrders ? "is-invalid" : ""}`}
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                              <ErrorMessage name="requestedOrders" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>

                          {/* Next Visit Date */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="nextVisitDate" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Next Visit Date
                              </Label>
                              <DatePicker
                                selected={nextVisitDate}
                                onChange={(date) => {
                                  setNextVisitDate(date);
                                  setFieldValue("nextVisitDate", date);
                                }}
                                onBlur={() => setFieldTouched("nextVisitDate", true)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Select Next Visit Date"
                                className={`form-control ${errors.nextVisitDate && touched.nextVisitDate ? "is-invalid" : ""}`}
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                                minDate={new Date()} // Prevent selecting past dates
                              />
                              <ErrorMessage name="nextVisitDate" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>

                          {/* Attach MR Documents */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="mrDocuments" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Attach MR Documents (PDF/Image)
                              </Label>
                              <Input
                                type="file"
                                name="mrDocuments"
                                id="mrDocuments"
                                accept="application/pdf,image/*"
                                onChange={(event) => {
                                  const file = event.currentTarget.files[0];
                                  setFieldValue("mrDocuments", file);
                                  setFileName(file ? file.name : "");
                                }}
                                className={`form-control ${errors.mrDocuments && touched.mrDocuments ? "is-invalid" : ""}`}
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                              {fileName && (
                                <div className="mt-2 text-muted" style={{ fontSize: "12px" }}>
                                  Selected File: {fileName}
                                </div>
                              )}
                              <ErrorMessage name="mrDocuments" component="div" className="invalid-feedback" />
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

export default MedicalReportVisitForm;