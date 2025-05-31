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
import * as XLSX from "xlsx"; 
import jsPDF from "jspdf"; 
import "jspdf-autotable"; 

// Validation schema using Yup
const validationSchema = Yup.object({
  financialYear: Yup.string().required("Financial Year is required"),
  startDate: Yup.date()
    .required("Start Date is required")
    .max(Yup.ref("endDate"), "Start Date must be before End Date"),
  endDate: Yup.date()
    .required("End Date is required")
    .min(Yup.ref("startDate"), "End Date must be after Start Date"),
});

const YearlyProfitLossStatement = () => {
  const navigate = useNavigate();
  const reportRef = useRef(null);

  const initialValues = {
    financialYear: "",
    startDate: "",
    endDate: "",
  };

  const profitLossDataList = [
    {
      id: 1,
      financialYear: "2024-2025",
      date: "2024-01-31",
      totalRevenue: "400000",
      totalExpenses: "240000",
      grossProfit: "160000",
      netProfitAfterTax: "120000",
      taxPayable: "40000",
    },
    {
      id: 2,
      financialYear: "2024-2025",
      date: "2024-02-28",
      totalRevenue: "350000",
      totalExpenses: "210000",
      grossProfit: "140000",
      netProfitAfterTax: "105000",
      taxPayable: "35000",
    },
    {
      id: 3,
      financialYear: "2024-2025",
      date: "2024-03-31",
      totalRevenue: "250000",
      totalExpenses: "150000",
      grossProfit: "100000",
      netProfitAfterTax: "75000",
      taxPayable: "25000",
    },
  ];

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Filter Values:", values);
    const filteredData = profitLossDataList.filter((statement) => {
      const statementDate = new Date(statement.date);
      const startDate = new Date(values.startDate);
      const endDate = new Date(values.endDate);
      return (
        (!values.financialYear || statement.financialYear === values.financialYear) &&
        statementDate >= startDate &&
        statementDate <= endDate
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
    navigate(`/profit-loss-details/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/edit-profit-loss/${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete profit/loss statement with ID: ${id}`);
    
  };

  // PDF Download Handler using jsPDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Yearly Profit & Loss Statement", 14, 20);

    // Define table columns and rows
    const tableColumn = [
      "Sr.No",
      "ID",
      "Financial Year",
      "Date",
      "Total Revenue",
      "Total Expenses",
      "Gross Profit",
      "Net Profit After Tax",
      "Tax Payable",
    ];
    const tableRows = profitLossDataList.map((statement, index) => [
      index + 1,
      statement.id,
      statement.financialYear,
      statement.date,
      `${statement.totalRevenue}`,
      `${statement.totalExpenses}`,
      `${statement.grossProfit}`,
      `${statement.netProfitAfterTax}`,
      `${statement.taxPayable}`,
    ]);

    // Add table to PDF using autotable
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [0, 123, 255], textColor: [255, 255, 255] }, 
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    // Save the PDF
    doc.save(`Yearly_Profit_Loss_Statement_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  // Excel Download Handler
  const handleDownloadExcel = () => {
    const headers = [
      "Sr.No",
      "ID",
      "Financial Year",
      "Date",
      "Total Revenue",
      "Total Expenses",
      "Gross Profit",
      "Net Profit After Tax",
      "Tax Payable",
    ];
    const rows = profitLossDataList.map((statement, index) => [
      index + 1,
      statement.id,
      statement.financialYear,
      statement.date,
      `${statement.totalRevenue}`,
      `${statement.totalExpenses}`,
      `${statement.grossProfit}`,
      `${statement.netProfitAfterTax}`,
      `${statement.taxPayable}`,
    ]);
    const data = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Profit Loss Statement");
    XLSX.writeFile(wb, `Yearly_Profit_Loss_Statement_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Financial Management" breadcrumbItem="Yearly Profit & Loss Statement" />

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
                      Yearly Profit & Loss Statement
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
                          <Col md="4">
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
                          <Col md="4">
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
                          <Col md="4">
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
                          <th>Date</th>
                          <th>Total Revenue</th>
                          <th>Total Expenses</th>
                          <th>Gross Profit</th>
                          <th>Net Profit After Tax</th>
                          <th>Tax Payable</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profitLossDataList.map((statement, index) => (
                          <tr key={statement.id}>
                            <td>{index + 1}</td>
                            <td>{statement.id}</td>
                            <td>{statement.financialYear}</td>
                            <td>{statement.date}</td>
                            <td>₹{statement.totalRevenue}</td>
                            <td>₹{statement.totalExpenses}</td>
                            <td>₹{statement.grossProfit}</td>
                            <td>₹{statement.netProfitAfterTax}</td>
                            <td>₹{statement.taxPayable}</td>
                            <td>
                              <div className="d-flex gap-2 justify-content-center">
                                <FaEye
                                  style={{ fontSize: "18px", color: "#007bff", cursor: "pointer" }}
                                  onClick={() => handleView(statement.id)}
                                  title="View"
                                />
                                <FaEdit
                                  style={{ fontSize: "18px", color: "#4caf50", cursor: "pointer" }}
                                  onClick={() => handleEdit(statement.id)}
                                  title="Edit"
                                />
                                <FaTrash
                                  style={{ fontSize: "18px", color: "#f44336", cursor: "pointer" }}
                                  onClick={() => handleDelete(statement.id)}
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
          fontSize: 12px;
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
          min-width: 1000px; /* Ensures horizontal scroll on smaller screens */
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

export default YearlyProfitLossStatement;