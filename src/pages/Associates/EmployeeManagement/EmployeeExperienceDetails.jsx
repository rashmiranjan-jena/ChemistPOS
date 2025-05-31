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
import { useNavigate,useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import {
  addEmployeeExperienceDetails,
  getEmployeeExperienceDetailsById,
  updateEmployeeExperienceDetails,
} from "../../../ApiService/Associats/Employee";

// Validation schema with all fields optional
const validationSchema = Yup.object({
  previousCompanies: Yup.string()
    .min(3, "Company name must be at least 3 characters")
    .nullable(),
  designation: Yup.string()
    .min(2, "Designation must be at least 2 characters")
    .nullable(),
  experienceDuration: Yup.string()
    .matches(
      /^\d+(\.\d{1,2})?\s*(years|months)$/i,
      "Experience Duration must be in the format: 'X years' or 'X months' (e.g., '2 years', '18 months')"
    )
    .nullable(),
});

const EmployeeExperienceDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);

  useEffect(() => {
    console.log("Location state:", location.state);
    if (location.state?.emp_id) {
      // Edit mode: Use emp_id for editing
      setIsEditMode(true);
      setEmployeeId(location.state.emp_id);
      fetchEmployeeExperienceDetails(location.state.emp_id);
    } else if (location.state?.id) {
      // Create mode: Store id for creating new employee details
      setIsEditMode(false);
      setEmployeeId(location.state.id);
    }
  }, [location.state]);

  const fetchEmployeeExperienceDetails = async (id) => {
    try {
      const data = await getEmployeeExperienceDetailsById(id);
      formik.setValues({
        previousCompanies: data?.experience_details?.previous_companies || "",
        designation: data?.experience_details?.designation || "",
        experienceDuration: data?.experience_details?.experience_duration || "",
      });
    } catch (error) {
      console.error("Error fetching employee experience details:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to fetch employee experience details.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const initialValues = {
    previousCompanies: "",
    designation: "",
    experienceDuration: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log(
          "Submitting form with values:",
          values,
          "isEditMode:",
          isEditMode,
          "employeeId:",
          employeeId
        );

        // Create JSON object with only non-empty fields
        const experience_details = {};
        if (values.previousCompanies) {
          experience_details.previous_companies = values.previousCompanies;
        }
        if (values.designation) {
          experience_details.designation = values.designation;
        }
        if (values.experienceDuration) {
          experience_details.experience_duration = values.experienceDuration;
        }

        const payload = { experience_details };

        console.log("JSON payload:", payload);

        let response;
        if (isEditMode) {
          response = await updateEmployeeExperienceDetails(employeeId, payload);
          Swal.fire({
            title: "Employee Experience Details Updated!",
            text: "The employee experience details have been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });
          if (response) {
          formik.resetForm();
          navigate("/add-new-employee-list");
        }
        } else {
          response = await addEmployeeExperienceDetails(payload, employeeId);
          Swal.fire({
            title: "Employee Experience Details Added!",
            text:
              response?.message ||
              "Employee experience details added successfully!",
            icon: "success",
            confirmButtonText: "OK",
          });
          if (response) {
          formik.resetForm();
          navigate("/add-new-employee-list");
        }
        }

        
      } catch (error) {
        console.error("Form submission error:", error, error.stack);
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to submit the form. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleBack = () => {
    navigate(-1);
  };

  document.title = isEditMode
    ? "Edit Employee Experience Details"
    : "Add Employee Experience Details";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Employee Management"
            breadcrumbItem={
              isEditMode
                ? "Edit Employee Experience Details"
                : "Add Employee Experience Details"
            }
          />

          <Row>
            <Col xs="12">
              <Card
                className="shadow-lg"
                style={{ borderRadius: "15px", overflow: "hidden" }}
              >
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
                      {isEditMode
                        ? "Edit Employee Experience Details"
                        : "Add Employee Experience Details"}
                    </h4>
                    <Button
                      color="secondary"
                      onClick={handleBack}
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
                      <i
                        className="bx bx-undo"
                        style={{ fontSize: "30px" }}
                      ></i>
                    </Button>
                  </div>

                  <Form onSubmit={formik.handleSubmit}>
                    <Row className="g-4">
                      {/* Previous Companies */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="previousCompanies"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Previous Company (Optional)
                          </Label>
                          <Input
                            type="text"
                            name="previousCompanies"
                            id="previousCompanies"
                            placeholder="Enter previous company name"
                            value={formik.values.previousCompanies}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.previousCompanies &&
                              formik.errors.previousCompanies
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.previousCompanies &&
                            formik.errors.previousCompanies && (
                              <div className="invalid-feedback">
                                {formik.errors.previousCompanies}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Designation */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="designation"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Designation (Optional)
                          </Label>
                          <Input
                            type="text"
                            name="designation"
                            id="designation"
                            placeholder="Enter designation"
                            value={formik.values.designation}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.designation &&
                              formik.errors.designation
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.designation &&
                            formik.errors.designation && (
                              <div className="invalid-feedback">
                                {formik.errors.designation}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Experience Duration */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="experienceDuration"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Experience Duration (Optional)
                          </Label>
                          <Input
                            type="text"
                            name="experienceDuration"
                            id="experienceDuration"
                            placeholder="e.g., 2 years or 18 months"
                            value={formik.values.experienceDuration}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.experienceDuration &&
                              formik.errors.experienceDuration
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.experienceDuration &&
                            formik.errors.experienceDuration && (
                              <div className="invalid-feedback">
                                {formik.errors.experienceDuration}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Submit Button */}
                      <Col md="12" className="text-end">
                        <Button
                          type="submit"
                          color="primary"
                          disabled={formik.isSubmitting}
                          style={{
                            padding: "10px 25px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 10px rgba(0, 123, 255, 0.3)",
                            transition: "transform 0.3s ease",
                          }}
                          className="hover-scale"
                        >
                          {formik.isSubmitting
                            ? "Submitting..."
                            : isEditMode
                            ? "Update"
                            : "Submit"}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

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

export default EmployeeExperienceDetails;
