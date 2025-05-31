import React, { useState } from "react";
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
  Table,
} from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

// Static data (replace with API calls if needed)
const poDetails = {
  poId: "PO-001",
  date: "2025-03-09",
  supplier: "MediCorp",
  products: [
    { hsn: "300490", manufacturer: "MediCorp", brand: "BrandA", product: "Paracetamol", pack: "10x10" },
    { hsn: "300491", manufacturer: "PharmaPlus", brand: "BrandB", product: "Ibuprofen", pack: "5x20" },
  ],
};

// Validation schema using Yup
const validationSchema = Yup.object({
  invoiceNo: Yup.string().required("Invoice No. is required"),
  lineItems: Yup.array().of(
    Yup.object().shape({
      quantity: Yup.number()
        .min(1, "Quantity must be at least 1")
        .required("Quantity is required"),
      batchNo: Yup.string().required("Batch No. is required"),
      expireDate: Yup.string().required("Expire Date is required"),
      freeQuantity: Yup.number().min(0, "Free Quantity cannot be negative"),
      mrp: Yup.number()
        .min(0, "MRP cannot be negative")
        .required("MRP is required"),
      purchasePrice: Yup.number()
        .min(0, "Purchase Price cannot be negative")
        .required("Purchase Price is required"),
      discount: Yup.number().min(0, "Discount cannot be negative"),
    })
  ),
});

const PurchaseEntryForm = () => {
  const navigate = useNavigate();
  const [prn] = useState(`PRN-${Date.now()}`); // Auto-generated PRN
  const currentDate = new Date().toISOString().split("T")[0]; // Current date

  const initialValues = {
    prn,
    date: currentDate,
    poId: poDetails.poId,
    poDate: poDetails.date,
    supplier: poDetails.supplier,
    invoiceNo: "INV-123", // Auto-filled from Purchase Receipt (static example)
    lineItems: poDetails.products.map((product, index) => ({
      srNo: index + 1,
      hsn: product.hsn,
      manufacturer: product.manufacturer,
      brand: product.brand,
      product: product.product,
      pack: product.pack,
      quantity: "",
      batchNo: "",
      expireDate: "",
      freeQuantity: 0,
      mrp: "",
      purchasePrice: "",
      purchaseAmount: 0,
      discount: 0,
      gst: 0, // Assuming 5% GST for simplicity
      subTotal: 0,
      cess: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      totalCost: 0,
    })),
  };

  const calculateLineItem = (item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const freeQuantity = parseFloat(item.freeQuantity) || 0;
    const mrp = parseFloat(item.mrp) || 0;
    const purchasePrice = parseFloat(item.purchasePrice) || 0;
    const discount = parseFloat(item.discount) || 0;

    const purchaseAmount = purchasePrice * quantity;
    const discountAmount = (purchaseAmount * discount) / 100;
    const subTotal = purchaseAmount - discountAmount;
    const gstRate = 5; // Static GST rate (replace with dynamic logic if needed)
    const gst = (subTotal * gstRate) / 100;
    const cgst = gst / 2; // Assuming equal split for CGST/SGST
    const sgst = gst / 2;
    const igst = 0; // Assuming intra-state; adjust for inter-state
    const cess = 0; // Static cess (replace with dynamic logic if applicable)
    const totalCost = subTotal + gst + cess;

    return { ...item, purchaseAmount, subTotal, gst, cgst, sgst, igst, cess, totalCost };
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form Values:", values);
    setTimeout(() => {
      Swal.fire({
        title: "Success!",
        text: "Purchase entry submitted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        setSubmitting(false);
        navigate("/purchase-entry-list"); // Adjust the navigation path as needed
      });
    }, 1000);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Purchase Management" breadcrumbItem="Add Purchase Entry" />
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
                      Add Purchase Entry
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
                          {/* PRN */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="prn" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                PRN (Purchase Received No.)
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="prn"
                                id="prn"
                                disabled
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                            </FormGroup>
                          </Col>

                          {/* Date */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="date" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Date
                              </Label>
                              <Field
                                as={Input}
                                type="date"
                                name="date"
                                id="date"
                                disabled
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                            </FormGroup>
                          </Col>

                          {/* PO ID */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="poId" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                PO ID
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="poId"
                                id="poId"
                                disabled
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                            </FormGroup>
                          </Col>

                          {/* PO Date */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="poDate" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                PO Date
                              </Label>
                              <Field
                                as={Input}
                                type="date"
                                name="poDate"
                                id="poDate"
                                disabled
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                            </FormGroup>
                          </Col>

                          {/* Supplier */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="supplier" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Supplier
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="supplier"
                                id="supplier"
                                disabled
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                            </FormGroup>
                          </Col>

                          {/* Invoice No */}
                          <Col md="6">
                            <FormGroup>
                              <Label for="invoiceNo" className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                Invoice No.
                              </Label>
                              <Field
                                as={Input}
                                type="text"
                                name="invoiceNo"
                                id="invoiceNo"
                                className={`form-control ${errors.invoiceNo && touched.invoiceNo ? "is-invalid" : ""}`}
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                              <ErrorMessage name="invoiceNo" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>

                          {/* Product Line Items */}
                          <Col md="12">
                            <Label className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                              Product Line Items
                            </Label>
                            <div style={{ overflowX: "auto" }}>
                              <Table className="table table-striped table-hover align-middle" responsive>
                                <thead style={{ background: "linear-gradient(90deg, #007bff, #00c4cc)", color: "#fff" }}>
                                  <tr>
                                    <th>Sr. No.</th>
                                    <th>HSN</th>
                                    <th>Manufacturer</th>
                                    <th>Brand</th>
                                    <th>Product</th>
                                    <th>Pack</th>
                                    <th>Quantity</th>
                                    <th>Batch No.</th>
                                    <th>Expire Date</th>
                                    <th>Free Quantity</th>
                                    <th>MRP</th>
                                    <th>Purchase Price</th>
                                    <th>Purchase Amount</th>
                                    <th>Discount (%)</th>
                                    <th>GST</th>
                                    <th>Sub Total</th>
                                    <th>Cess</th>
                                    <th>CGST</th>
                                    <th>SGST</th>
                                    <th>IGST</th>
                                    <th>Total Cost</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {values.lineItems.map((item, index) => {
                                    const calculatedItem = calculateLineItem(item);
                                    return (
                                      <tr key={index}>
                                        <td>{item.srNo}</td>
                                        <td>{item.hsn}</td>
                                        <td>{item.manufacturer}</td>
                                        <td>{item.brand}</td>
                                        <td>{item.product}</td>
                                        <td>{item.pack}</td>
                                        <td>
                                          <Field
                                            as={Input}
                                            type="number"
                                            name={`lineItems[${index}].quantity`}
                                            className={`form-control ${errors.lineItems?.[index]?.quantity && touched.lineItems?.[index]?.quantity ? "is-invalid" : ""}`}
                                            style={{ padding: "5px" }}
                                            onChange={(e) => {
                                              setFieldValue(`lineItems[${index}].quantity`, e.target.value);
                                              const updatedItem = calculateLineItem({
                                                ...item,
                                                quantity: e.target.value,
                                              });
                                              setFieldValue(`lineItems[${index}]`, updatedItem);
                                            }}
                                          />
                                          <ErrorMessage name={`lineItems[${index}].quantity`} component="div" className="invalid-feedback" />
                                        </td>
                                        <td>
                                          <Field
                                            as={Input}
                                            type="text"
                                            name={`lineItems[${index}].batchNo`}
                                            className={`form-control ${errors.lineItems?.[index]?.batchNo && touched.lineItems?.[index]?.batchNo ? "is-invalid" : ""}`}
                                            style={{ padding: "5px" }}
                                          />
                                          <ErrorMessage name={`lineItems[${index}].batchNo`} component="div" className="invalid-feedback" />
                                        </td>
                                        <td>
                                          <Field
                                            as={Input}
                                            type="date"
                                            name={`lineItems[${index}].expireDate`}
                                            className={`form-control ${errors.lineItems?.[index]?.expireDate && touched.lineItems?.[index]?.expireDate ? "is-invalid" : ""}`}
                                            style={{ padding: "5px" }}
                                          />
                                          <ErrorMessage name={`lineItems[${index}].expireDate`} component="div" className="invalid-feedback" />
                                        </td>
                                        <td>
                                          <Field
                                            as={Input}
                                            type="number"
                                            name={`lineItems[${index}].freeQuantity`}
                                            className={`form-control ${errors.lineItems?.[index]?.freeQuantity && touched.lineItems?.[index]?.freeQuantity ? "is-invalid" : ""}`}
                                            style={{ padding: "5px" }}
                                            onChange={(e) => {
                                              setFieldValue(`lineItems[${index}].freeQuantity`, e.target.value);
                                              const updatedItem = calculateLineItem({
                                                ...item,
                                                freeQuantity: e.target.value,
                                              });
                                              setFieldValue(`lineItems[${index}]`, updatedItem);
                                            }}
                                          />
                                          <ErrorMessage name={`lineItems[${index}].freeQuantity`} component="div" className="invalid-feedback" />
                                        </td>
                                        <td>
                                          <Field
                                            as={Input}
                                            type="number"
                                            name={`lineItems[${index}].mrp`}
                                            className={`form-control ${errors.lineItems?.[index]?.mrp && touched.lineItems?.[index]?.mrp ? "is-invalid" : ""}`}
                                            style={{ padding: "5px" }}
                                            onChange={(e) => {
                                              setFieldValue(`lineItems[${index}].mrp`, e.target.value);
                                              const updatedItem = calculateLineItem({
                                                ...item,
                                                mrp: e.target.value,
                                              });
                                              setFieldValue(`lineItems[${index}]`, updatedItem);
                                            }}
                                          />
                                          <ErrorMessage name={`lineItems[${index}].mrp`} component="div" className="invalid-feedback" />
                                        </td>
                                        <td>
                                          <Field
                                            as={Input}
                                            type="number"
                                            name={`lineItems[${index}].purchasePrice`}
                                            className={`form-control ${errors.lineItems?.[index]?.purchasePrice && touched.lineItems?.[index]?.purchasePrice ? "is-invalid" : ""}`}
                                            style={{ padding: "5px" }}
                                            onChange={(e) => {
                                              setFieldValue(`lineItems[${index}].purchasePrice`, e.target.value);
                                              const updatedItem = calculateLineItem({
                                                ...item,
                                                purchasePrice: e.target.value,
                                              });
                                              setFieldValue(`lineItems[${index}]`, updatedItem);
                                            }}
                                          />
                                          <ErrorMessage name={`lineItems[${index}].purchasePrice`} component="div" className="invalid-feedback" />
                                        </td>
                                        <td>{calculatedItem.purchaseAmount.toFixed(2)}</td>
                                        <td>
                                          <Field
                                            as={Input}
                                            type="number"
                                            name={`lineItems[${index}].discount`}
                                            className={`form-control ${errors.lineItems?.[index]?.discount && touched.lineItems?.[index]?.discount ? "is-invalid" : ""}`}
                                            style={{ padding: "5px" }}
                                            onChange={(e) => {
                                              setFieldValue(`lineItems[${index}].discount`, e.target.value);
                                              const updatedItem = calculateLineItem({
                                                ...item,
                                                discount: e.target.value,
                                              });
                                              setFieldValue(`lineItems[${index}]`, updatedItem);
                                            }}
                                          />
                                          <ErrorMessage name={`lineItems[${index}].discount`} component="div" className="invalid-feedback" />
                                        </td>
                                        <td>{calculatedItem.gst.toFixed(2)}</td>
                                        <td>{calculatedItem.subTotal.toFixed(2)}</td>
                                        <td>{calculatedItem.cess.toFixed(2)}</td>
                                        <td>{calculatedItem.cgst.toFixed(2)}</td>
                                        <td>{calculatedItem.sgst.toFixed(2)}</td>
                                        <td>{calculatedItem.igst.toFixed(2)}</td>
                                        <td>{calculatedItem.totalCost.toFixed(2)}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </Table>
                            </div>
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
        .table-container {
          overflow-x: auto;
        }
        .table {
          min-width: 1200px; /* Ensures horizontal scroll on smaller screens */
        }
        .table-striped tbody tr:nth-of-type(odd) {
          background-color: rgba(0, 0, 0, 0.03);
        }
        .table-hover tbody tr:hover {
          background-color: rgba(0, 123, 255, 0.1);
        }
      `}</style>
    </React.Fragment>
  );
};

export default PurchaseEntryForm;