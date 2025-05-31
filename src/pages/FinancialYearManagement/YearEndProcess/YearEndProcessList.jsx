import React from "react";
import { Button, Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaFileExcel } from "react-icons/fa"; // Icons for actions and Excel
import Breadcrumbs from "../../../components/Common/Breadcrumb"; // Adjust path as needed
import { useNavigate } from "react-router-dom";

const YearEndProcessList = () => {
  const navigate = useNavigate();

  // Sample year-end process data (replace with actual data from your API or state)
  const yearEndProcesses = [
    {
      id: 1,
      financialYear: "2024-2025",
      status: "Pending",
      closeBooksDate: "",
      carryForwardDate: "",
      reportGenerated: "No",
      archived: "No",
    },
    {
      id: 2,
      financialYear: "2023-2024",
      status: "Completed",
      closeBooksDate: "2024-04-01",
      carryForwardDate: "2024-04-01",
      reportGenerated: "Yes",
      archived: "Yes",
    },
    {
      id: 3,
      financialYear: "2022-2023",
      status: "Completed",
      closeBooksDate: "2023-04-01",
      carryForwardDate: "2023-04-01",
      reportGenerated: "Yes",
      archived: "Yes",
    },
  ];

  const handleBack = () => {
    navigate(-1);
  };

  const handleView = (id) => {
    navigate(`/year-end-process-details/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/edit-year-end-process/${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete year-end process with ID: ${id}`);
    // Implement delete logic here (e.g., API call)
  };

  const handleCloseBooks = (id) => {
    console.log(`Auto-close books for financial year with ID: ${id}`);
    // Implement logic to close books (e.g., API call to update status and set closeBooksDate)
  };

  const handleCarryForward = (id) => {
    console.log(`Carry forward balances for financial year with ID: ${id}`);
    // Implement logic to carry forward stock, cash, and payables (e.g., API call to update carryForwardDate)
  };

  const handleGenerateReports = (id) => {
    console.log(`Generate compliance and tax reports for financial year with ID: ${id}`);
    // Implement logic to generate reports (e.g., API call to set reportGenerated to "Yes")
  };

  const handleArchiveData = (id) => {
    console.log(`Archive data for financial year with ID: ${id}`);
    // Implement logic to archive previous year's data (e.g., API call to set archived to "Yes")
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
      "Financial Year",
      "Status",
      "Close Books Date",
      "Carry Forward Date",
      "Reports Generated",
      "Archived",
    ];
    const rows = yearEndProcesses.map((process, index) => [
      index + 1,
      process.id,
      process.financialYear,
      process.status,
      process.closeBooksDate || "N/A",
      process.carryForwardDate || "N/A",
      process.reportGenerated,
      process.archived,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "year_end_processes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Financial Management" breadcrumbItem="Year-End Process List" />

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
                      Year-End Process List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={() => navigate("/year-end-process-form")}
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
                        Add Year-End Process
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
                          <th>Financial Year</th>
                          <th>Status</th>
                          <th>Close Books Date</th>
                          <th>Carry Forward Date</th>
                          <th>Reports Generated</th>
                          <th>Archived</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {yearEndProcesses.map((process, index) => (
                          <tr key={process.id}>
                            <td>{index + 1}</td>
                            <td>{process.id}</td>
                            <td>{process.financialYear}</td>
                            <td>{process.status}</td>
                            <td>{process.closeBooksDate || "N/A"}</td>
                            <td>{process.carryForwardDate || "N/A"}</td>
                            <td>{process.reportGenerated}</td>
                            <td>{process.archived}</td>
                            <td>
                              <div className="d-flex gap-2 justify-content-center flex-wrap">
                                <FaEye
                                  style={{
                                    fontSize: "18px",
                                    color: "#007bff",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleView(process.id)}
                                  title="View"
                                />
                                <FaEdit
                                  style={{
                                    fontSize: "18px",
                                    color: "#4caf50",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleEdit(process.id)}
                                  title="Edit"
                                />
                                <FaTrash
                                  style={{
                                    fontSize: "18px",
                                    color: "#f44336",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleDelete(process.id)}
                                  title="Delete"
                                />
                                <Button
                                  color="warning"
                                  size="sm"
                                  onClick={() => handleCloseBooks(process.id)}
                                  disabled={process.status === "Completed"}
                                  style={{ padding: "2px 5px" }}
                                  title="Close Books"
                                >
                                  Close
                                </Button>
                                <Button
                                  color="info"
                                  size="sm"
                                  onClick={() => handleCarryForward(process.id)}
                                  disabled={process.status === "Completed"}
                                  style={{ padding: "2px 5px" }}
                                  title="Carry Forward"
                                >
                                  Carry
                                </Button>
                                <Button
                                  color="success"
                                  size="sm"
                                  onClick={() => handleGenerateReports(process.id)}
                                  disabled={process.reportGenerated === "Yes"}
                                  style={{ padding: "2px 5px" }}
                                  title="Generate Reports"
                                >
                                  Report
                                </Button>
                                <Button
                                  color="secondary"
                                  size="sm"
                                  onClick={() => handleArchiveData(process.id)}
                                  disabled={process.archived === "Yes"}
                                  style={{ padding: "2px 5px" }}
                                  title="Archive"
                                >
                                  Archive
                                </Button>
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

export default YearEndProcessList;