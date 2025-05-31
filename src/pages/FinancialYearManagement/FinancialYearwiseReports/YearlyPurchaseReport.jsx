import React, { useRef } from "react";
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
import { FaEye, FaEdit, FaTrash, FaFileExcel } from "react-icons/fa"; 
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { jsPDF } from "jspdf"; 
import "jspdf-autotable"; 
import * as XLSX from "xlsx";

// Validation schema using Yup
const validationSchema = Yup.object({
  financialYear: Yup.string().required("Financial Year is required"),
  supplier: Yup.string(), 
  brand: Yup.string(), 
  product: Yup.string(), 
  startDate: Yup.date()
    .required("Start Date is required")
    .max(Yup.ref("endDate"), "Start Date must be before End Date"),
  endDate: Yup.date()
    .required("End Date is required")
    .min(Yup.ref("startDate"), "End Date must be after Start Date"),
});

const YearlyPurchaseReport = () => {
  const navigate = useNavigate();
  const reportRef = useRef(null); 

  const initialValues = {
    financialYear: "",
    supplier: "",
    brand: "",
    product: "",
    startDate: "",
    endDate: "",
  };

  const purchaseDataList = [
    {
      id: 1,
      financialYear: "2024-2025",
      supplier: "Supplier A",
      brand: "Brand X",
      product: "Product 1",
      date: "2024-01-10",
      totalPurchases: "250000",
      gstPaid: "45000",
      discountsReceived: "15000",
      pendingPayments: "30000",
    },
    {
      id: 2,
      financialYear: "2024-2025",
      supplier: "Supplier B",
      brand: "Brand Y",
      product: "Product 2",
      date: "2024-02-15",
      totalPurchases: "300000",
      gstPaid: "54000",
      discountsReceived: "20000",
      pendingPayments: "40000",
    },
    {
      id: 3,
      financialYear: "2024-2025",
      supplier: "Supplier C",
      brand: "Brand Z",
      product: "Product 3",
      date: "2024-03-20",
      totalPurchases: "200000",
      gstPaid: "36000",
      discountsReceived: "15000",
      pendingPayments: "30000",
    },
  ];

  const filterOptions = {
    suppliers: ["Supplier A", "Supplier B", "Supplier C"],
    brands: ["Brand X", "Brand Y", "Brand Z"],
    products: ["Product 1", "Product 2", "Product 3"],
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Filter Values:", values);
    // Implement filtering logic here
    const filteredData = purchaseDataList.filter((purchase) => {
      const purchaseDate = new Date(purchase.date);
      const startDate = new Date(values.startDate);
      const endDate = new Date(values.endDate);
      return (
        (!values.financialYear || purchase.financialYear === values.financialYear) &&
        (!values.supplier || purchase.supplier === values.supplier) &&
        (!values.brand || purchase.brand === values.brand) &&
        (!values.product || purchase.product === values.product) &&
        purchaseDate >= startDate &&
        purchaseDate <= endDate
      );
    });
    console.log("Filtered Data:", filteredData);
    setTimeout(() => {
      setSubmitting(false);
    }, 1000);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleView = (id) => {
    navigate(`/purchase-details/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/edit-purchase/${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete purchase with ID: ${id}`);
  
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(12);
    doc.text("Yearly Purchase Report", 14, 20);

    // Define table columns and data
    const headers = [
      "Sr.No",
      "ID",
      "Financial Year",
      "Supplier",
      "Brand",
      "Product",
      "Date",
      "Total Purchases",
      "GST Paid",
      "Discounts Received",
      "Pending Payments",
    ];

    const data = purchaseDataList.map((purchase, index) => [
      index + 1,
      purchase.id,
      purchase.financialYear,
      purchase.supplier,
      purchase.brand,
      purchase.product,
      purchase.date,
      `${purchase.totalPurchases}`,
      `${purchase.gstPaid}`,
      `${purchase.discountsReceived}`,
      `${purchase.pendingPayments}`,
    ]);

    doc.autoTable({
      head: [headers],
      body: data,
      startY: 30,
      theme: "striped",
      headStyles: { fillColor: [0, 123, 255] }, 
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 10 }, 
        1: { cellWidth: 10 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 }, 
        4: { cellWidth: 20 }, 
        5: { cellWidth: 20 },
        6: { cellWidth: 20 }, 
        7: { cellWidth: 20 }, 
        8: { cellWidth: 20 },
        9: { cellWidth: 20 },
        10: { cellWidth: 20 },
      },
    });

    // Save the PDF
    doc.save(`Yearly_Purchase_Report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  // Excel Download Handler
  const handleDownloadExcel = () => {
    const headers = [
      "Sr.No",
      "ID",
      "Financial Year",
      "Supplier",
      "Brand",
      "Product",
      "Date",
      "Total Purchases",
      "GST Paid",
      "Discounts Received",
      "Pending Payments",
    ];
    const rows = purchaseDataList.map((purchase, index) => [
      index + 1,
      purchase.id,
      purchase.financialYear,
      purchase.supplier,
      purchase.brand,
      purchase.product,
      purchase.date,
      `${purchase.totalPurchases}`,
      `${purchase.gstPaid}`,
      `${purchase.discountsReceived}`,
      `${purchase.pendingPayments}`,
    ]);
    const data = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Purchase Report");
    XLSX.writeFile(wb, `Yearly_Purchase_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Financial Management" breadcrumbItem="Yearly Purchase Report" />

          <Row>
            <Col xs="12">
              <Card
                className="shadow-lg"
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  background: "#f8f9fa",
                }}
              >
                <CardBody className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
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
                      Yearly Purchase Report
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="success"
                        onClick={handleDownloadExcel}
                        style={{
                          height: "35px",
                          padding: "3px 10px",
                          borderRadius: "10px",
                          fontSize: "14px",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                          transition: "transform 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                        className="hover-scale"
                      >
                        <FaFileExcel style={{ fontSize: "18px" }} />
                        Download Excel
                      </Button>
                      <Button
                        color="danger"
                        onClick={handleDownloadPDF}
                        style={{
                          height: "35px",
                          padding: "3px 10px",
                          borderRadius: "10px",
                          fontSize: "14px",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                          transition: "transform 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                        className="hover-scale"
                      >
                        <i className="bx bx-printer" style={{ fontSize: "18px" }}></i>
                        Download PDF
                      </Button>
                      <Button
                        color="secondary"
                        onClick={handleBack}
                        style={{
                          height: "35px",
                          width: "35px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                          transition: "transform 0.3s ease",
                        }}
                        className="hover-scale"
                        title="Back"
                      >
                        <i className="bx bx-undo" style={{ fontSize: "18px" }}></i>
                      </Button>
                    </div>
                  </div>

                  {/* Filters */}
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ values, isSubmitting }) => (
                      <Form className="no-print">
                        <Row className="g-4 mb-4">
                          <Col md="2">
                            <FormGroup>
                              <Label for="financialYear" className="fw-bold text-dark">
                                Financial Year
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="financialYear"
                                id="financialYear"
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              >
                                <option value="">Select Financial Year</option>
                                <option value="2024-2025">2024-2025</option>
                                <option value="2023-2024">2023-2024</option>
                                <option value="2022-2023">2022-2023</option>
                              </Field>
                              <ErrorMessage name="financialYear" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>
                          <Col md="2">
                            <FormGroup>
                              <Label for="supplier" className="fw-bold text-dark">
                                Supplier
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="supplier"
                                id="supplier"
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              >
                                <option value="">All Suppliers</option>
                                {filterOptions.suppliers.map((supplier, index) => (
                                  <option key={index} value={supplier}>{supplier}</option>
                                ))}
                              </Field>
                            </FormGroup>
                          </Col>
                          <Col md="2">
                            <FormGroup>
                              <Label for="brand" className="fw-bold text-dark">
                                Brand
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="brand"
                                id="brand"
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              >
                                <option value="">All Brands</option>
                                {filterOptions.brands.map((brand, index) => (
                                  <option key={index} value={brand}>{brand}</option>
                                ))}
                              </Field>
                            </FormGroup>
                          </Col>
                          <Col md="2">
                            <FormGroup>
                              <Label for="product" className="fw-bold text-dark">
                                Product
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="product"
                                id="product"
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              >
                                <option value="">All Products</option>
                                {filterOptions.products.map((product, index) => (
                                  <option key={index} value={product}>{product}</option>
                                ))}
                              </Field>
                            </FormGroup>
                          </Col>
                          <Col md="2">
                            <FormGroup>
                              <Label for="startDate" className="fw-bold text-dark">
                                Start Date
                              </Label>
                              <Field
                                as={Input}
                                type="date"
                                name="startDate"
                                id="startDate"
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                              <ErrorMessage name="startDate" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>
                          <Col md="2">
                            <FormGroup>
                              <Label for="endDate" className="fw-bold text-dark">
                                End Date
                              </Label>
                              <Field
                                as={Input}
                                type="date"
                                name="endDate"
                                id="endDate"
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              />
                              <ErrorMessage name="endDate" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>
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
                              {isSubmitting ? "Filtering..." : "Apply Filters"}
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    )}
                  </Formik>

                  {/* Report Table */}
                  <div ref={reportRef} className="table-container">
                    <Table className="table table-striped table-hover align-middle" responsive>
                      <thead
                        style={{
                          background: "linear-gradient(90deg, #007bff, #00c4cc)",
                          color: "#fff",
                        }}
                      >
                        <tr>
                          <th>Sr.No</th>
                          <th>ID</th>
                          <th>Financial Year</th>
                          <th>Supplier</th>
                          <th>Brand</th>
                          <th>Product</th>
                          <th>Date</th>
                          <th>Total Purchases</th>
                          <th>GST Paid</th>
                          <th>Discounts Received</th>
                          <th>Pending Payments</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseDataList.map((purchase, index) => (
                          <tr key={purchase.id}>
                            <td>{index + 1}</td>
                            <td>{purchase.id}</td>
                            <td>{purchase.financialYear}</td>
                            <td>{purchase.supplier}</td>
                            <td>{purchase.brand}</td>
                            <td>{purchase.product}</td>
                            <td>{purchase.date}</td>
                            <td>₹{purchase.totalPurchases}</td>
                            <td>₹{purchase.gstPaid}</td>
                            <td>₹{purchase.discountsReceived}</td>
                            <td>₹{purchase.pendingPayments}</td>
                            <td>
                              <div className="d-flex gap-2 justify-content-center">
                                <FaEye
                                  style={{ fontSize: "18px", color: "#007bff", cursor: "pointer" }}
                                  onClick={() => handleView(purchase.id)}
                                  title="View"
                                />
                                <FaEdit
                                  style={{ fontSize: "18px", color: "#4caf50", cursor: "pointer" }}
                                  onClick={() => handleEdit(purchase.id)}
                                  title="Edit"
                                />
                                <FaTrash
                                  style={{ fontSize: "18px", color: "#f44336", cursor: "pointer" }}
                                  onClick={() => handleDelete(purchase.id)}
                                  title="Delete"
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <style jsx>{`
        .hover-scale:hover {
          transform: scale(1.1) !important;
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
          max-height: 400px; /* Adjust this value based on your needs */
          overflow-y: auto; /* Vertical scrolling */
          overflow-x: auto; /* Horizontal scrolling */
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .table {
          margin-bottom: 0;
          min-width: 1200px; /* Ensures horizontal scroll on smaller screens */
        }
        .table-striped tbody tr:nth-of-type(odd) {
          background-color: rgba(0, 0, 0, 0.03);
        }
        .table-hover tbody tr:hover {
          background-color: rgba(0, 123, 255, 0.1);
        }
        @media (max-width: 768px) {
          .d-flex.justify-content-between {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          .d-flex.gap-2 {
            width: 100%;
            justify-content: space-between;
          }
        }
        @media print {
          .table-container {
            box-shadow: none;
            border: 1px solid #000;
          }
          .table thead {
            background: #007bff !important;
            -webkit-print-color-adjust: exact;
          }
          .no-print {
            display: none; /* Hide filters during print */
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default YearlyPurchaseReport;