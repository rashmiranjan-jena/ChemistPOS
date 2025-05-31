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
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { addDepartment, updateDepartment } from "../../../ApiService/Department/Department";

// Validation schema using Yup
const validationSchema = Yup.object({
  department_name: Yup.string()
    .required("Department Name is required")
    .min(2, "Department Name must be at least 2 characters")
    .max(50, "Department Name cannot exceed 50 characters"),
  department_code: Yup.string()
    // .required("Department Code is required")
    .matches(
      /^[A-Z]{2,5}[0-9]{1,3}$/,
      "Department Code must be 2-5 uppercase letters followed by 1-3 digits (e.g., SAL01)"
    )
    .max(8, "Department Code cannot exceed 8 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description cannot exceed 200 characters"),
});

const DepartmentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {data} = location.state || {};
  console.log(data);
  


  const initialValues = {
    department_name: data?.department_name || "",
    department_code: data?.department_code || "",
    description: data?.description ||"",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (data) {
        // Updating an existing department
        const response = await updateDepartment(data.department_id, values);
        if (response.status === 200) {
          Swal.fire({
            title: "Success",
            text: "Department updated successfully!",
            icon: "success",
            confirmButtonText: "OK",
          });
          navigate("/department-list");
        } else {
          Swal.fire({
            title: "Error",
            text: "An error occurred. Please try again!",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } else {
        // Adding a new department
        const response = await addDepartment(values);
        if (response.status === 201) {
          Swal.fire({
            title: "Success",
            text: "Department added successfully!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            navigate("/department-list");
          });
        }
      }
    } catch (error) {
      console.error("Error submitting department:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred. Please try again!",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Company" breadcrumbItem="Add Department" />
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
                      Add Department
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
                    {({ values, isSubmitting, errors, touched, handleSubmit }) => (
                      <Form onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit(e);
                      }}>
                        <Row className="g-4">
                          {/* Department Name */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="department_name"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Department Name
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="department_name"
                                id="department_name"
                                placeholder="E.g., Sales, Inventory, Pharmacy"
                                className={`form-control ${
                                  errors.department_name && touched.department_name
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
                                name="department_name"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* Department Code */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="department_code"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Department Code
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="department_code"
                                id="department_code"
                                placeholder="E.g., SAL01, INV02"
                                className={`form-control ${
                                  errors.department_code && touched.department_code
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
                                name="department_code"
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
                                placeholder="Brief purpose of the department"
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

export default DepartmentForm;