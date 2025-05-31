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
import { postManufacturerType,getManufacturerTypeById,updateManufacturerType } from "../../../ApiService/Associate/ManufacturerTypeMaster";

const validationSchema = Yup.object().shape({
  manufacturerTypeName: Yup.string()
    .required("Manufacturer Type Name is required")
    .min(2, "Manufacturer Type Name must be at least 2 characters"),
});

const ManufacturerTypeMasterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [manufacturerTypeId, setManufacturerTypeId] = useState(null);

  useEffect(() => {
    if (location.state && location.state.id) {
      setIsEditMode(true);
      setManufacturerTypeId(location.state.id);
      fetchManufacturerType(location.state.id);
    }
  }, [location.state]);

  const fetchManufacturerType = async (id) => {
    try {
      const data = await getManufacturerTypeById(id);
      formik.setValues({
        manufacturerTypeName: data.manufacturer_type || "",
      });
    } catch (error) {
      console.error("Error fetching manufacturer type:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to fetch manufacturer type data.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      manufacturerTypeName: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("manufacturer_type", values.manufacturerTypeName);

        let response;
        if (isEditMode) {
          response = await updateManufacturerType(manufacturerTypeId, formData);
          Swal.fire({
            title: "Manufacturer Type Updated!",
            text: "The manufacturer type has been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          response = await postManufacturerType(formData);
          Swal.fire({
            title: "Manufacturer Type Added!",
            text: "The manufacturer type has been successfully added.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }

        if (response) {
          formik.resetForm();
          navigate("/manufacturer-type-list");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to submit the form. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  });

  document.title = isEditMode ? "Edit Manufacturer Type" : "Add Manufacturer Type";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Associates"
            breadcrumbItem={isEditMode ? "Edit Manufacturer Type" : "Add Manufacturer Type"}
          />
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
                      {isEditMode ? "Edit Manufacturer Type" : "Add Manufacturer Type"}
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

                  <Form onSubmit={formik.handleSubmit}>
                    <Row className="g-4">
                      {/* Manufacturer Type Name */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="manufacturerTypeName"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Manufacturer Type Name
                          </Label>
                          <Input
                            type="text"
                            name="manufacturerTypeName"
                            id="manufacturerTypeName"
                            placeholder="Enter manufacturer type (e.g., Pharmaceutical)"
                            value={formik.values.manufacturerTypeName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.manufacturerTypeName && formik.errors.manufacturerTypeName
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.manufacturerTypeName && formik.errors.manufacturerTypeName && (
                            <div className="invalid-feedback">{formik.errors.manufacturerTypeName}</div>
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
                          {formik.isSubmitting ? "Submitting..." : isEditMode ? "Update" : "Submit"}
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

export default ManufacturerTypeMasterForm;