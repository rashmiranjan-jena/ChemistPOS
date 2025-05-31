import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { postDrugLicenceDetails } from "../../ApiService/BusinessOverview/DrugLicence";

// Validation schema using Yup
const validationSchema = Yup.object({
  issuedBy: Yup.string()
    .required("Licence Issued By is required")
    .min(2, "Must be at least 2 characters")
    .max(100, "Cannot exceed 100 characters"),
  licenceType: Yup.string()
    .required("Type of Licence is required")
    .oneOf(["Retail", "Wholesale", "Manufacturing", "Import"], "Invalid Licence Type"),
  licenceNo: Yup.string()
    .required("Licence Number is required")
    
    .min(5, "Must be at least 5 characters")
    
});

const DrugLicenceDetailsForm = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      issuedBy: "",
      licenceType: "",
      licenceNo: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Structure payload as key-value object
        const payload = {
          licence_issued_by: values.issuedBy,
          type_of_licence: values.licenceType,
          licence_no: values.licenceNo,
        };

        await postDrugLicenceDetails(payload);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Drug Licence details submitted successfully!",
          confirmButtonColor: "#007bff",
        }).then(() => {
          navigate("/drug-licence-details-list");
        });
      } catch (error) {
        console.error("Submission error:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to submit drug licence details. Please try again.",
          confirmButtonColor: "#dc3545",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Licence Management" breadcrumbItem="Add Drug Licence Details" />
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
                      Add Drug Licence Details
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

                  <div>
                    <Row className="g-4">
                      {/* Licence Issued By */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="issuedBy" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Licence Issued By <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="issuedBy"
                            id="issuedBy"
                            placeholder="Enter issuing authority"
                            value={formik.values.issuedBy}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${formik.touched.issuedBy && formik.errors.issuedBy ? "is-invalid" : ""}`}
                            style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                          />
                          {formik.touched.issuedBy && formik.errors.issuedBy && (
                            <div className="invalid-feedback">{formik.errors.issuedBy}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Type of Licence */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="licenceType" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Type of Licence <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="select"
                            name="licenceType"
                            id="licenceType"
                            value={formik.values.licenceType}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${formik.touched.licenceType && formik.errors.licenceType ? "is-invalid" : ""}`}
                            style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                          >
                            <option value="">Select Licence Type</option>
                            <option value="Retail">Retail</option>
                            <option value="Wholesale">Wholesale</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Import">Import</option>
                          </Input>
                          {formik.touched.licenceType && formik.errors.licenceType && (
                            <div className="invalid-feedback">{formik.errors.licenceType}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Licence No */}
                      <Col md="6">
                        <FormGroup>
                          <Label for="licenceNo" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            Licence No. <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="licenceNo"
                            id="licenceNo"
                            placeholder="Enter licence number"
                            value={formik.values.licenceNo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${formik.touched.licenceNo && formik.errors.licenceNo ? "is-invalid" : ""}`}
                            style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                          />
                          {formik.touched.licenceNo && formik.errors.licenceNo && (
                            <div className="invalid-feedback">{formik.errors.licenceNo}</div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Submit Button */}
                      <Col md="12" className="text-end">
                        <Button
                          type="button"
                          color="primary"
                          onClick={formik.handleSubmit}
                          disabled={formik.isSubmitting}
                          style={{
                            padding: "10px 25px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 10px rgba(0, 123, 255, 0.3)",
                            transition: "transform 0.3s ease",
                          }}
                          className="hover-scale"
                        >
                          {formik.isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                      </Col>
                    </Row>
                  </div>
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

export default DrugLicenceDetailsForm;