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
import axios from "axios"; 
import Swal from "sweetalert2"; 

const validationSchema = Yup.object({
  commissionType: Yup.string()
    .required("Commission Type is required")
    .matches(/^[A-Za-z\s-]+$/, "Commission Type must contain only letters, spaces, or hyphens"),
  commission: Yup.number()
    .required("Commission is required")
    .min(0, "Commission must be 0 or greater")
    .max(100, "Commission cannot exceed 100"),
  associatedDoctors: Yup.array()
    .min(1, "Please select at least one doctor")
    .required("Associated Doctors selection is required"),
});

const CommissionMasterForm = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]); 
  const [loadingDoctors, setLoadingDoctors] = useState(true); 

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/doctors/`);
        const doctorOptions = response.data.map((doctor) => ({
          value: doctor.id,
          label: doctor.name,
        }));
        setDoctors(doctorOptions);
        setLoadingDoctors(false);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        Swal.fire({
          title: "Error!",
          text: error?.message ?? "Failed to fetch doctors.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const initialValues = {
    commissionType: "",
    commission: "",
    associatedDoctors: [],
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
   
      const payload = {
        commissionType: values.commissionType,
        commission: values.commission,
        associatedDoctors: values.associatedDoctors.map((doctor) => doctor.value), 
      };

      console.log("Submitting payload:", payload);
   

      Swal.fire({
        title: "Success!",
        text: "Commission details submitted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        setSubmitting(false);
        navigate("/commission-list");
      });
    } catch (error) {
      console.error("Error submitting commission:", error);
      Swal.fire({
        title: "Error!",
        text: error?.message ?? "Failed to submit commission details.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setSubmitting(false);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Commission Management" breadcrumbItem="Add Commission Details" />

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
                      Add Commission Details
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
                      <i className="bx bx-undo" style={{ fontSize: "30px" }}></i>
                    </Button>
                  </div>

                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting, errors, touched, setFieldValue, values }) => (
                      <Form>
                        <Row className="g-4">
                          {/* Commission Type */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="commissionType" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Commission Type
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="commissionType"
                                id="commissionType"
                                placeholder="Enter commission type"
                                className={`form-control ${
                                  errors.commissionType && touched.commissionType ? "is-invalid" : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                              <ErrorMessage
                                name="commissionType"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* Commission */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="commission" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Commission (%)
                              </Label>
                              <Field
                                as={Input}
                                type="number"
                                name="commission"
                                id="commission"
                                placeholder="Enter commission percentage"
                                className={`form-control ${
                                  errors.commission && touched.commission ? "is-invalid" : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                              <ErrorMessage
                                name="commission"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* Associated Doctors (Multi-Select) */}
                          <Col md="12">
                            <FormGroup>
                              <Label for="associatedDoctors" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Associated Doctors
                              </Label>
                              <Select
                                id="associatedDoctors"
                                name="associatedDoctors"
                                isMulti
                                options={doctors}
                                isLoading={loadingDoctors}
                                placeholder="Select associated doctors..."
                                onChange={(selected) => setFieldValue("associatedDoctors", selected || [])}
                                value={values.associatedDoctors}
                                className={errors.associatedDoctors && touched.associatedDoctors ? "is-invalid" : ""}
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    borderColor: errors.associatedDoctors && touched.associatedDoctors ? "#dc3545" : base.borderColor,
                                    "&:hover": {
                                      borderColor: errors.associatedDoctors && touched.associatedDoctors ? "#dc3545" : "#007bff",
                                    },
                                  }),
                                  menu: (base) => ({
                                    ...base,
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                                  }),
                                }}
                              />
                              <ErrorMessage
                                name="associatedDoctors"
                                component="div"
                                className="invalid-feedback"
                                style={{ display: errors.associatedDoctors && touched.associatedDoctors ? "block" : "none" }}
                              />
                              <small className="text-muted">
                                Select one or more doctors associated with this commission.
                              </small>
                            </FormGroup>
                          </Col>

                          {/* Submit Button */}
                          <Col md="12" className="text-end">
                            <Button
                              type="submit"
                              color="primary"
                              disabled={isSubmitting || loadingDoctors}
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
          boxShadow: 0 0 8px rgba(0, 123, 255, 0.3);
        }
        .invalid-feedback {
          font-size: 12px;
          color: #dc3545;
        }
        .is-invalid .react-select__control {
          border-color: #dc3545 !important;
        }
      `}</style>
    </React.Fragment>
  );
};

export default CommissionMasterForm;