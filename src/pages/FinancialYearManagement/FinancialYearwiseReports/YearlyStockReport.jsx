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
import { FaEye, FaEdit, FaTrash } from "react-icons/fa"; // Icons for actions
import Breadcrumbs from "../../../components/Common/Breadcrumb"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { jsPDF } from "jspdf"; // Import jsPDF
import "jspdf-autotable"; // Import autotable plugin for table support
import * as XLSX from "xlsx"; // For Excel generation

// Validation schema using Yup
const validationSchema = Yup.object({
  financialYear: Yup.string().required("Financial Year is required"),
});

const YearlyStockReport = () => {
  const navigate = useNavigate();
  const reportRef = useRef(null); // Ref for table content

  // Initial values for filters
  const initialValues = {
    financialYear: "",
  };

  // Unified stock data (replace with actual data from your API)
  const stockData = {
    combinedData: [
      // Expiry Date-wise Inventory
      {
        type: "Expiry Date-wise Inventory",
        id: 1,
        financialYear: "2024-2025",
        supplier: "Supplier X",
        brand: "Brand A",
        product: "Product A",
        date: "2024-01-10",
        expiryDate: "2025-06-30",
        totalPurchases: "50000",
        gstPaid: "9000",
        discountsReceived: "2000",
        pendingPayments: "5000",
        quantity: 50,
      },
      {
        type: "Expiry Date-wise Inventory",
        id: 2,
        financialYear: "2024-2025",
        supplier: "Supplier Y",
        brand: "Brand B",
        product: "Product B",
        date: "2024-02-15",
        expiryDate: "2025-12-31",
        totalPurchases: "30000",
        gstPaid: "5400",
        discountsReceived: "1500",
        pendingPayments: "3000",
        quantity: 30,
      },
      {
        type: "Expiry Date-wise Inventory",
        id: 3,
        financialYear: "2024-2025",
        supplier: "Supplier Z",
        brand: "Brand C",
        product: "Product C",
        date: "2024-03-20",
        expiryDate: "2026-03-15",
        totalPurchases: "20000",
        gstPaid: "3600",
        discountsReceived: "1000",
        pendingPayments: "2000",
        quantity: 20,
      },
      // Low Stock Report
      {
        type: "Low Stock Report",
        product: "Product D",
        quantity: 5,
      },
      {
        type: "Low Stock Report",
        product: "Product E",
        quantity: 8,
      },
      // Supplier-wise Inventory
      {
        type: "Supplier-wise Inventory",
        supplier: "Supplier X",
        totalQuantity: 100,
      },
      {
        type: "Supplier-wise Inventory",
        supplier: "Supplier Y",
        totalQuantity: 60,
      },
      {
        type: "Supplier-wise Inventory",
        supplier: "Supplier Z",
        totalQuantity: 40,
      },
      // Opening & Closing Stock
      {
        type: "Opening Stock",
        stockValue: "200",
      },
      {
        type: "Closing Stock",
        stockValue: "150",
      },
    ],
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Filter Values:", values);
    // Implement API call or data fetch based on financial year here
    setTimeout(() => {
      setSubmitting(false);
    }, 1000);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleView = (id) => {
    if (id) navigate(`/stock-details/${id}`);
  };

  const handleEdit = (id) => {
    if (id) navigate(`/edit-stock/${id}`);
  };

  const handleDelete = (id) => {
    if (id) console.log(`Delete stock with ID: ${id}`);
    // Implement delete logic here (e.g., API call)
  };

  // PDF Download Handler using jsPDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Yearly Stock Report", 14, 20);

    // Single Combined Table
    doc.autoTable({
      head: [
        [
          "Type",
          "Sr.No",
          "ID",
          "Financial Year",
          "Supplier",
          "Brand",
          "Product",
          "Date",
          "Expiry Date",
          "Total Purchases",
          "GST Paid",
          "Discounts Received",
          "Pending Payments",
          "Quantity",
          "Total Quantity",
          "Stock Value",
        ],
      ],
      body: stockData.combinedData.map((item, index) => [
        item.type,
        index + 1,
        item.id || "",
        item.financialYear || "",
        item.supplier || "",
        item.brand || "",
        item.product || "",
        item.date || "",
        item.expiryDate || "",
        item.totalPurchases ? `₹${item.totalPurchases}` : "",
        item.gstPaid ? `₹${item.gstPaid}` : "",
        item.discountsReceived ? `₹${item.discountsReceived}` : "",
        item.pendingPayments ? `₹${item.pendingPayments}` : "",
        item.quantity || "",
        item.totalQuantity || "",
        item.stockValue || "",
      ]),
      startY: 30,
      theme: "striped",
      headStyles: { fillColor: [0, 123, 255] }, // Blue header
      styles: { fontSize: 8, cellPadding: 2 }, // Smaller font for more columns
      columnStyles: {
        0: { cellWidth: 20 }, // Type
        1: { cellWidth: 10 }, // Sr.No
        2: { cellWidth: 10 }, // ID
        3: { cellWidth: 20 }, // Financial Year
        4: { cellWidth: 20 }, // Supplier
        5: { cellWidth: 20 }, // Brand
        6: { cellWidth: 20 }, // Product
        7: { cellWidth: 20 }, // Date
        8: { cellWidth: 20 }, // Expiry Date
        9: { cellWidth: 20 }, // Total Purchases
        10: { cellWidth: 15 }, // GST Paid
        11: { cellWidth: 20 }, // Discounts Received
        12: { cellWidth: 20 }, // Pending Payments
        13: { cellWidth: 15 }, // Quantity
        14: { cellWidth: 15 }, // Total Quantity
        15: { cellWidth: 15 }, // Stock Value
      },
    });

    // Save the PDF
    doc.save(`Yearly_Stock_Report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  // Excel Download Handler
  const handleDownloadExcel = () => {
    const data = [
      ["Yearly Stock Report"],
      [
        "Type",
        "Sr.No",
        "ID",
        "Financial Year",
        "Supplier",
        "Brand",
        "Product",
        "Date",
        "Expiry Date",
        "Total Purchases",
        "GST Paid",
        "Discounts Received",
        "Pending Payments",
        "Quantity",
        "Total Quantity",
        "Stock Value",
      ],
      ...stockData.combinedData.map((item, index) => [
        item.type,
        index + 1,
        item.id || "",
        item.financialYear || "",
        item.supplier || "",
        item.brand || "",
        item.product || "",
        item.date || "",
        item.expiryDate || "",
        item.totalPurchases ? `₹${item.totalPurchases}` : "",
        item.gstPaid ? `₹${item.gstPaid}` : "",
        item.discountsReceived ? `₹${item.discountsReceived}` : "",
        item.pendingPayments ? `₹${item.pendingPayments}` : "",
        item.quantity || "",
        item.totalQuantity || "",
        item.stockValue || "",
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stock Report");
    XLSX.writeFile(wb, `Yearly_Stock_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Financial Management" breadcrumbItem="Yearly Stock Report" />

          <Row>
            <Col xs="12">
              <Card className="shadow-lg" style={{ borderRadius: "20px", overflow: "hidden", background: "#f8f9fa" }}>
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
                      Yearly Stock Report
                    </h4>
                    <div className="d-flex gap-2">
                      <Button
                        color="success"
                        onClick={handleDownloadExcel}
                        style={{
                          padding: "8px 15px",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                          transition: "transform 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                        className="hover-scale"
                      >
                        <i className="bx bx-file" style={{ fontSize: "16px" }}></i>
                        Excel
                      </Button>
                      <Button
                        color="danger"
                        onClick={handleDownloadPDF}
                        style={{
                          padding: "8px 15px",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                          transition: "transform 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                        className="hover-scale"
                      >
                        <i className="bx bx-printer" style={{ fontSize: "16px" }}></i>
                        PDF
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
                          <Col md="6">
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
                              {isSubmitting ? "Filtering..." : "Apply Filter"}
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    )}
                  </Formik>

                  {/* Single Combined Table */}
                  <div ref={reportRef} className="table-container">
                    <h5 className="text-center mb-3">Yearly Stock Report Summary</h5>
                    <Table className="table table-striped table-hover align-middle" responsive>
                      <thead
                        style={{
                          background: "linear-gradient(90deg, #007bff, #00c4cc)",
                          color: "#fff",
                        }}
                      >
                        <tr>
                          <th>Type</th>
                          <th>Sr.No</th>
                          <th>ID</th>
                          <th>Financial Year</th>
                          <th>Supplier</th>
                          <th>Brand</th>
                          <th>Product</th>
                          <th>Date</th>
                          <th>Expiry Date</th>
                          <th>Total Purchases</th>
                          <th>GST Paid</th>
                          <th>Discounts Received</th>
                          <th>Pending Payments</th>
                          <th>Quantity</th>
                          <th>Total Quantity</th>
                          <th>Stock Value</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stockData.combinedData.map((item, index) => (
                          <tr key={item.id || index}>
                            <td>{item.type}</td>
                            <td>{index + 1}</td>
                            <td>{item.id || "-"}</td>
                            <td>{item.financialYear || "-"}</td>
                            <td>{item.supplier || "-"}</td>
                            <td>{item.brand || "-"}</td>
                            <td>{item.product || "-"}</td>
                            <td>{item.date || "-"}</td>
                            <td>{item.expiryDate || "-"}</td>
                            <td>{item.totalPurchases ? `₹${item.totalPurchases}` : "-"}</td>
                            <td>{item.gstPaid ? `₹${item.gstPaid}` : "-"}</td>
                            <td>{item.discountsReceived ? `₹${item.discountsReceived}` : "-"}</td>
                            <td>{item.pendingPayments ? `₹${item.pendingPayments}` : "-"}</td>
                            <td>{item.quantity || "-"}</td>
                            <td>{item.totalQuantity || "-"}</td>
                            <td>{item.stockValue || "-"}</td>
                            <td>
                              {item.id ? (
                                <div className="d-flex gap-2 justify-content-center">
                                  <FaEye
                                    style={{ fontSize: "18px", color: "#007bff", cursor: "pointer" }}
                                    onClick={() => handleView(item.id)}
                                    title="View"
                                  />
                                  <FaEdit
                                    style={{ fontSize: "18px", color: "#4caf50", cursor: "pointer" }}
                                    onClick={() => handleEdit(item.id)}
                                    title="Edit"
                                  />
                                  <FaTrash
                                    style={{ fontSize: "18px", color: "#f44336", cursor: "pointer" }}
                                    onClick={() => handleDelete(item.id)}
                                    title="Delete"
                                  />
                                </div>
                              ) : (
                                "-"
                              )}
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
          max-height: 500px;
          overflow-y: auto;
          overflow-x: auto;
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          padding: 10px;
        }
        .table {
          margin-bottom: 20px;
          min-width: 1600px; /* Adjusted for wider table */
        }
        .table-striped tbody tr:nth-of-type(odd) {
          background-color: rgba(0, 0, 0, 0.03);
        }
        .table-hover tbody tr:hover {
          background-color: rgba(0, 123, 255, 0.1);
        }
        @media print {
          .table-container {
            box-shadow: none;
            border: 1px solid #000;
            padding: 0;
          }
          .table thead {
            background: #007bff !important;
            -webkit-print-color-adjust: exact;
          }
          .no-print {
            display: none; /* Hide filters during print */
          }
          .table {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default YearlyStockReport;