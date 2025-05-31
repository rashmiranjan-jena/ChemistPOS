import React from "react";
import { Button, Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaFileExcel } from "react-icons/fa"; // Icons for actions and Excel
import Breadcrumbs from "../../../components/Common/Breadcrumb"; // Adjust path as needed
import { useNavigate } from "react-router-dom";

const StoreRegistrationList = () => {
  const navigate = useNavigate();

  // Sample store registration data (replace with actual data from your API or state)
  const storeRegistrations = [
    {
      id: 1,
      businessType: "Retail",
      gstNo: "27AABCU9603R1ZM",
      fssaiLicenceNo: "11518011001234",
      shopActRegNo: "MH123456789",
    },
    {
      id: 2,
      businessType: "Wholesale",
      gstNo: "29AABCW1234H1ZK",
      fssaiLicenceNo: "11519022005678",
      shopActRegNo: "KA987654321",
    },
    {
      id: 3,
      businessType: "Manufacturing",
      gstNo: "33AAECP5678P1ZQ",
      fssaiLicenceNo: "11520033009876",
      shopActRegNo: "TN456789123",
    },
  ];

  const handleBack = () => {
    navigate(-1);
  };

  const handleView = (id) => {
    navigate(`/store-registration-details/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/edit-store-registration/${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete store registration with ID: ${id}`);
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
    const headers = [
      "Sr.No",
      "ID",
      "Type of Business",
      "GST No.",
      "FSSAI Licence No.",
      "Shop Act Registration No.",
    ];
    const rows = storeRegistrations.map((registration, index) => [
      index + 1,
      registration.id,
      registration.businessType,
      registration.gstNo,
      registration.fssaiLicenceNo,
      registration.shopActRegNo,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "store_registrations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Company"
            breadcrumbItem="Store Registration List"
          />

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
                      Store Registration List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={() => navigate("/store-registration-form")}
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
                        <i
                          className="bx bx-plus"
                          style={{ fontSize: "18px" }}
                        ></i>{" "}
                        Add Store Registration
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
                          <th>Type of Business</th>
                          <th>GST No.</th>
                          <th>FSSAI Licence No.</th>
                          <th>Shop Act Registration No.</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {storeRegistrations.map((registration, index) => (
                          <tr key={registration.id}>
                            <td>{index + 1}</td>
                            <td>{registration.id}</td>
                            <td>{registration.businessType}</td>
                            <td>{registration.gstNo}</td>
                            <td>{registration.fssaiLicenceNo}</td>
                            <td>{registration.shopActRegNo}</td>
                            <td>
                              <div className="d-flex gap-2 justify-content-center">
                                <FaEye
                                  style={{
                                    fontSize: "18px",
                                    color: "#007bff",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleView(registration.id)}
                                  title="View"
                                />
                                <FaEdit
                                  style={{
                                    fontSize: "18px",
                                    color: "#4caf50",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleEdit(registration.id)}
                                  title="Edit"
                                />
                                <FaTrash
                                  style={{
                                    fontSize: "18px",
                                    color: "#f44336",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleDelete(registration.id)}
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

export default StoreRegistrationList;