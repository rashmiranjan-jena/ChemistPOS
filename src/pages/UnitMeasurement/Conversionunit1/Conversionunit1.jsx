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
import Breadcrumbs from "../../../components/Common/Breadcrumb"; // Adjust path as needed
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schema using Yup
const validationSchema = Yup.object({
  measurementUnit1: Yup.string().required("Please select the first Measurement Unit"),
  value1: Yup.number()
    .required("Please enter the first value")
    .positive("Value must be positive"),
  measurementUnit2: Yup.string().required("Please select the second Measurement Unit"),
  value2: Yup.number()
    .required("Please enter the second value")
    .positive("Value must be positive"),
});

const Conversionunit1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  const isEditMode = !!id;

  // Static data for measurement units
  const measurementUnits = [
    { measurementUnit_id: "MU001", unit_name: "Kilogram" },
    { measurementUnit_id: "MU002", unit_name: "Liter" },
    { measurementUnit_id: "MU003", unit_name: "Meter" },
    { measurementUnit_id: "MU004", unit_name: "Gram" },
  ];

  // Static initial data for edit mode
  const staticEditData = {
    from_measurementUnit: "MU001",
    from_value: 1,
    to_measurementUnit: "MU004",
    to_value: 1000,
  };

  const initialValues = {
    measurementUnit1: isEditMode ? staticEditData.from_measurementUnit : "",
    value1: isEditMode ? staticEditData.from_value : "",
    measurementUnit2: isEditMode ? staticEditData.to_measurementUnit : "",
    value2: isEditMode ? staticEditData.to_value : "",
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form Values:", values);
    setTimeout(() => {
      alert(
        `Conversion unit ${isEditMode ? "updated" : "submitted"} successfully!`
      );
      setSubmitting(false);
      navigate("/conversionunitlist1");
    }, 1000);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title={
              isEditMode
                ? "Edit Measurement Unit Conversion"
                : "Measurement Unit Conversion Registration"
            }
            breadcrumbItem={isEditMode ? "Edit Conversion Details" : "Add Conversion Details"}
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
                        ? "Edit Measurement Unit Conversion"
                        : "Add Measurement Unit Conversion"}
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
                          {/* Measurement Unit 1 */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="measurementUnit1"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Measurement Unit
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="measurementUnit1"
                                id="measurementUnit1"
                                className={`form-control ${
                                  errors.measurementUnit1 && touched.measurementUnit1
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                                disabled={isSubmitting}
                              >
                                <option value="">Select Measurement Unit</option>
                                {measurementUnits.map((unit) => (
                                  <option
                                    key={unit.measurementUnit_id}
                                    value={unit.measurementUnit_id}
                                  >
                                    {unit.unit_name}
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage
                                name="measurementUnit1"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* Value 1 */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="value1"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                From Value
                              </Label>
                              <Field
                                as={Input}
                                type="number"
                                name="value1"
                                id="value1"
                                placeholder="Enter value"
                                className={`form-control ${
                                  errors.value1 && touched.value1 ? "is-invalid" : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                                disabled={isSubmitting}
                              />
                              <ErrorMessage
                                name="value1"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* Measurement Unit 2 */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="measurementUnit2"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                To Measurement Unit
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="measurementUnit2"
                                id="measurementUnit2"
                                className={`form-control ${
                                  errors.measurementUnit2 && touched.measurementUnit2
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                                disabled={isSubmitting}
                              >
                                <option value="">Select Measurement Unit</option>
                                {measurementUnits.map((unit) => (
                                  <option
                                    key={unit.measurementUnit_id}
                                    value={unit.measurementUnit_id}
                                  >
                                    {unit.unit_name}
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage
                                name="measurementUnit2"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* Value 2 */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="value2"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                To Value
                              </Label>
                              <Field
                                as={Input}
                                type="number"
                                name="value2"
                                id="value2"
                                placeholder="Enter value"
                                className={`form-control ${
                                  errors.value2 && touched.value2 ? "is-invalid" : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                                disabled={isSubmitting}
                              />
                              <ErrorMessage
                                name="value2"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* Buttons */}
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
                                marginRight: "10px",
                              }}
                              className="hover-scale"
                            >
                              {isSubmitting
                                ? "Processing..."
                                : isEditMode
                                ? "Update"
                                : "Submit"}
                            </Button>
                            <Button
                              type="button"
                              color="secondary"
                              onClick={() => navigate("/conversionunitlist1")}
                              disabled={isSubmitting}
                              style={{
                                padding: "10px 25px",
                                borderRadius: "8px",
                                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                                transition: "transform 0.3s ease",
                              }}
                              className="hover-scale"
                            >
                              Cancel
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

export default Conversionunit1;