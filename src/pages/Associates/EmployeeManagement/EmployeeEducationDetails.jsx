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
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import {
  addEmployeeEducationDetails,
  getEmployeeEducationDetailsById,
  updateEmployeeEducationDetails,
} from "../../../ApiService/Associats/Employee";

// Validation schema with all fields optional
const validationSchema = Yup.object({
  institutionName: Yup.string()
    .min(3, "Institution Name must be at least 3 characters")
    .nullable(),
  degree: Yup.string()
    .min(2, "Degree must be at least 2 characters")
    .nullable(),
  yearOfCompletion: Yup.number()
    .min(1900, "Year must be 1900 or later")
    .max(
      new Date().getFullYear(),
      `Year cannot be later than ${new Date().getFullYear()}`
    )
    .integer("Year must be an integer")
    .nullable(),
});

const EmployeeEducationDetails = () => {
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
      fetchEmployeeEducationDetails(location.state.emp_id);
    } else if (location.state?.id) {
      // Create mode: Store id for creating new employee details
      setIsEditMode(false);
      setEmployeeId(location.state.id);
    }
  }, [location.state]);

  const fetchEmployeeEducationDetails = async (id) => {
    try {
      const data = await getEmployeeEducationDetailsById(id);
      formik.setValues({
        institutionName: data?.educational_details?.institution_name || "",
        degree: data?.educational_details?.degree || "",
        yearOfCompletion: data?.educational_details?.year_of_completion || "",
      });
    } catch (error) {
      console.error("Error fetching employee education details:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to fetch employee education details.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const initialValues = {
    institutionName: "",
    degree: "",
    yearOfCompletion: "",
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
        const educational_details = {};
        if (values.institutionName) {
          educational_details.institution_name = values.institutionName;
        }
        if (values.degree) {
          educational_details.degree = values.degree;
        }
        if (values.yearOfCompletion) {
          educational_details.year_of_completion = values.yearOfCompletion;
        }

        const payload = { educational_details };

        console.log("JSON payload:", payload);

        let response;
        if (isEditMode) {
          response = await updateEmployeeEducationDetails(employeeId, payload);
          Swal.fire({
            title: "Employee Education Details Updated!",
            text: "The employee education details have been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });
          if (response) {
            formik.resetForm();
            navigate("/add-new-employee-list");
          }
        } else {
          response = await addEmployeeEducationDetails(payload, employeeId);
          Swal.fire({
            title: "Employee Education Details Added!",
            text:
              response?.message ||
              "Employee education details added successfully!",
            icon: "success",
            confirmButtonText: "OK",
          });
          if (response) {
            formik.resetForm();
            navigate("/employee-experience-details", {
              state: { id: employeeId },
            });
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
    ? "Edit Employee Education Details"
    : "Add Employee Education Details";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Employee Management"
            breadcrumbItem={
              isEditMode
                ? "Edit Employee Education Details"
                : "Add Employee Education Details"
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
                        ? "Edit Employee Education Details"
                        : "Add Employee Education Details"}
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
                      {/* Institution Name */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="institutionName"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Institution Name (Optional)
                          </Label>
                          <Input
                            type="text"
                            name="institutionName"
                            id="institutionName"
                            placeholder="Enter institution name"
                            value={formik.values.institutionName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.institutionName &&
                              formik.errors.institutionName
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.institutionName &&
                            formik.errors.institutionName && (
                              <div className="invalid-feedback">
                                {formik.errors.institutionName}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Degree */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="degree"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Degree (Optional)
                          </Label>
                          <Input
                            type="text"
                            name="degree"
                            id="degree"
                            placeholder="Enter degree"
                            value={formik.values.degree}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.degree && formik.errors.degree
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.degree && formik.errors.degree && (
                            <div className="invalid-feedback">
                              {formik.errors.degree}
                            </div>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Year of Completion */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="yearOfCompletion"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Year of Completion (Optional)
                          </Label>
                          <Input
                            type="number"
                            name="yearOfCompletion"
                            id="yearOfCompletion"
                            placeholder="Enter year of completion"
                            value={formik.values.yearOfCompletion}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.yearOfCompletion &&
                              formik.errors.yearOfCompletion
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.yearOfCompletion &&
                            formik.errors.yearOfCompletion && (
                              <div className="invalid-feedback">
                                {formik.errors.yearOfCompletion}
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

export default EmployeeEducationDetails;
