import React, { useEffect, useState } from "react";
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
  postPackagingUnit,
  getPackagingUnitById,
  updatePackagingUnit,
} from "../../../ApiService/UnitMeasurement/Packagsingunit";

const validationSchema = Yup.object().shape({
  unitName: Yup.string()
    .required("Unit Name is required")
    .min(2, "Unit Name must be at least 2 characters"),
  abbreviation: Yup.string()
    .required("Abbreviation is required")
    .min(1, "Abbreviation must be at least 1 character"),
});

const Packagingunit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [unitId, setUnitId] = useState(null);

  useEffect(() => {
    if (location?.state?.id) {
      setIsEditMode(true);
      setUnitId(location.state.id);
      fetchPackagingUnit(location.state.id);
    }
  }, [location?.state]);

  const fetchPackagingUnit = async (id) => {
    try {
      const data = await getPackagingUnitById(id);
      formik.setValues({
        unitName: data?.unit_name || "",
        abbreviation: data?.abbreviation || "",
      });
    } catch (error) {
      console.error("Error fetching packaging unit:", error);
      Swal.fire({
        title: "Error!",
        text: error?.message || "Failed to fetch packaging unit data.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      unitName: "",
      abbreviation: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("unit_name", values?.unitName);
        formData.append("abbreviation", values?.abbreviation);

        let response;
        if (isEditMode) {
          response = await updatePackagingUnit(unitId, formData);
          Swal.fire({
            title: "Packaging Unit Updated!",
            text: "The packaging unit has been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          response = await postPackagingUnit(formData);
          Swal.fire({
            title: "Packaging Unit Registered!",
            text: "The packaging unit has been successfully registered.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }

        if (response) {
          formik.resetForm();
          navigate("/packagingunitlist");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        Swal.fire({
          title: "Error!",
          text:
            error?.message || "Failed to submit the form. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  });

  document.title = "Packaging Unit Registration";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Packaging Units"
            breadcrumbItem={
              isEditMode ? "Edit Packaging Unit" : "Add Packaging Unit"
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
                        ? "Edit Packaging Unit"
                        : "Add Packaging Unit"}
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
                      <i
                        className="bx bx-undo"
                        style={{ fontSize: "18px" }}
                      ></i>
                    </Button>
                  </div>

                  <Form onSubmit={formik?.handleSubmit}>
                    <Row className="g-4">
                      {/* Unit Name */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="unitName"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Unit Name
                          </Label>
                          <Input
                            type="text"
                            name="unitName"
                            id="unitName"
                            placeholder="Enter unit name"
                            value={formik?.values?.unitName}
                            onChange={formik?.handleChange}
                            onBlur={formik?.handleBlur}
                            className={`form-control ${
                              formik?.touched?.unitName &&
                              formik?.errors?.unitName
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik?.touched?.unitName &&
                            formik?.errors?.unitName && (
                              <div className="invalid-feedback">
                                {formik?.errors?.unitName}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Abbreviation */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="abbreviation"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Abbreviation
                          </Label>
                          <Input
                            type="text"
                            name="abbreviation"
                            id="abbreviation"
                            placeholder="Enter abbreviation"
                            value={formik?.values?.abbreviation}
                            onChange={formik?.handleChange}
                            onBlur={formik?.handleBlur}
                            className={`form-control ${
                              formik?.touched?.abbreviation &&
                              formik?.errors?.abbreviation
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik?.touched?.abbreviation &&
                            formik?.errors?.abbreviation && (
                              <div className="invalid-feedback">
                                {formik?.errors?.abbreviation}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Buttons */}
                      <Col md="12" className="text-end">
                        <Button
                          type="submit"
                          color="primary"
                          disabled={formik?.isSubmitting}
                          style={{
                            padding: "10px 25px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 10px rgba(0, 123, 255, 0.3)",
                            transition: "transform 0.3s ease",
                            marginRight: "10px",
                          }}
                          className="hover-scale"
                        >
                          {formik?.isSubmitting
                            ? "Processing..."
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

export default Packagingunit;
