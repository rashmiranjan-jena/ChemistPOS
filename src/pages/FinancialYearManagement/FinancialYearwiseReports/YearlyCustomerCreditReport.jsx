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
import Breadcrumbs from "../../../components/Common/Breadcrumb"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { jsPDF } from "jspdf"; // Import jsPDF
import "jspdf-autotable"; // Import autotable plugin for table support
import * as XLSX from "xlsx";

// Validation schema using Yup
const validationSchema = Yup.object({
  financialYear: Yup.string().required("Financial Year is required"),
  customerType: Yup.string().oneOf(["B2B", "Corporate", ""], "Invalid Customer Type"),
  customerName: Yup.string(), // Optional filter
  pendingDues: Yup.string().oneOf(["Yes", "No", ""], "Invalid Pending Dues Option"),
  startDate: Yup.date()
    .required("Start Date is required")
    .max(Yup.ref("endDate"), "Start Date must be before End Date"),
  endDate: Yup.date()
    .required("End Date is required")
    .min(Yup.ref("startDate"), "End Date must be after Start Date"),
});

const YearlyCustomerCreditReport = () => {
  const navigate = useNavigate();
  const reportRef = useRef(null);

  const initialValues = {
    financialYear: "",
    customerType: "",
    customerName: "",
    pendingDues: "",
    startDate: "",
    endDate: "",
  };

  const creditDataList = [
    {
      id: 1,
      financialYear: "2024-2025",
      customerType: "B2B",
      customerName: "Customer A",
      date: "2024-01-15",
      totalCreditSales: "300000",
      totalAmountCollected: "200000",
      outstandingBalance: "100000",
    },
    {
      id: 2,
      financialYear: "2024-2025",
      customerType: "Corporate",
      customerName: "Customer B",
      date: "2024-02-20",
      totalCreditSales: "500000",
      totalAmountCollected: "400000",
      outstandingBalance: "100000",
    },
    {
      id: 3,
      financialYear: "2024-2025",
      customerType: "B2B",
      customerName: "Customer C",
      date: "2024-03-10",
      totalCreditSales: "200000",
      totalAmountCollected: "150000",
      outstandingBalance: "50000",
    },
  ];

  const filterOptions = {
    customerNames: ["Customer A", "Customer B", "Customer C"],
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Filter Values:", values);
    const filteredData = creditDataList.filter((credit) => {
      const creditDate = new Date(credit.date);
      const startDate = new Date(values.startDate);
      const endDate = new Date(values.endDate);
      const hasPendingDues = credit.outstandingBalance !== "0";
      return (
        (!values.financialYear || credit.financialYear === values.financialYear) &&
        (!values.customerType || credit.customerType === values.customerType) &&
        (!values.customerName || credit.customerName === values.customerName) &&
        (!values.pendingDues || (values.pendingDues === "Yes" ? hasPendingDues : !hasPendingDues)) &&
        creditDate >= startDate &&
        creditDate <= endDate
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
    navigate(`/credit-details/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/edit-credit/${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete credit with ID: ${id}`);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Yearly Customer Credit Report", 14, 20);

    const headers = [
      "Sr.No",
      "ID",
      "Financial Year",
      "Customer Type",
      "Customer Name",
      "Date",
      "Total Credit Sales",
      "Total Amount Collected",
      "Outstanding Balance",
    ];

    const data = creditDataList.map((credit, index) => [
      index + 1,
      credit.id,
      credit.financialYear,
      credit.customerType,
      credit.customerName,
      credit.date,
      `${credit.totalCreditSales}`,
      `${credit.totalAmountCollected}`,
      `${credit.outstandingBalance}`,
    ]);

    doc.autoTable({
      head: [headers],
      body: data,
      startY: 30,
      theme: "striped",
      headStyles: { fillColor: [0, 123, 255] }, 
      styles: { fontSize: 10, cellPadding: 2 },
    });

    // Save the PDF
    doc.save(`Yearly_Customer_Credit_Report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  // Excel Download Handler
  const handleDownloadExcel = () => {
    const headers = [
      "Sr.No",
      "ID",
      "Financial Year",
      "Customer Type",
      "Customer Name",
      "Date",
      "Total Credit Sales",
      "Total Amount Collected",
      "Outstanding Balance",
    ];
    const rows = creditDataList.map((credit, index) => [
      index + 1,
      credit.id,
      credit.financialYear,
      credit.customerType,
      credit.customerName,
      credit.date,
      `${credit.totalCreditSales}`,
      `${credit.totalAmountCollected}`,
      `${credit.outstandingBalance}`,
    ]);
    const data = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customer Credit Report");
    XLSX.writeFile(wb, `Yearly_Customer_Credit_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Financial Management" breadcrumbItem="Yearly Customer Credit Report" />

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
                      Yearly Customer Credit Report
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
                              <Label for="customerType" className="fw-bold text-dark">
                                Customer Type
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="customerType"
                                id="customerType"
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              >
                                <option value="">All Types</option>
                                <option value="B2B">B2B</option>
                                <option value="Corporate">Corporate</option>
                              </Field>
                              <ErrorMessage name="customerType" component="div" className="invalid-feedback" />
                            </FormGroup>
                          </Col>
                          <Col md="2">
                            <FormGroup>
                              <Label for="customerName" className="fw-bold text-dark">
                                Customer Name
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="customerName"
                                id="customerName"
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              >
                                <option value="">All Customers</option>
                                {filterOptions.customerNames.map((customer, index) => (
                                  <option key={index} value={customer}>{customer}</option>
                                ))}
                              </Field>
                            </FormGroup>
                          </Col>
                          <Col md="2">
                            <FormGroup>
                              <Label for="pendingDues" className="fw-bold text-dark">
                                Pending Dues
                              </Label>
                              <Field
                                as={Input}
                                type="select"
                                name="pendingDues"
                                id="pendingDues"
                                className="form-control"
                                style={{ borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: "10px" }}
                              >
                                <option value="">All</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </Field>
                              <ErrorMessage name="pendingDues" component="div" className="invalid-feedback" />
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
                          <th>Customer Type</th>
                          <th>Customer Name</th>
                          <th>Date</th>
                          <th>Total Credit Sales</th>
                          <th>Total Amount Collected</th>
                          <th>Outstanding Balance</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {creditDataList.map((credit, index) => (
                          <tr key={credit.id}>
                            <td>{index + 1}</td>
                            <td>{credit.id}</td>
                            <td>{credit.financialYear}</td>
                            <td>{credit.customerType}</td>
                            <td>{credit.customerName}</td>
                            <td>{credit.date}</td>
                            <td>₹{credit.totalCreditSales}</td>
                            <td>₹{credit.totalAmountCollected}</td>
                            <td>₹{credit.outstandingBalance}</td>
                            <td>
                              <div className="d-flex gap-2 justify-content-center">
                                <FaEye
                                  style={{ fontSize: "18px", color: "#007bff", cursor: "pointer" }}
                                  onClick={() => handleView(credit.id)}
                                  title="View"
                                />
                                <FaEdit
                                  style={{ fontSize: "18px", color: "#4caf50", cursor: "pointer" }}
                                  onClick={() => handleEdit(credit.id)}
                                  title="Edit"
                                />
                                <FaTrash
                                  style={{ fontSize: "18px", color: "#f44336", cursor: "pointer" }}
                                  onClick={() => handleDelete(credit.id)}
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
          max-height: 400px;
          overflow-y: auto;
          overflow-x: auto;
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .table {
          margin-bottom: 0;
          min-width: 1000px;
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
            display: none;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default YearlyCustomerCreditReport;