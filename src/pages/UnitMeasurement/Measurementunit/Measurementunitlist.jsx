import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Input,
} from "reactstrap";
import { FaEdit, FaTrash, FaFileExcel, FaPlus } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import {
  getMeasurementUnits,
  deleteMeasurementUnit,
  uploadMeasurementUnitsExcel,
} from "../../../ApiService/UnitMeasurement/Measurementunit";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const Measurementunitlist = () => {
  const navigate = useNavigate();
  const [measurementUnits, setMeasurementUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMeasurementUnits = async () => {
      try {
        const data = await getMeasurementUnits();
        console.log(data);
        setMeasurementUnits(data ?? []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching measurement units:", error);
        Swal.fire({
          title: "Error!",
          text: error?.message ?? "Failed to fetch measurement units.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoading(false);
      }
    };

    fetchMeasurementUnits();
  }, []);

  const AddMeasurement = () => {
    navigate("/measurementunit");
  };

  const handleEdit = (id) => {
    navigate("/measurementunit", { state: { id } });
  };

  const handleDelete = async (id) => {
    const firstConfirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this measurement unit.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "No, cancel",
    });

    if (firstConfirmation?.isConfirmed) {
      const secondConfirmation = await Swal.fire({
        title: "Confirm Deletion",
        text: "This action cannot be undone. Are you absolutely sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it",
        cancelButtonText: "No, keep it",
      });

      if (secondConfirmation?.isConfirmed) {
        try {
          await deleteMeasurementUnit(id);
          setMeasurementUnits(
            measurementUnits.filter((unit) => unit?.id !== id)
          );
          Swal.fire({
            title: "Deleted!",
            text: "The measurement unit has been successfully deleted.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error("Error deleting measurement unit:", error);
          Swal.fire({
            title: "Error!",
            text: error?.message ?? "Failed to delete the measurement unit.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    }
  };

  const handleExcelUpload = async (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("excel_file", file);

      try {
        const response = await uploadMeasurementUnitsExcel(formData);
        Swal.fire({
          title: "Upload Successful!",
          text: "The Excel file has been successfully uploaded and processed.",
          icon: "success",
          confirmButtonText: "OK",
        });

        const updatedData = await getMeasurementUnits();
        setMeasurementUnits(updatedData ?? []);
      } catch (error) {
        console.error("Error uploading Excel file:", error);
        Swal.fire({
          title: "Error!",
          text: error?.message ?? "Failed to upload the Excel file.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } else {
      Swal.fire({
        title: "No File Selected!",
        text: "Please select an Excel file to upload.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    }
  };

  const handleExcelDownload = () => {
    try {
      const exportData = filteredData.map((unit) => ({
        ID: unit.id,
        "Measurement Name": unit.measurement_name,
        "Pack Type": unit.pack_type,
        Quantity: unit.quantity,
        Measurement: unit.measurement,
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Measurement Units");
      XLSX.writeFile(wb, "Measurement_Units.xlsx");

      Swal.fire({
        title: "Success!",
        text: "Excel file downloaded successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error downloading Excel file:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to download Excel file. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const filteredData = measurementUnits.filter(
    (unit) =>
      unit.id?.toString().includes(searchTerm) ||
      unit.measurement_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.pack_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Measurement Units" breadcrumbItem="All Units" />

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
                    <div className="d-flex align-items-center gap-3">
                      <h4
                        className="text-primary mb-0"
                        style={{
                          fontWeight: "700",
                          letterSpacing: "1px",
                          background: "linear-gradient(90deg, #007bff, #00c4cc)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        Measurement Unit List
                      </h4>
                    </div>
                    <div className="d-flex flex-wrap gap-4">
                     <div>
                     <Input
                        type="text"
                        placeholder="Search by ID, Name, or Pack Type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: "350px", borderRadius: "10px" }}
                      />
                     </div>
                      <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={AddMeasurement}
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
                        Add Measurement Unit
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
                        disabled={filteredData.length === 0}
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
                          <th>Packaging Name</th>
                          <th>Pack Type</th>
                          <th>Quantity</th>
                          <th>Measurement</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="7" className="text-center">
                              Loading...
                            </td>
                          </tr>
                        ) : filteredData.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center">
                              No measurement units found.
                            </td>
                          </tr>
                        ) : (
                          filteredData.map((unit, index) => (
                            <tr key={unit?.id ?? index}>
                              <td>{index + 1}</td>
                              <td>{unit?.id ?? "N/A"}</td>
                              <td>{unit?.measurement_name ?? "N/A"}</td>
                              <td>{unit?.pack_type ?? "N/A"}</td>
                              <td>{unit?.quantity ?? 0}</td>
                              <td>{unit?.measurement ?? "N/A"}</td>
                              <td>
                                <div className="d-flex gap-1">
                                  <FaEdit
                                    style={{
                                      fontSize: "18px",
                                      color: "#4caf50",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleEdit(unit?.id)}
                                    title="Edit"
                                  />
                                  <FaTrash
                                    style={{
                                      fontSize: "18px",
                                      color: "#f44336",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleDelete(unit?.id)}
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
          max-height: 400px;
          overflow-y: auto;
          overflow-x: auto;
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .table {
          margin-bottom: 0;
          min-width: 600px;
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
            justify-content: flex-end;
          }
          .d-flex.align-items-center.gap-3 {
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
          }
          .input {
            width: 100%;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default Measurementunitlist;