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
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  postSupplierType,
  getSupplierTypeById,
  updateSupplierType,
} from "../../../ApiService/Associate/SupplierTypeMaster";
import Swal from "sweetalert2";

const validationSchema = Yup.object().shape({
  supplierTypeName: Yup.string()
    .required("Please enter the Supplier Type Name")
    .min(3, "Supplier Type Name must be at least 3 characters")
    .max(50, "Supplier Type Name cannot exceed 50 characters"),
});

const SupplierTypeMasterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const supplierTypeId = location.state?.id;

  const isEditMode = !!supplierTypeId;
  document.title = isEditMode
    ? "Edit Supplier Type"
    : "Supplier Type Registration";

  const formik = useFormik({
    initialValues: {
      supplierTypeName: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const supplierData = {
          supplier_type: values.supplierTypeName,
        };
        let response;
        if (isEditMode) {
          response = await updateSupplierType(supplierTypeId, supplierData);
        } else {
          response = await postSupplierType(supplierData);
        }
        if (response) {
          formik.resetForm();
          Swal.fire({
            title: isEditMode
              ? "Supplier Type Updated!"
              : "Supplier Type Registered!",
            text: isEditMode
              ? "The supplier type has been successfully updated."
              : "The supplier type has been successfully registered.",
            icon: "success",
            confirmButtonText: "OK",
          });
          navigate("/supplier-type-master-list");
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to submit the form. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchSupplierType = async () => {
        try {
          const supplierTypeData = await getSupplierTypeById(supplierTypeId);
          if (supplierTypeData) {
            formik.setValues({
              supplierTypeName: supplierTypeData.supplier_type || "",
            });
          }
        } catch (error) {
          console.error("Error fetching supplier type:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to load supplier type data.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      };
      fetchSupplierType();
    }
  }, [supplierTypeId, isEditMode]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Supplier Management"
            breadcrumbItem={
              isEditMode ? "Edit Supplier Type" : "Add Supplier Type"
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
                      {isEditMode ? "Edit Supplier Type" : "Add Supplier Type"}
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

                  <Form onSubmit={formik.handleSubmit}>
                    <Row className="g-4">
                      {/* Supplier Type Name */}
                      <Col md="12">
                        <FormGroup>
                          <Label
                            for="supplierTypeName"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Supplier Type Name
                          </Label>
                          <Input
                            type="text"
                            name="supplierTypeName"
                            id="supplierTypeName"
                            placeholder="Enter Supplier Type Name"
                            value={formik.values.supplierTypeName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.supplierTypeName &&
                              formik.errors.supplierTypeName
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.supplierTypeName &&
                            formik.errors.supplierTypeName && (
                              <div className="invalid-feedback">
                                {formik.errors.supplierTypeName}
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

      {/* Inline CSS for hover effects */}
      <style jsx>{`
        .hover-scale:hover {
          transform: scale(1.05) !important;
        }
        .form-control:focus {
          border-color: #007bff;
          boxshadow: 0 0 8px rgba(0, 123, 255, 0.3);
        }
        .invalid-feedback {
          font-size: 12px;
          color: #dc3545;
        }
      `}</style>
    </React.Fragment>
  );
};

export default SupplierTypeMasterForm;
