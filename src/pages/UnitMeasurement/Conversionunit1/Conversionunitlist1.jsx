import React, { useState } from "react";
import { Button, Card, CardBody, Col, Container, Row, Table, Input } from "reactstrap";
import { FaEdit, FaTrash, FaFileExcel, FaPlus } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const Conversionunitlist1 = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Static data for conversion units
  const conversionUnits = [
    {
      id: "CU001",
      conversion_name: "Weight Conversion",
      from_measurementUnit_Name: "Kilogram",
      from_value: 1,
      to_measurementUnit_Name: "Gram",
      to_value: 1000,
    },
    {
      id: "CU002",
      conversion_name: "Volume Conversion",
      from_measurementUnit_Name: "Liter",
      from_value: 1,
      to_measurementUnit_Name: "Milliliter",
      to_value: 1000,
    },
    {
      id: "CU003",
      conversion_name: "Length Conversion",
      from_measurementUnit_Name: "Meter",
      from_value: 1,
      to_measurementUnit_Name: "Centimeter",
      to_value: 100,
    },
    {
      id: "CU004",
      conversion_name: "Small Weight Conversion",
      from_measurementUnit_Name: "Gram",
      from_value: 1,
      to_measurementUnit_Name: "Milligram",
      to_value: 1000,
    },
  ];

  const AddConversion = () => {
    navigate("/conversionunit1");
  };

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Excel file selected:", file.name);
      // Simulate Excel upload logic with static data (no actual upload)
      alert("Excel upload simulated. In a real app, this would process the file.");
    }
  };

  const handleExcelDownload = () => {
    try {
      // Prepare data for Excel
      const exportData = filteredData.map((unit, index) => ({
        "#": index + 1,
        "Conversion Name": unit.conversion_name,
        "From Measurement Unit": unit.from_measurementUnit_Name,
        "From Value": unit.from_value,
        "To Measurement Unit": unit.to_measurementUnit_Name,
        "To Value": unit.to_value,
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Conversion Units");
      XLSX.writeFile(wb, "Conversion_Units.xlsx");

      alert("Excel file downloaded successfully!");
    } catch (error) {
      console.error("Error downloading Excel file:", error);
      alert("Failed to download Excel file. Please try again.");
    }
  };

  const handleEdit = (id) => {
    navigate("/conversionunit1", { state: { id } });
  };

  const handleDelete = (id) => {
    console.log(`Delete conversion unit with ID: ${id}`);
    // Simulate delete logic (no actual deletion with static data)
    alert(`Simulated deletion of conversion unit with ID: ${id}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const filteredData = conversionUnits.filter(
    (unit) =>
      unit.conversion_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.from_measurementUnit_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.to_measurementUnit_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(unit.from_value)?.includes(searchTerm.toLowerCase()) ||
      String(unit.to_value)?.includes(searchTerm.toLowerCase())
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Measurement Units" breadcrumbItem="All Conversion Units" />

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
                      Conversion Unit List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Input
                        type="text"
                        placeholder="Search by Name, Unit, or Value..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: "350px", borderRadius: "10px" }}
                      />
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
                        disabled={filteredData.length === 0}
                      >
                        <FaFileExcel style={{ fontSize: "18px" }} />
                        Download Excel
                      </Button>
                      <Button
                        color="primary"
                        onClick={AddConversion}
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
                        <FaPlus style={{ fontSize: "18px" }} />
                        Add Conversion Unit
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
                          <th>Conversion Name</th>
                          <th>From Unit</th>
                          <th>From Value</th>
                          <th>To Unit</th>
                          <th>To Value</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center">
                              No data available
                            </td>
                          </tr>
                        ) : (
                          filteredData.map((unit, index) => (
                            <tr key={unit.id}>
                              <td>{index + 1}</td>
                              <td>{unit.conversion_name}</td>
                              <td>{unit.from_measurementUnit_Name}</td>
                              <td>{unit.from_value}</td>
                              <td>{unit.to_measurementUnit_Name}</td>
                              <td>{unit.to_value}</td>
                              <td>
                                <div className="d-flex gap-2 justify-content-center">
                                  <FaEdit
                                    style={{ fontSize: "18px", color: "#4caf50", cursor: "pointer" }}
                                    onClick={() => handleEdit(unit.id)}
                                    title="Edit"
                                  />
                                  <FaTrash
                                    style={{ fontSize: "18px", color: "#f44336", cursor: "pointer" }}
                                    onClick={() => handleDelete(unit.id)}
                                    title="Delete"
                                  />
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
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
          min-width: 800px; /* Adjusted for conversion unit columns */
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
          .input {
            width: 100%;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default Conversionunitlist1;