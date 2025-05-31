import React from "react";
import { Button, Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaFileExcel } from "react-icons/fa"; // Icons for actions and Excel
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";

const DayCloseProcessList = () => {
  const navigate = useNavigate();

  // Sample day close process data (replace with actual data from your API or state)
  const dayCloseRecords = [
    {
      id: 1,
      counterName: "Counter 1",
      dateTime: "2025-03-18 18:00",
      totalSales: 15000,
      totalCashCollected: 12000,
      totalCreditSales: 3000,
      totalGSTCollected: 2700,
      totalDiscountsGiven: 500,
      totalExpenses: 2000,
      closingCashBalance: 10000,
      notes: "Smooth day, no issues",
    },
    {
      id: 2,
      counterName: "Counter 2",
      dateTime: "2025-03-18 18:30",
      totalSales: 20000,
      totalCashCollected: 18000,
      totalCreditSales: 2000,
      totalGSTCollected: 3600,
      totalDiscountsGiven: 700,
      totalExpenses: 2500,
      closingCashBalance: 15500,
      notes: "",
    },
    {
      id: 3,
      counterName: "Counter 3",
      dateTime: "2025-03-18 19:00",
      totalSales: 10000,
      totalCashCollected: 8000,
      totalCreditSales: 2000,
      totalGSTCollected: 1800,
      totalDiscountsGiven: 300,
      totalExpenses: 1500,
      closingCashBalance: 6500,
      notes: "Cash discrepancy noted",
    },
  ];

  const handleBack = () => {
    navigate(-1);
  };

  const handleView = (id) => {
    navigate(`/day-close-details/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/edit-day-close/${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete day close record with ID: ${id}`);
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
      "Counter Name",
      "Date & Time",
      "Total Sales",
      "Total Cash Collected",
      "Total Credit Sales",
      "Total GST Collected",
      "Total Discounts Given",
      "Total Expenses",
      "Closing Cash Balance",
      "Notes",
    ];
    const rows = dayCloseRecords.map((record, index) => [
      index + 1,
      record.id,
      record.counterName,
      record.dateTime,
      record.totalSales,
      record.totalCashCollected,
      record.totalCreditSales,
      record.totalGSTCollected,
      record.totalDiscountsGiven,
      record.totalExpenses,
      record.closingCashBalance,
      record.notes || "N/A",
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "day_close_records.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Finance" breadcrumbItem="Day Close Process List" />

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
                      Day Close Process List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={() => navigate("/day-close-process-form")}
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
                        Add Day Close
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
                        Upload Excel
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
                        Download Excel
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
                          <th>Counter Name</th>
                          <th>Date & Time</th>
                          <th>Total Sales</th>
                          <th>Total Cash Collected</th>
                          <th>Total Credit Sales</th>
                          <th>Total GST Collected</th>
                          <th>Total Discounts Given</th>
                          <th>Total Expenses</th>
                          <th>Closing Cash Balance</th>
                          <th>Notes</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dayCloseRecords.map((record, index) => (
                          <tr key={record.id}>
                            <td>{index + 1}</td>
                            <td>{record.id}</td>
                            <td>{record.counterName}</td>
                            <td>{record.dateTime}</td>
                            <td>{record.totalSales}</td>
                            <td>{record.totalCashCollected}</td>
                            <td>{record.totalCreditSales}</td>
                            <td>{record.totalGSTCollected}</td>
                            <td>{record.totalDiscountsGiven}</td>
                            <td>{record.totalExpenses}</td>
                            <td>{record.closingCashBalance}</td>
                            <td>{record.notes || "N/A"}</td>
                            <td>
                              <div className="d-flex gap-2 justify-content-center">
                                <FaEye
                                  style={{
                                    fontSize: "18px",
                                    color: "#007bff",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleView(record.id)}
                                  title="View"
                                />
                                <FaEdit
                                  style={{
                                    fontSize: "18px",
                                    color: "#4caf50",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleEdit(record.id)}
                                  title="Edit"
                                />
                                <FaTrash
                                  style={{
                                    fontSize: "18px",
                                    color: "#f44336",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleDelete(record.id)}
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
      `}</style>
    </React.Fragment>
  );
};

export default DayCloseProcessList;