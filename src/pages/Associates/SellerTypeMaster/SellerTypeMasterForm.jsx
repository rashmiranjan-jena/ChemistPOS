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
  postSellerType,
  getSellerTypeById,
  updateSellerType,
} from "../../../ApiService/Associate/SellerTypeMaster"; 
import Swal from "sweetalert2";

const validationSchema = Yup.object().shape({
  sellerTypeName: Yup.string()
    .required("Please enter the Seller Type Name")
    .min(3, "Seller Type Name must be at least 3 characters")
    .max(50, "Seller Type Name cannot exceed 50 characters"),
});

const SellerTypeMasterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sellerTypeId = location.state?.id;

  const isEditMode = !!sellerTypeId;
  document.title = isEditMode ? "Edit Seller Type" : "Seller Type Registration";

  const formik = useFormik({
    initialValues: {
      sellerTypeName: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const sellerData = {
          seller_type: values.sellerTypeName, 
        };
        let response;
        if (isEditMode) {
          response = await updateSellerType(sellerTypeId, sellerData);
        } else {
          response = await postSellerType(sellerData);
        }
        if (response) {
          formik.resetForm();
          Swal.fire({
            title: isEditMode ? "Seller Type Updated!" : "Seller Type Registered!",
            text: isEditMode
              ? "The seller type has been successfully updated."
              : "The seller type has been successfully registered.",
            icon: "success",
            confirmButtonText: "OK",
          });
          navigate("/seller-master-list"); 
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
      const fetchSellerType = async () => {
        try {
          const sellerTypeData = await getSellerTypeById(sellerTypeId);
          if (sellerTypeData) {
            formik.setValues({
              sellerTypeName: sellerTypeData.seller_type || "",
            });
          }
        } catch (error) {
          console.error("Error fetching seller type:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to load seller type data.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      };
      fetchSellerType();
    }
  }, [sellerTypeId, isEditMode]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Seller Management"
            breadcrumbItem={isEditMode ? "Edit Seller Type" : "Add Seller Type"}
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
                      {isEditMode ? "Edit Seller Type" : "Add Seller Type"}
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
                      {/* Seller Type Name */}
                      <Col md="12">
                        <FormGroup>
                          <Label
                            for="sellerTypeName"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Seller Type Name
                          </Label>
                          <Input
                            type="text"
                            name="sellerTypeName"
                            id="sellerTypeName"
                            placeholder="Enter Seller Type Name"
                            value={formik.values.sellerTypeName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.sellerTypeName &&
                              formik.errors.sellerTypeName
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.sellerTypeName &&
                            formik.errors.sellerTypeName && (
                              <div className="invalid-feedback">
                                {formik.errors.sellerTypeName}
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

export default SellerTypeMasterForm;