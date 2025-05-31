import React from "react";
import { Button, Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaFileExcel } from "react-icons/fa"; // Icons for actions and Excel
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";

const ReceivedAmountList = () => {
  const navigate = useNavigate();

  // Sample received amount data (replace with actual data from your API or state)
  const receivedAmounts = [
    {
      id: 1,
      dateTime: "2025-03-14 10:30 AM",
      invoiceNo: "INV001",
      customerName: "John Doe (B2C)",
      paymentMode: "Cash",
      amountReceived: 500.00,
      referenceNo: "-",
    },
    {
      id: 2,
      dateTime: "2025-03-14 12:15 PM",
      invoiceNo: "INV002",
      customerName: "ABC Corp (Corporate)",
      paymentMode: "Bank Transfer",
      amountReceived: 1500.00,
      referenceNo: "BT123456",
    },
    {
      id: 3,
      dateTime: "2025-03-14 02:00 PM",
      invoiceNo: "INV003",
      customerName: "XYZ Ltd (B2B)",
      paymentMode: "UPI",
      amountReceived: 750.00,
      referenceNo: "UPI987654",
    },
    {
      id: 4,
      dateTime: "2025-03-14 03:45 PM",
      invoiceNo: "INV004",
      customerName: "Jane Smith (B2C)",
      paymentMode: "Card",
      amountReceived: 300.00,
      referenceNo: "-",
    },
  ];

  const handleBack = () => {
    navigate(-1);
  };

  const handleView = (id) => {
    navigate(`/received-amount-details/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/edit-received-amount/${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete received amount with ID: ${id}`);
    // Implement delete logic here (e.g., API call)
  };

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Excel file selected:", file.name);
      // Implement your Excel upload logic here (e.g., API call)
    }
  };

  const handleExcelDownload = () => {
    // Basic CSV generation (you can use a library like 'xlsx' for proper Excel files)
    const headers = [
      "Sr.No",
      "ID",
      "Date & Time",
      "Invoice No.",
      "Customer Name",
      "Payment Mode",
      "Amount Received",
      "Reference No.",
    ];
    const rows = receivedAmounts.map((amount, index) => [
      index + 1,
      amount.id,
      amount.dateTime,
      amount.invoiceNo,
      amount.customerName,
      amount.paymentMode,
      amount.amountReceived,
      amount.referenceNo,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "received_amounts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Payments" breadcrumbItem="Received Amount List" />

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
                      Received Amount List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={() => navigate("/received-amount-form")}
                        style={{
                          height: "35px",
                          padding: "3px 10px 3px 10px",
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
                        <i
                          className="bx bx-plus"
                          style={{ fontSize: "18px" }}
                        ></i>{" "}
                        Add
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
                        <i
                          className="bx bx-undo"
                          style={{ fontSize: "18px" }}
                        ></i>
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
                          background:
                            "linear-gradient(90deg, #007bff, #00c4cc)",
                          color: "#fff",
                        }}
                      >
                        <tr>
                          <th>Sr.No</th>
                          <th>ID</th>
                          <th>Date & Time</th>
                          <th>Invoice No.</th>
                          <th>Customer Name</th>
                          <th>Payment Mode</th>
                          <th>Amount Received</th>
                          <th>Reference No.</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {receivedAmounts.map((amount, index) => (
                          <tr key={amount.id}>
                            <td>{index + 1}</td>
                            <td>{amount.id}</td>
                            <td>{amount.dateTime}</td>
                            <td>{amount.invoiceNo}</td>
                            <td>{amount.customerName}</td>
                            <td>{amount.paymentMode}</td>
                            <td>{amount.amountReceived.toFixed(2)}</td>
                            <td>{amount.referenceNo}</td>
                            <td>
                              <div className="d-flex gap-2 justify-content-center">
                                <FaEye
                                  style={{
                                    fontSize: "18px",
                                    color: "#007bff",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleView(amount.id)}
                                  title="View"
                                />
                                <FaEdit
                                  style={{
                                    fontSize: "18px",
                                    color: "#4caf50",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleEdit(amount.id)}
                                  title="Edit"
                                />
                                <FaTrash
                                  style={{
                                    fontSize: "18px",
                                    color: "#f44336",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleDelete(amount.id)}
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
          min-width: 800px; /* Ensures horizontal scroll on smaller screens */
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
      `}</style>
    </React.Fragment>
  );
};

export default ReceivedAmountList;