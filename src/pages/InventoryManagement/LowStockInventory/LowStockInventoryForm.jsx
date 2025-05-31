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
  reorderLevel: Yup.number()
    .required("Reorder Level is required")
    .min(1, "Reorder Level must be at least 1")
    .max(1000, "Reorder Level cannot exceed 1000"),
  supplier: Yup.string().required("Supplier is required"),
});

const LowStockInventoryForm = () => {
  const navigate = useNavigate();

  const initialValues = {
    productName: "Sample Product", // Auto-filled
    productId: "LOW12345", // Auto-filled
    currentStock: 10, // Auto-filled
    reorderLevel: "", // User input
    supplier: "", // Dropdown selection
  };

  // Sample supplier data (replace with real data from API/database)
  const suppliers = [
    { name: "Supplier A", id: "SUPA001" },
    { name: "Supplier B", id: "SUPB002" },
    { name: "Supplier C", id: "SUPC003" },
  ];

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form Values:", values);
    setTimeout(() => {
      alert("Low stock inventory details submitted successfully!");
      setSubmitting(false);
      navigate("/low-stock-inventory-list"); // Adjust the navigation path as needed
    }, 1000);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Inventory Management" breadcrumbItem="Low Stock Inventory" />
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
                      Low Stock Inventory
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
                          {/* Product Name (Auto) */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="productName"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Product Name
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="productName"
                                id="productName"
                                disabled
                                className="form-control"
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                            </FormGroup>
                          </Col>

                          {/* Product ID (Auto) */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="productId"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Product ID
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="productId"
                                id="productId"
                                disabled
                                className="form-control"
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                            </FormGroup>
                          </Col>

                          {/* Current Stock (Auto) */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="currentStock"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Current Stock
                              </Label>
                              <Field
                                as={Input}
                                type="number"
                                name="currentStock"
                                id="currentStock"
                                disabled
                                className="form-control"
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                  backgroundColor: values.currentStock <= values.reorderLevel && values.reorderLevel ? "#f8d7da" : "#e9ecef",
                                }}
                              />
                            </FormGroup>
                          </Col>

                          {/* Reorder Level (Input) */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="reorderLevel"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Reorder Level
                              </Label>
                              <Field
                                as={Input}
                                type="number"
                                name="reorderLevel"
                                id="reorderLevel"
                                placeholder="Enter reorder level"
                                className={`form-control ${
                                  errors.reorderLevel && touched.reorderLevel ? "is-invalid" : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              />
                              <ErrorMessage
                                name="reorderLevel"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          {/* Supplier (Dropdown) */}
                          <Col md="6">
                            <FormGroup>
                              <Label
                                for="supplier"
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Supplier
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="supplier"
                                id="supplier"
                                className={`form-control ${
                                  errors.supplier && touched.supplier ? "is-invalid" : ""
                                }`}
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                }}
                              >
                                <option value="">Select Supplier</option>
                                {suppliers.map((supplier) => (
                                  <option key={supplier.id} value={supplier.name}>
                                    {supplier.name}
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage name="supplier" component="div" className="invalid-feedback" />
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

export default LowStockInventoryForm;