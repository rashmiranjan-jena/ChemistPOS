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
import { useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schema using Yup
const validationSchema = Yup.object({
  supplierName: Yup.string().required("Supplier Name is required"),
});

const PurchaseWiseInventoryForm = () => {
  const navigate = useNavigate();

  const initialValues = {
    poNumber: "PO12345", // Auto-filled
    purchaseDate: "2025-02-15", // Auto-filled (example date)
    supplierName: "", // Dropdown selection
    productList: [], // Auto-filled (array of products)
    quantityReceived: 0, // Auto-filled
    totalCost: 0, // Auto-calculated
  };

  // Sample supplier data with purchase details (replace with real data from API/database)
  const suppliers = [
    {
      name: "Supplier A",
      products: ["Product 1", "Product 2"],
      quantity: 200,
      cost: 5000,
    },
    {
      name: "Supplier B",
      products: ["Product 3"],
      quantity: 150,
      cost: 3000,
    },
    {
      name: "Supplier C",
      products: ["Product 4", "Product 5"],
      quantity: 300,
      cost: 7500,
    },
  ];

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form Values:", values);
    setTimeout(() => {
      alert("Purchase-wise inventory details submitted successfully!");
      setSubmitting(false);
      navigate("/purchase-inventory-list"); // Adjust the navigation path as needed
    }, 1000);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Inventory Management" breadcrumbItem="Purchase-Wise Inventory" />
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
                      Purchase-Wise Inventory
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
                    {({ values, setFieldValue, isSubmitting, errors, touched }) => {
                      // Update auto-filled fields when supplierName changes
                      useEffect(() => {
                        if (values.supplierName) {
                          const selectedSupplier = suppliers.find(
                            (supplier) => supplier.name === values.supplierName
                          );
                          if (selectedSupplier) {
                            setFieldValue("productList", selectedSupplier.products);
                            setFieldValue("quantityReceived", selectedSupplier.quantity);
                            setFieldValue("totalCost", selectedSupplier.cost);
                          }
                        } else {
                          // Reset fields if no supplier is selected
                          setFieldValue("productList", []);
                          setFieldValue("quantityReceived", 0);
                          setFieldValue("totalCost", 0);
                        }
                      }, [values.supplierName, setFieldValue]);

                      return (
                        <Form>
                          <Row className="g-4">
                            {/* PO Number (Auto) */}
                            <Col md="6">
                              <FormGroup>
                                <Label
                                  for="poNumber"
                                  className="fw-bold text-dark"
                                  style={{ fontSize: "14px" }}
                                >
                                  PO Number
                                </Label>
                                <Field
                                  as={Input}
                                  type="text"
                                  name="poNumber"
                                  id="poNumber"
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

                            {/* Purchase Date (Auto) */}
                            <Col md="6">
                              <FormGroup>
                                <Label
                                  for="purchaseDate"
                                  className="fw-bold text-dark"
                                  style={{ fontSize: "14px" }}
                                >
                                  Purchase Date
                                </Label>
                                <Field
                                  as={Input}
                                  type="date"
                                  name="purchaseDate"
                                  id="purchaseDate"
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

                            {/* Supplier Name (Dropdown) */}
                            <Col md="6">
                              <FormGroup>
                                <Label
                                  for="supplierName"
                                  className="fw-bold text-dark"
                                  style={{ fontSize: "14px" }}
                                >
                                  Supplier Name
                                </Label>
                                <Field
                                  as={Input}
                                  type="select"
                                  name="supplierName"
                                  id="supplierName"
                                  className={`form-control ${
                                    errors.supplierName && touched.supplierName ? "is-invalid" : ""
                                  }`}
                                  style={{
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    padding: "10px",
                                  }}
                                >
                                  <option value="">Select Supplier</option>
                                  {suppliers.map((supplier) => (
                                    <option key={supplier.name} value={supplier.name}>
                                      {supplier.name}
                                    </option>
                                  ))}
                                </Field>
                                <ErrorMessage
                                  name="supplierName"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </FormGroup>
                            </Col>

                            {/* Product List (Auto) */}
                            <Col md="6">
                              <FormGroup>
                                <Label
                                  for="productList"
                                  className="fw-bold text-dark"
                                  style={{ fontSize: "14px" }}
                                >
                                  Product List
                                </Label>
                                <Field
                                  as={Input}
                                  type="textarea"
                                  name="productList"
                                  id="productList"
                                  disabled
                                  value={values.productList.join(", ")} // Display as comma-separated string
                                  className="form-control"
                                  style={{
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    padding: "10px",
                                    minHeight: "100px",
                                  }}
                                />
                              </FormGroup>
                            </Col>

                            {/* Quantity Received (Auto) */}
                            <Col md="6">
                              <FormGroup>
                                <Label
                                  for="quantityReceived"
                                  className="fw-bold text-dark"
                                  style={{ fontSize: "14px" }}
                                >
                                  Quantity Received
                                </Label>
                                <Field
                                  as={Input}
                                  type="number"
                                  name="quantityReceived"
                                  id="quantityReceived"
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

                            {/* Total Cost (Auto Calculation) */}
                            <Col md="6">
                              <FormGroup>
                                <Label
                                  for="totalCost"
                                  className="fw-bold text-dark"
                                  style={{ fontSize: "14px" }}
                                >
                                  Total Cost ($)
                                </Label>
                                <Field
                                  as={Input}
                                  type="number"
                                  name="totalCost"
                                  id="totalCost"
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
                      );
                    }}
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

export default PurchaseWiseInventoryForm;