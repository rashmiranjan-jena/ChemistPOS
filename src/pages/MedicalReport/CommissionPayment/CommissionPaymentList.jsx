import React, { useState } from "react";
import { Button, Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaFileExcel, FaFilePdf } from "react-icons/fa"; // Added FaFilePdf for PDF icon
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf"; // Import jsPDF for PDF generation

const initialCommissionPayments = [
  {
    id: 1,
    mrName: "John Doe",
    salesReportPeriod: "Monthly",
    totalCommissionAmount: 1250,
    paymentMode: "Bank Transfer",
    paymentStatus: "Pending",
  },
  {
    id: 2,
    mrName: "Jane Smith",
    salesReportPeriod: "Quarterly",
    totalCommissionAmount: 315,
    paymentMode: "Cheque",
    paymentStatus: "Paid",
  },
  {
    id: 3,
    mrName: "Mike Johnson",
    salesReportPeriod: "Monthly",
    totalCommissionAmount: 1380,
    paymentMode: "Cash",
    paymentStatus: "Pending",
  },
  {
    id: 4,
    mrName: "Sarah Williams",
    salesReportPeriod: "Quarterly",
    totalCommissionAmount: 990,
    paymentMode: "Bank Transfer",
    paymentStatus: "Paid",
  },
  {
    id: 5,
    mrName: "Robert Brown",
    salesReportPeriod: "Monthly",
    totalCommissionAmount: 440,
    paymentMode: "Cash",
    paymentStatus: "Pending",
  },
];

const CommissionPaymentList = () => {
  const navigate = useNavigate();

  // State for the commission payments
  const [commissionPayments, setCommissionPayments] = useState(initialCommissionPayments);

  const handleBack = () => {
    navigate(-1);
  };

  const handleView = (id) => {
    navigate(`/commission-payment-details/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/edit-commission-payment/${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete commission payment with ID: ${id}`);
    const updatedPayments = commissionPayments.filter((payment) => payment.id !== id);
    setCommissionPayments(updatedPayments);
  };

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Excel file selected:", file.name);
      // Implement your Excel upload logic here (e.g., API call with a library like 'xlsx')
    }
  };

  const handleExcelDownload = () => {
    const headers = [
      "Sr.No",
      "ID",
      "MR Name",
      "Sales Report Period",
      "Total Commission Amount",
      "Payment Mode",
      "Payment Status",
    ];
    const rows = commissionPayments.map((payment, index) => [
      index + 1,
      payment.id,
      payment.mrName,
      payment.salesReportPeriod,
      `₹${payment.totalCommissionAmount.toLocaleString()}`,
      payment.paymentMode,
      payment.paymentStatus,
    ]);
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "commission_payments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to generate PDF invoice
  const generateCommissionInvoice = (payment) => {
    const doc = new jsPDF();

    // Set document properties
    doc.setFontSize(18);
    doc.text("Commission Invoice", 20, 20);

    // Add invoice details
    doc.setFontSize(12);
    doc.text(`Invoice ID: ${payment.id}`, 20, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
    doc.text(`MR Name: ${payment.mrName}`, 20, 60);
    doc.text(`Sales Report Period: ${payment.salesReportPeriod}`, 20, 70);
    doc.text(`Total Commission Amount: ₹${payment.totalCommissionAmount.toLocaleString()}`, 20, 80);
    doc.text(`Payment Mode: ${payment.paymentMode}`, 20, 90);
    doc.text(`Payment Status: ${payment.paymentStatus}`, 20, 100);

    // Add a footer
    doc.setFontSize(10);
    doc.text("Generated by xAI - Commission Payment System", 20, 280);

    // Save the PDF
    doc.save(`Commission_Invoice_${payment.id}_${payment.mrName}.pdf`);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Commission Payments" breadcrumbItem="Payment List" />

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
                      Commission Payment List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={() => navigate("/commission-payment-form")}
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
                        <i className="bx bx-plus" style={{ fontSize: "18px" }}></i> Add
                      </Button>
                      <label
                        htmlFor="excel-upload"
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
                          backgroundColor: "#28a745",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                        className="hover-scale m-0"
                      >
                        <FaFileExcel style={{ fontSize: "18px" }} />
                        Upload
                      </label>
                      <input
                        id="excel-upload"
                        type="file"
                        accept=".xlsx, .xls"
                        style={{ display: "none" }}
                        onChange={handleExcelUpload}
                      />
                      <Button
                        color="success"
                        onClick={handleExcelDownload}
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
                        Download
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

                  <div className="table-container">
                    <Table
                      className="table table-striped table-hover align-middle"
                      responsive
                    >
                      <thead
                        style={{
                          background: "linear-gradient(90deg, #007bff, #00c4cc)",
                          color: "#fff",
                        }}
                      >
                        <tr>
                          <th>Sr.No</th>
                          <th>ID</th>
                          <th>MR Name</th>
                          <th>Sales Report Period</th>
                          <th>Total Commission Amount</th>
                          <th>Payment Mode</th>
                          <th>Payment Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commissionPayments.map((payment, index) => (
                          <tr key={payment.id}>
                            <td>{index + 1}</td>
                            <td>{payment.id}</td>
                            <td>{payment.mrName}</td>
                            <td>{payment.salesReportPeriod}</td>
                            <td>₹{payment.totalCommissionAmount.toLocaleString()}</td>
                            <td>{payment.paymentMode}</td>
                            <td>{payment.paymentStatus}</td>
                            <td>
                              <div className="d-flex gap-2 justify-content-center">
                                <FaEye
                                  style={{
                                    fontSize: "18px",
                                    color: "#007bff",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleView(payment.id)}
                                  title="View"
                                />
                                <FaEdit
                                  style={{
                                    fontSize: "18px",
                                    color: "#4caf50",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleEdit(payment.id)}
                                  title="Edit"
                                />
                                <FaTrash
                                  style={{
                                    fontSize: "18px",
                                    color: "#f44336",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleDelete(payment.id)}
                                  title="Delete"
                                />
                                <FaFilePdf
                                  style={{
                                    fontSize: "18px",
                                    color: "#ff9800",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => generateCommissionInvoice(payment)}
                                  title="Generate Invoice"
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
        .table-container {
          max-height: 400px; /* Adjust based on your needs */
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
          .table {
            font-size: 0.9rem;
          }
          .table th,
          .table td {
            padding: 6px;
          }
        }
        @media (max-width: 576px) {
          .row.g-4 {
            gap: 1rem;
          }
          .table {
            font-size: 0.8rem;
          }
          .table th,
          .table td {
            padding: 4px;
          }
          .btn,
          label {
            font-size: 0.9rem;
            padding: 2px 8px;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default CommissionPaymentList;