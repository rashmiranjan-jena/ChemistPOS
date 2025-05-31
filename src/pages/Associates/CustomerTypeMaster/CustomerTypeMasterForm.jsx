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
import Select from "react-select";
import {
  postCustomerType,
  getCustomerTypeById,
  updateCustomerType,
} from "../../../ApiService/Associate/CustomerTypeMaster";

const validationSchema = Yup.object().shape({
  customerType: Yup.string()
    .required("Customer Type is required")
    .min(2, "Customer Type must be at least 2 characters"),
  discount: Yup.string()
    .required("Discount is required")
    .matches(/^\d+$/, "Discount must be a number between 1 and 100"),
});

const discountOptions = Array.from({ length: 100 }, (_, i) => ({
  value: `${i + 1}`,
  label: `${i + 1}%`,
}));

const CustomerTypeMasterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [customerTypeId, setCustomerTypeId] = useState(null);

  useEffect(() => {
    if (location.state && location.state.id) {
      setIsEditMode(true);
      setCustomerTypeId(location.state.id);
      fetchCustomerType(location.state.id);
    }
  }, [location.state]);

  const fetchCustomerType = async (id) => {
    try {
      const data = await getCustomerTypeById(id);
     formik.setValues({
  customerType: data.customer_type || "",
  discount: data.discount ? String(data.discount) : "",
});

    } catch (error) {
      console.error("Error fetching customer type:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to fetch customer type data.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      customerType: "",
      discount: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("customer_type", values.customerType);
        formData.append("discount", values.discount);

        let response;
        if (isEditMode) {
          response = await updateCustomerType(customerTypeId, formData);
          Swal.fire({
            title: "Customer Type Updated!",
            text: "The customer type has been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          response = await postCustomerType(formData);
          Swal.fire({
            title: "Customer Type Added!",
            text: "The customer type has been successfully added.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }

        if (response) {
          formik.resetForm();
          navigate("/customer-type-master-list");
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

  document.title = isEditMode ? "Edit Customer Type" : "Add Customer Type";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Associates"
            breadcrumbItem={
              isEditMode ? "Edit Customer Type" : "Add Customer Type"
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
                      {isEditMode ? "Edit Customer Type" : "Add Customer Type"}
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
                        style={{ fontSize: "30px" }}
                      ></i>
                    </Button>
                  </div>

                  <Form onSubmit={formik.handleSubmit}>
                    <Row className="g-4">
                      {/* Customer Type */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="customerType"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Customer Type
                          </Label>
                          <Input
                            type="text"
                            name="customerType"
                            id="customerType"
                            placeholder="Enter customer type (e.g., Gold)"
                            value={formik.values.customerType}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.customerType &&
                              formik.errors.customerType
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          {formik.touched.customerType &&
                            formik.errors.customerType && (
                              <div className="invalid-feedback">
                                {formik.errors.customerType}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Discount */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="discount"
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            Discount
                          </Label>
                          <Select
                            name="discount"
                            id="discount"
                            options={discountOptions}
                            value={discountOptions.find(
                              (option) =>
                                option.value === formik.values.discount
                            )}
                            onChange={(option) =>
                              formik.setFieldValue(
                                "discount",
                                option ? option.value : ""
                              )
                            }
                            onBlur={() =>
                              formik.setFieldTouched("discount", true)
                            }
                            placeholder="Select discount (1% - 100%)"
                            isSearchable={true}
                            className={`${
                              formik.touched.discount && formik.errors.discount
                                ? "is-invalid"
                                : ""
                            }`}
                            styles={{
                              control: (base) => ({
                                ...base,
                                borderRadius: "8px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                padding: "2px",
                                borderColor:
                                  formik.touched.discount &&
                                  formik.errors.discount
                                    ? "#dc3545"
                                    : base.borderColor,
                              }),
                              menu: (base) => ({
                                ...base,
                                zIndex: 9999,
                              }),
                            }}
                          />
                          {formik.touched.discount &&
                            formik.errors.discount && (
                              <div className="invalid-feedback">
                                {formik.errors.discount}
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
        .is-invalid .react-select__control {
          border-color: #dc3545 !important;
        }
      `}</style>
    </React.Fragment>
  );
};

export default CustomerTypeMasterForm;
