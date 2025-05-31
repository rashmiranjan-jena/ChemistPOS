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
import Breadcrumbs from "../../../components/Common/Breadcrumb"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
// import { useReactToPrint } from "react-to-print"; // For PDF generation
import * as XLSX from "xlsx"; // For Excel generation

// Validation schema using Yup
const validationSchema = Yup.object({
  financialYear: Yup.string().required("Financial Year is required"),
});

const YearlyTaxComplianceReport = () => {
  const navigate = useNavigate();
  const reportRef = useRef(null); // Ref for PDF printing

  // Initial values for filters
  const initialValues = {
    financialYear: "",
  };

  // Sample tax compliance data (replace with actual data from your API)
  const taxComplianceData = {
    gstSummary: {
      cgst: "45000",
      sgst: "45000",
      igst: "60000",
      total: "150000",
    },
    tdsTcsReport: [
      { client: "Client A (B2B)", tds: "20000", tcs: "0" },
      { client: "Client B (Corporate)", tds: "15000", tcs: "5000" },
    ],
    auditReport: [
      { regulation: "GST Filing", status: "Compliant", remarks: "Filed on time" },
      { regulation: "Income Tax Audit", status: "Compliant", remarks: "No discrepancies" },
      { regulation: "TDS Submission", status: "Pending", remarks: "Due by 30th April" },
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

  // PDF Download Handler
  const handleDownloadPDF = useReactToPrint({
    content: () => {
      if (!reportRef.current) {
        console.error("reportRef is null or undefined");
        return null;
      }
      return reportRef.current;
    },
    documentTitle: `Yearly_Tax_Compliance_Report_${new Date().toISOString().split("T")[0]}`,
    onBeforeGetContent: () => console.log("Preparing to print:", reportRef.current),
    onAfterPrint: () => console.log("Print completed"),
  });

  // Excel Download Handler
  const handleDownloadExcel = () => {
    const gstData = [
      ["GST Summary Report"],
      ["Type", "Amount"],
      ["CGST", `₹${taxComplianceData.gstSummary.cgst}`],
      ["SGST", `₹${taxComplianceData.gstSummary.sgst}`],
      ["IGST", `₹${taxComplianceData.gstSummary.igst}`],
      ["Total", `₹${taxComplianceData.gstSummary.total}`],
      [],
    ];
    const tdsTcsData = [
      ["TDS/TCS Report (B2B and Corporate Clients)"],
      ["Client", "TDS", "TCS"],
      ...taxComplianceData.tdsTcsReport.map(item => [item.client, `₹${item.tds}`, `₹${item.tcs}`]),
      [],
    ];
    const auditData = [
      ["Audit Report for Regulatory Compliance"],
      ["Regulation", "Status", "Remarks"],
      ...taxComplianceData.auditReport.map(item => [item.regulation, item.status, item.remarks]),
    ];

    const data = [...gstData, ...tdsTcsData, ...auditData];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tax Compliance Report");
    XLSX.writeFile(wb, `Yearly_Tax_Compliance_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Financial Management" breadcrumbItem="Yearly Tax & Compliance Report" />

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
                      Yearly Tax & Compliance Report
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

                  {/* Report Tables */}
                  <div ref={reportRef} className="table-container">
                    <h5 className="text-center mb-3">Yearly Tax & Compliance Report</h5>

                    {/* GST Summary Report */}
                    <h6 className="mt-4">GST Summary Report</h6>
                    <Table className="table table-striped table-hover align-middle" responsive>
                      <thead
                        style={{
                          background: "linear-gradient(90deg, #007bff, #00c4cc)",
                          color: "#fff",
                        }}
                      >
                        <tr>
                          <th>Type</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>CGST</td>
                          <td>₹{taxComplianceData.gstSummary.cgst}</td>
                        </tr>
                        <tr>
                          <td>SGST</td>
                          <td>₹{taxComplianceData.gstSummary.sgst}</td>
                        </tr>
                        <tr>
                          <td>IGST</td>
                          <td>₹{taxComplianceData.gstSummary.igst}</td>
                        </tr>
                        <tr>
                          <td>Total</td>
                          <td>₹{taxComplianceData.gstSummary.total}</td>
                        </tr>
                      </tbody>
                    </Table>

                    {/* TDS/TCS Report */}
                    <h6 className="mt-4">TDS/TCS Report (B2B and Corporate Clients)</h6>
                    <Table className="table table-striped table-hover align-middle" responsive>
                      <thead
                        style={{
                          background: "linear-gradient(90deg, #007bff, #00c4cc)",
                          color: "#fff",
                        }}
                      >
                        <tr>
                          <th>Client</th>
                          <th>TDS</th>
                          <th>TCS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {taxComplianceData.tdsTcsReport.map((item, index) => (
                          <tr key={index}>
                            <td>{item.client}</td>
                            <td>₹{item.tds}</td>
                            <td>₹{item.tcs}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>

                    {/* Audit Report */}
                    <h6 className="mt-4">Audit Report for Regulatory Compliance</h6>
                    <Table className="table table-striped table-hover align-middle" responsive>
                      <thead
                        style={{
                          background: "linear-gradient(90deg, #007bff, #00c4cc)",
                          color: "#fff",
                        }}
                      >
                        <tr>
                          <th>Regulation</th>
                          <th>Status</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {taxComplianceData.auditReport.map((item, index) => (
                          <tr key={index}>
                            <td>{item.regulation}</td>
                            <td>{item.status}</td>
                            <td>{item.remarks}</td>
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
          min-width: 400px;
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

export default YearlyTaxComplianceReport;