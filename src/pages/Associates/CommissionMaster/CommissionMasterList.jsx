import React from "react";
import { Button, Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaFileExcel } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";

const CommissionMasterList = () => {
  const navigate = useNavigate();

  // Sample commission data
  const commissions = [
    {
      id: "C001",
      type: "Fixed",
      percentageSetup: "N/A",
      fixedAmount: 500,
      autoCalcDoctors: ["Dr. Alice Carter", "Dr. Bob Evans"],
    },
    {
      id: "C002",
      type: "Percentage-Based",
      percentageSetup: "5%",
      fixedAmount: 0,
      autoCalcDoctors: ["Dr. Clara Lee", "Dr. David Kim"],
    },
  ];

  const handleBack = () => navigate(-1);
  const handleView = (id) => navigate(`/commission-details/${id}`);
  const handleEdit = (id) => navigate(`/edit-commission/${id}`);
  const handleDelete = (id) => {
    console.log(`Delete commission with ID: ${id}`);
    // Add delete logic here
  };

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Excel file selected:", file.name);
      // Add your Excel parsing logic here (e.g., using a library like SheetJS)
    }
  };

  const handleExcelDownload = () => {
    const headers = ["ID", "Commission Type", "Percentage Setup", "Fixed Amount", "Associated Doctors"];
    const rows = commissions.map((commission) => [
      commission.id,
      commission.type,
      commission.percentageSetup,
      commission.fixedAmount === 0 ? "N/A" : `$${commission.fixedAmount}`,
      commission.autoCalcDoctors.join("; "),
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "commission_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Commission Management" breadcrumbItem="Commission Master List" />

          <Row>
            <Col xs="12">
              <Card className="shadow-lg" style={{ borderRadius: "20px", overflow: "hidden", background: "#f8f9fa" }}>
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
                      Commission Master List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={() => navigate("/commision-form")}
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
                        <i className="bx bx-plus" style={{ fontSize: "18px" }}></i>
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
                        <i className="bx bx-undo" style={{ fontSize: "18px" }}></i>
                      </Button>
                    </div>
                  </div>

                  <div className="table-container">
                    <Table className="table table-striped table-hover align-middle" responsive>
                      <thead style={{ background: "linear-gradient(90deg, #007bff, #00c4cc)", color: "#fff" }}>
                        <tr>
                          <th>ID</th>
                          <th>Commission Type</th>
                          <th>Percentage Setup</th>
                          <th>Fixed Amount</th>
                          <th>Associated Doctors</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commissions.map((commission) => (
                          <tr key={commission.id}>
                            <td>{commission.id}</td>
                            <td>
                              <span
                                className={`badge ${
                                  commission.type === "Fixed" ? "bg-primary" : "bg-info"
                                }`}
                              >
                                {commission.type}
                              </span>
                            </td>
                            <td>{commission.percentageSetup}</td>
                            <td>{commission.fixedAmount === 0 ? "N/A" : `$${commission.fixedAmount}`}</td>
                            <td>
                              {commission.autoCalcDoctors.map((doctor, index) => (
                                <div key={index}>{doctor}</div>
                              ))}
                            </td>
                            <td>
                              <div className="d-flex gap-2 justify-content-center">
                                <FaEye
                                  style={{ fontSize: "18px", color: "#007bff", cursor: "pointer" }}
                                  onClick={() => handleView(commission.id)}
                                  title="View"
                                />
                                <FaEdit
                                  style={{ fontSize: "18px", color: "#4caf50", cursor: "pointer" }}
                                  onClick={() => handleEdit(commission.id)}
                                  title="Edit"
                                />
                                <FaTrash
                                  style={{ fontSize: "18px", color: "#f44336", cursor: "pointer" }}
                                  onClick={() => handleDelete(commission.id)}
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
          max-height: 400px;
          overflow-y: auto;
          overflow-x: auto;
          borderRadius: 10px;
          background: #fff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .table {
          margin-bottom: 0;
          min-width: 800px;
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

export default CommissionMasterList;