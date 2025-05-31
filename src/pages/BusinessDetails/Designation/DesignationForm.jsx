import React, { useEffect } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createDesignation, updateDesignation } from "../../../ApiService/Degination/Degination";
import Swal from "sweetalert2";
import { getDepartmentDetails } from "../../../ApiService/Department/Department";

// Validation schema using Yup
const validationSchema = Yup.object({
  designation_name: Yup.string()
    .required("Designation Name is required")
    .min(2, "Designation Name must be at least 2 characters")
    .max(50, "Designation Name cannot exceed 50 characters"),
  designation_code: Yup.string()
    // .required("Designation Code is required")
    .matches(
      /^[A-Z]{2,5}[0-9]{1,3}$/,
      "Designation Code must be 2-5 uppercase letters followed by 1-3 digits (e.g., PH01)"
    )
    .max(8, "Designation Code cannot exceed 8 characters"),
  reporting_manager: Yup.string()
    .required("Reporting Manager is required")
    .min(2, "Reporting Manager must be at least 2 characters")
    .max(50, "Reporting Manager cannot exceed 50 characters"),
  department_association: Yup.string().required("Department Association is required"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description cannot exceed 200 characters"),
});

const DesignationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};
  const [department_association,setDepartment_association] = React.useState([]);

  // const department_association = [
  //   { id: 1, name: "Sales" },
  //   { id: 2, name: "Inventory" },
  //   { id: 3, name: "Accounts" },
  //   { id: 4, name: "Pharmacy" },
  //   { id: 5, name: "Admin" },
  // ];

  const initialValues = {
    designation_name: data?.designation_name ||"",
    designation_code: data?.designation_code ||"",
    reporting_manager: data?.reporting_manager ||"",
    department_association: data?.department_association ||"",
    description: data?.description ||"",
  };
  useEffect(() => {
    getDepartmentAssociation();
  }, []);

  const getDepartmentAssociation = async () => {
    try {
      // Fetch department association from API
      const response = await getDepartmentDetails()
      if(response.status === 200){
        setDepartment_association(response.data);
      }
    } catch (error) {
      console.error("Error fetching department association:", error);
    }
  };
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (data) {
        // Updating an existing designation
        const response = await updateDesignation(data.designation_id, values);
        if (response.status === 200) {
          Swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success",
            confirmButtonText: "Okay",
          }).then(() => {
            navigate(-1); // Navigate back after confirmation
          });
        }
      } else {
        // Creating a new designation
        console.log("Designation Details:", values);
        const response = await createDesignation(values);
        if (response.status === 201) {
          Swal.fire({
            title: "Success!",
            text: "Designation has been registered successfully.",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            navigate("/designation-list"); // Navigate after success
          });
        }
      }
    } catch (error) {
      console.error("Error submitting designation:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to process designation. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setSubmitting(false); // Ensure form is no longer submitting
    }
  };
  

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Company" breadcrumbItem="Add Designation" />
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
                      Add Designation
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
                    {({ isSubmitting, errors, touched, handleSubmit }) => (
                      <Form onSubmit={handleSubmit}>
                        <Row className="g-4">
                          {/* Designation Name */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="designation_name"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Designation Name
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="designation_name"
                                id="designation_name"
                                placeholder="E.g., Pharmacist, Cashier"
                                className={`form-control ${
                                  errors.designation_name && touched.designation_name
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                              <ErrorMessage
                                name="designation_name"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* Designation Code */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="designation_code"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Designation Code
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="designation_code"
                                id="designation_code"
                                placeholder="E.g., PH01, CS02"
                                className={`form-control ${
                                  errors.designation_code && touched.designation_code
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                              <ErrorMessage
                                name="designation_code"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* Reporting Manager */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="reporting_manager"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Reporting Manager
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="reporting_manager"
                                id="reporting_manager"
                                placeholder="E.g., Pharmacy Head"
                                className={`form-control ${
                                  errors.reporting_manager && touched.reporting_manager
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                              <ErrorMessage
                                name="reporting_manager"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* Department Association */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="department_association"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Department Association
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="department_association"
                                id="department_association"
                                className={`form-control ${
                                  errors.department_association && touched.department_association
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              >
                                <option value="">Select Association</option>
                                {department_association.map((dept) => (
                                  <option key={dept.department_id} value={dept.department_id}>
                                    {dept.department_name}
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage
                                name="department_association"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* Description */}
                          <Col md="12">
                            <FormGroup>
                              <Label
                                for="description"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Description
                              </Label>
                              <Field
                                as={Input}
                                type="textarea"
                                name="description"
                                id="description"
                                placeholder="Brief summary of the role"
                                className={`form-control ${
                                  errors.description && touched.description
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                  minHeight: "100px",
                                }}
                              />
                              <ErrorMessage
                                name="description"
                                component="div"
                                className="invalid-feedback"
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
                    )}
                  </Formik>
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

export default DesignationForm;