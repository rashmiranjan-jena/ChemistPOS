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
  createMarketDemand,
  getMarketDemandById,
  updateMarketDemand,
} from "../../../ApiService/Purchase/MarketDemand";

// Validation schema
const validationSchema = Yup.object({
  customerName: Yup.string()
    .required("Customer name is required")
    .min(2, "Customer name must be at least 2 characters"),
  customerMobile: Yup.string()
    .required("Mobile number is required")
    .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
  estimatedDate: Yup.date()
    .nullable()
    .optional()
    .typeError("Please enter a valid date"),
  products: Yup.array()
    .of(
      Yup.object().shape({
        productName: Yup.string().required("Product name is required"),
        quantity: Yup.number()
          .required("Quantity is required")
          .min(1, "Quantity must be at least 1")
          .integer("Quantity must be a whole number"),
      })
    )
    .min(1, "At least one product is required"),
});

const MarketDemandForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [demandId, setDemandId] = useState(null);

  const formik = useFormik({
    initialValues: {
      customerName: "",
      customerMobile: "",
      estimatedDate: "",
      products: [{ productName: "", quantity: "" }],
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
      
        const payload = {
          customer_name: values.customerName,
          mob_no: values.customerMobile,
          estd_date: values.estimatedDate || null,
          products: values.products.map((product) => ({
            product_name: product.productName,
            quantity: parseInt(product.quantity),
          })),
        };

        let response;
        if (isEditMode) {
  
          response = await updateMarketDemand(demandId, payload);
          Swal.fire({
            title: "Success!",
            text:
              response?.message ||
              "Market demand has been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
        
          response = await createMarketDemand(payload);
          Swal.fire({
            title: "Success!",
            text:
              response?.message ||
              "Market demand has been successfully submitted.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }

        formik.resetForm();
        navigate("/market-demand-list");
      } catch (error) {
        console.error("Error submitting form:", error);
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to submit the form. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });


  useEffect(() => {
    const id = location?.state?.id;
    if (id) {
      setIsEditMode(true);
      setDemandId(id);
      const fetchData = async () => {
        try {
          const data = await getMarketDemandById(id);
          formik.setValues({
            customerName: data?.customer_name || "",
            customerMobile: data?.mob_no ? String(data.mob_no) : "",
            estimatedDate: data?.estd_date || "",
            products: data?.products?.map((product) => ({
              productName: product?.product_name || "",
              quantity: product?.quantity ? String(product.quantity) : "",
            })) || [{ productName: "", quantity: "" }],
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: error.message || "Failed to load market demand data.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      };
      fetchData();
    }
  }, [location?.state?.id]);

  const addProduct = () => {
    formik.setFieldValue("products", [
      ...formik.values.products,
      { productName: "", quantity: "" },
    ]);
  };

  const removeProduct = (index) => {
    if (formik.values.products.length > 1) {
      const updatedProducts = formik.values.products.filter(
        (_, i) => i !== index
      );
      formik.setFieldValue("products", updatedProducts);
    }
  };

  document.title = isEditMode ? "Edit Market Demand" : "Add Market Demand";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Market Demand"
            breadcrumbItem={
              isEditMode ? "Edit Market Demand" : "Add Market Demand"
            }
          />
          <Row>
            <Col xs="12">
              <Card className="shadow-lg" style={{ borderRadius: "15px" }}>
                <CardBody className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4
                      className="text-primary"
                      style={{
                        fontWeight: "700",
                        letterSpacing: "1px",
                        background: "linear-gradient(90deg, #007bff, #ff9800)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {isEditMode ? "Edit Market Demand" : "Add Market Demand"}
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
                      {/* Customer Name */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="customerName"
                            className="fw-bold text-dark"
                          >
                            Customer Name *
                          </Label>
                          <Input
                            type="text"
                            name="customerName"
                            id="customerName"
                            placeholder="Enter customer name"
                            value={formik.values.customerName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.customerName &&
                              formik.errors.customerName
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            }}
                          />
                          {formik.touched.customerName &&
                            formik.errors.customerName && (
                              <div className="invalid-feedback">
                                {formik.errors.customerName}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Customer Mobile Number */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="customerMobile"
                            className="fw-bold text-dark"
                          >
                            Customer Mobile Number *
                          </Label>
                          <Input
                            type="text"
                            name="customerMobile"
                            id="customerMobile"
                            placeholder="Enter 10-digit mobile number"
                            value={formik.values.customerMobile}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.customerMobile &&
                              formik.errors.customerMobile
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            }}
                          />
                          {formik.touched.customerMobile &&
                            formik.errors.customerMobile && (
                              <div className="invalid-feedback">
                                {formik.errors.customerMobile}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Estimated Date */}
                      <Col md="6">
                        <FormGroup>
                          <Label
                            for="estimatedDate"
                            className="fw-bold text-dark"
                          >
                            Estimated Date (Optional)
                          </Label>
                          <Input
                            type="date"
                            name="estimatedDate"
                            id="estimatedDate"
                            value={formik.values.estimatedDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${
                              formik.touched.estimatedDate &&
                              formik.errors.estimatedDate
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            }}
                          />
                          {formik.touched.estimatedDate &&
                            formik.errors.estimatedDate && (
                              <div className="invalid-feedback">
                                {formik.errors.estimatedDate}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      {/* Products Section */}
                      <Col md="12">
                        <FormGroup>
                          <Label className="fw-bold text-dark">
                            Products *
                          </Label>
                          {formik.values.products.map((product, index) => (
                            <Row key={index} className="mb-3 align-items-end">
                              <Col md="5">
                                <Label
                                  for={`products[${index}].productName`}
                                  className="text-dark"
                                >
                                  Product Name
                                </Label>
                                <Input
                                  type="text"
                                  name={`products[${index}].productName`}
                                  id={`products[${index}].productName`}
                                  placeholder="Enter product name"
                                  value={product.productName}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  className={`form-control ${
                                    formik.touched.products?.[index]
                                      ?.productName &&
                                    formik.errors.products?.[index]?.productName
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  style={{
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  }}
                                />
                                {formik.touched.products?.[index]
                                  ?.productName &&
                                  formik.errors.products?.[index]
                                    ?.productName && (
                                    <div className="invalid-feedback">
                                      {
                                        formik.errors.products[index]
                                          .productName
                                      }
                                    </div>
                                  )}
                              </Col>
                              <Col md="4">
                                <Label
                                  for={`products[${index}].quantity`}
                                  className="text-dark"
                                >
                                  Quantity
                                </Label>
                                <Input
                                  type="number"
                                  name={`products[${index}].quantity`}
                                  id={`products[${index}].quantity`}
                                  placeholder="Enter quantity"
                                  value={product.quantity}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  min="1"
                                  className={`form-control ${
                                    formik.touched.products?.[index]
                                      ?.quantity &&
                                    formik.errors.products?.[index]?.quantity
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  style={{
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  }}
                                />
                                {formik.touched.products?.[index]?.quantity &&
                                  formik.errors.products?.[index]?.quantity && (
                                    <div className="invalid-feedback">
                                      {formik.errors.products[index].quantity}
                                    </div>
                                  )}
                              </Col>
                              <Col md="3">
                                <Button
                                  color="danger"
                                  onClick={() => removeProduct(index)}
                                  disabled={formik.values.products.length === 1}
                                  className="hover-scale"
                                  style={{
                                    borderRadius: "8px",
                                    width: "100%",
                                  }}
                                >
                                  Remove
                                </Button>
                              </Col>
                            </Row>
                          ))}
                          <Button
                            color="primary"
                            onClick={addProduct}
                            className="mt-2 hover-scale"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 4px 10px rgba(0, 123, 255, 0.3)",
                            }}
                          >
                            Add Product
                          </Button>
                          {formik.touched.products &&
                            formik.errors.products && (
                              <div
                                className="invalid-feedback"
                                style={{ display: "block" }}
                              >
                                {typeof formik.errors.products === "string"
                                  ? formik.errors.products
                                  : "Please fill all product fields correctly"}
                              </div>
                            )}
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
                          }}
                          className="hover-scale"
                        >
                          {isSubmitting
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

export default MarketDemandForm;
