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
import { useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schema using Yup
const validationSchema = Yup.object({
  batchNumber: Yup.string().required("Batch Number is required"),
  costPrice: Yup.number()
    .required("Cost Price is required")
    .min(0, "Cost Price cannot be negative"),
  category: Yup.string().required("Category is required"),
  brand: Yup.string().required("Brand is required"),
  manufacturer: Yup.string().required("Manufacturer is required"),
  unitOfMeasurement: Yup.string().required("Unit of Measurement is required"),
  location: Yup.string().required("Location is required"),
});

const TotalInventoryForm = () => {
  const navigate = useNavigate();

  const initialValues = {
    productName: "Sample Product", // Auto-filled
    productId: "PROD12345", // Auto-filled
    category: "",
    brand: "",
    manufacturer: "",
    batchNumber: "",
    quantityInStock: 50, // Auto-filled
    unitOfMeasurement: "",
    purchaseDate: "2025-03-09", // Auto-filled (today's date)
    expiryDate: "2026-03-09", // Auto-filled
    costPrice: "",
    sellingPrice: 1500, // Auto-filled
    location: "",
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form Values:", values);
    setTimeout(() => {
      alert("Inventory details submitted successfully!");
      setSubmitting(false);
      navigate("/inventory-list"); // Adjust the navigation path as needed
    }, 1000);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Inventory Management" breadcrumbItem="Add Inventory Item" />
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
                      Add Inventory Item
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
                          {/* Product Name (Auto-Fill) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="productName" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Product Name
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="productName"
                                id="productName"
                                disabled
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                            </FormGroup>
                          </Col>

                          {/* Product ID (Auto-Fill) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="productId" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Product ID
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="productId"
                                id="productId"
                                disabled
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                            </FormGroup>
                          </Col>

                          {/* Category (Dropdown) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="category" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Category
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="category"
                                id="category"
                                className={`form-control ${errors.category && touched.category ? "is-invalid" : ""}`}
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              >
                                <option value="">Select Category</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Food">Food</option>
                              </Field>
                              <ErrorMessage name="category" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>

                          {/* Brand (Dropdown) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="brand" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Brand
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="brand"
                                id="brand"
                                className={`form-control ${errors.brand && touched.brand ? "is-invalid" : ""}`}
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              >
                                <option value="">Select Brand</option>
                                <option value="BrandA">Brand A</option>
                                <option value="BrandB">Brand B</option>
                                <option value="BrandC">Brand C</option>
                              </Field>
                              <ErrorMessage name="brand" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>

                          {/* Manufacturer (Dropdown) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="manufacturer" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Manufacturer
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="manufacturer"
                                id="manufacturer"
                                className={`form-control ${errors.manufacturer && touched.manufacturer ? "is-invalid" : ""}`}
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              >
                                <option value="">Select Manufacturer</option>
                                <option value="ManufA">Manufacturer A</option>
                                <option value="ManufB">Manufacturer B</option>
                                <option value="ManufC">Manufacturer C</option>
                              </Field>
                              <ErrorMessage name="manufacturer" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>

                          {/* Batch Number (Input) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="batchNumber" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Batch Number
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="batchNumber"
                                id="batchNumber"
                                placeholder="Enter Batch Number"
                                className={`form-control ${errors.batchNumber && touched.batchNumber ? "is-invalid" : ""}`}
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                              <ErrorMessage name="batchNumber" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>

                          {/* Quantity in Stock (Auto) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="quantityInStock" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Quantity in Stock
                              </Label>
                              <Field
                                as={Input}
                                type="number"
                                name="quantityInStock"
                                id="quantityInStock"
                                disabled
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                            </FormGroup>
                          </Col>

                          {/* Unit of Measurement (Dropdown) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="unitOfMeasurement" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Unit of Measurement
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="unitOfMeasurement"
                                id="unitOfMeasurement"
                                className={`form-control ${errors.unitOfMeasurement && touched.unitOfMeasurement ? "is-invalid" : ""}`}
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              >
                                <option value="">Select Unit</option>
                                <option value="Pieces">Pieces</option>
                                <option value="Kilograms">Kilograms</option>
                                <option value="Liters">Liters</option>
                              </Field>
                              <ErrorMessage name="unitOfMeasurement" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>

                          {/* Purchase Date (Auto) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="purchaseDate" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Purchase Date
                              </Label>
                              <Field
                                as={Input}
                                type="date"
                                name="purchaseDate"
                                id="purchaseDate"
                                disabled
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                            </FormGroup>
                          </Col>

                          {/* Expiry Date (Auto) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="expiryDate" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Expiry Date
                              </Label>
                              <Field
                                as={Input}
                                type="date"
                                name="expiryDate"
                                id="expiryDate"
                                disabled
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                            </FormGroup>
                          </Col>

                          {/* Cost Price (Input) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="costPrice" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Cost Price
                              </Label>
                              <Field
                                as={Input}
                                type="number"
                                name="costPrice"
                                id="costPrice"
                                placeholder="Enter Cost Price"
                                className={`form-control ${errors.costPrice && touched.costPrice ? "is-invalid" : ""}`}
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                              <ErrorMessage name="costPrice" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>

                          {/* Selling Price (Auto) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="sellingPrice" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Selling Price
                              </Label>
                              <Field
                                as={Input}
                                type="number"
                                name="sellingPrice"
                                id="sellingPrice"
                                disabled
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                            </FormGroup>
                          </Col>

                          {/* Location (Dropdown) */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="location" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Location
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="location"
                                id="location"
                                className={`form-control ${errors.location && touched.location ? "is-invalid" : ""}`}
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              >
                                <option value="">Select Location</option>
                                <option value="Warehouse1">Warehouse 1</option>
                                <option value="Warehouse2">Warehouse 2</option>
                                <option value="Store">Store</option>
                              </Field>
                              <ErrorMessage name="location" component="div" className="invalid-feedback" />
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

export default TotalInventoryForm;