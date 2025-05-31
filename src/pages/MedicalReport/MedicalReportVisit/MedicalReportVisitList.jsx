import React, { useState } from "react";
import { Button, Card, CardBody, Col, Container, Row, Table, Input, Alert } from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaFileExcel, FaSave, FaTimes, FaDatabase } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";

// Sample data
const initialMedicalReportVisits = [
  {
    id: 1,
    mrName: "John Doe",
    visitDateTime: "2025-03-10T10:00",
    discussionNotes: "Discussed patient progress and medication adjustments.",
    requestedOrders: "Blood test, X-ray",
    nextVisitDate: "2025-03-17",
  },
  {
    id: 2,
    mrName: "Jane Smith",
    visitDateTime: "2025-03-12T14:30",
    discussionNotes: "Reviewed symptoms and planned follow-up treatment.",
    requestedOrders: "MRI, urine test",
    nextVisitDate: "2025-03-25",
  },
  {
    id: 3,
    mrName: "Mike Johnson",
    visitDateTime: "2025-03-11T09:15",
    discussionNotes: "Addressed patient concerns and updated prescription.",
    requestedOrders: "ECG, blood pressure check",
    nextVisitDate: "2025-03-18",
  },
  {
    id: 4,
    mrName: "Sarah Williams",
    visitDateTime: "2025-03-13T11:45",
    discussionNotes: "Planned surgery consultation.",
    requestedOrders: "CT scan",
    nextVisitDate: "2025-03-20",
  },
  {
    id: 5,
    mrName: "Robert Brown",
    visitDateTime: "2025-03-14T13:00",
    discussionNotes: "Monitored recovery progress.",
    requestedOrders: "Physical therapy",
    nextVisitDate: "2025-03-21",
  },
];

// Sample MR names for dropdown
const mrNames = [
  "John Doe",
  "Jane Smith",
  "Mike Johnson",
  "Sarah Williams",
  "Robert Brown"
];

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return "";
  const date = new Date(dateTimeString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const MedicalReportVisitList = () => {
  const navigate = useNavigate();
  const [medicalReportVisits, setMedicalReportVisits] = useState(initialMedicalReportVisits);
  const [editingId, setEditingId] = useState(null);
  const [tempVisit, setTempVisit] = useState({});
  const [newVisit, setNewVisit] = useState({
    mrName: "",
    visitDateTime: "",
    discussionNotes: "",
    requestedOrders: "",
    nextVisitDate: ""
  });
  const [saveStatus, setSaveStatus] = useState({
    visible: false,
    color: "success",
    message: ""
  });

  const handleBack = () => navigate(-1);
  
  const handleView = (id) => navigate(`/medical-report-visit-details/${id}`);
  
  const handleEdit = (id) => {
    const visitToEdit = medicalReportVisits.find(visit => visit.id === id);
    setTempVisit({...visitToEdit});
    setEditingId(id);
  };
  
  const handleDelete = (id) => {
    const updatedVisits = medicalReportVisits.filter((visit) => visit.id !== id);
    setMedicalReportVisits(updatedVisits);
  };

  const handleSave = (id) => {
    setMedicalReportVisits(medicalReportVisits.map(visit => 
      visit.id === id ? {...visit, ...tempVisit} : visit
    ));
    setEditingId(null);
    setTempVisit({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setTempVisit({});
  };

  const handleAddNew = () => {
    if (!newVisit.mrName || !newVisit.visitDateTime) {
      setSaveStatus({
        visible: true,
        color: "danger",
        message: "MR Name and Visit Date & Time are required!"
      });
      setTimeout(() => setSaveStatus({...saveStatus, visible: false}), 3000);
      return;
    }
    
    const newId = Math.max(...medicalReportVisits.map(v => v.id), 0) + 1;
    setMedicalReportVisits([...medicalReportVisits, {
      id: newId,
      ...newVisit
    }]);
    setNewVisit({
      mrName: "",
      visitDateTime: "",
      discussionNotes: "",
      requestedOrders: "",
      nextVisitDate: ""
    });
  };

  const handleTempInputChange = (e) => {
    const { name, value } = e.target;
    setTempVisit({...tempVisit, [name]: value});
  };

  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    setNewVisit({...newVisit, [name]: value});
  };

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Excel file selected:", file.name);
      // Implement Excel upload logic
    }
  };

  const handleExcelDownload = () => {
    const headers = [
      "Sr.No",
      "ID",
      "MR Name",
      "Visit Date & Time",
      "Discussion Notes",
      "Requested Orders",
      "Next Visit Date",
    ];
    const rows = medicalReportVisits.map((visit, index) => [
      index + 1,
      visit.id,
      visit.mrName,
      formatDateTime(visit.visitDateTime),
      visit.discussionNotes,
      visit.requestedOrders,
      visit.nextVisitDate,
    ]);
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "medical_report_visits.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveAll = () => {
    // Here you would typically make an API call to save all data
    console.log("Saving all data:", medicalReportVisits);
    
    setSaveStatus({
      visible: true,
      color: "success",
      message: "All data saved successfully!"
    });
    
    setTimeout(() => {
      setSaveStatus({ ...saveStatus, visible: false });
    }, 3000);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Medical Report Visits" breadcrumbItem="Visit List" />

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
                      Medical Report Visit List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
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

                  {/* Add New Visit Form */}
                  <div className="mb-4 p-3 border rounded" style={{ background: "rgba(0, 123, 255, 0.05)" }}>
                    <h5 style={{ color: "#007bff", marginBottom: "15px" }}>Add New Visit</h5>
                    <div className="row g-2">
                      <div className="col-md-3">
                        <Input
                          type="select"
                          name="mrName"
                          value={newVisit.mrName}
                          onChange={handleNewInputChange}
                          style={{ borderRadius: "10px", height: "38px" }}
                        >
                          <option value="">Select MR Name</option>
                          {mrNames.map(name => (
                            <option key={name} value={name}>{name}</option>
                          ))}
                        </Input>
                      </div>
                      <div className="col-md-2">
                        <Input
                          type="datetime-local"
                          name="visitDateTime"
                          value={newVisit.visitDateTime}
                          onChange={handleNewInputChange}
                          style={{ borderRadius: "10px", height: "38px" }}
                        />
                      </div>
                      <div className="col-md-3">
                        <Input
                          type="text"
                          name="discussionNotes"
                          placeholder="Discussion Notes"
                          value={newVisit.discussionNotes}
                          onChange={handleNewInputChange}
                          style={{ borderRadius: "10px", height: "38px" }}
                        />
                      </div>
                      <div className="col-md-2">
                        <Input
                          type="text"
                          name="requestedOrders"
                          placeholder="Requested Orders"
                          value={newVisit.requestedOrders}
                          onChange={handleNewInputChange}
                          style={{ borderRadius: "10px", height: "38px" }}
                        />
                      </div>
                      <div className="col-md-2">
                        <Input
                          type="date"
                          name="nextVisitDate"
                          value={newVisit.nextVisitDate}
                          onChange={handleNewInputChange}
                          style={{ borderRadius: "10px", height: "38px" }}
                        />
                      </div>
                    </div>
                    <Button 
                      color="primary" 
                      onClick={handleAddNew}
                      className="mt-3"
                      style={{
                        borderRadius: "10px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      Add Visit
                    </Button>
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
                          <th>Visit Date & Time</th>
                          <th>Discussion Notes</th>
                          <th>Requested Orders</th>
                          <th>Next Visit Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {medicalReportVisits.map((visit, index) => (
                          <tr key={visit.id}>
                            <td>{index + 1}</td>
                            <td>{visit.id}</td>
                            <td>
                              {editingId === visit.id ? (
                                <Input
                                  type="select"
                                  name="mrName"
                                  value={tempVisit.mrName || visit.mrName}
                                  onChange={handleTempInputChange}
                                  style={{ borderRadius: "10px", height: "38px" }}
                                >
                                  {mrNames.map(name => (
                                    <option key={name} value={name}>{name}</option>
                                  ))}
                                </Input>
                              ) : (
                                visit.mrName
                              )}
                            </td>
                            <td>
                              {editingId === visit.id ? (
                                <Input
                                  type="datetime-local"
                                  name="visitDateTime"
                                  value={tempVisit.visitDateTime || visit.visitDateTime}
                                  onChange={handleTempInputChange}
                                  style={{ borderRadius: "10px", height: "38px" }}
                                />
                              ) : (
                                formatDateTime(visit.visitDateTime)
                              )}
                            </td>
                            <td>
                              {editingId === visit.id ? (
                                <Input
                                  type="text"
                                  name="discussionNotes"
                                  value={tempVisit.discussionNotes || visit.discussionNotes}
                                  onChange={handleTempInputChange}
                                  style={{ borderRadius: "10px", height: "38px" }}
                                />
                              ) : (
                                visit.discussionNotes
                              )}
                            </td>
                            <td>
                              {editingId === visit.id ? (
                                <Input
                                  type="text"
                                  name="requestedOrders"
                                  value={tempVisit.requestedOrders || visit.requestedOrders}
                                  onChange={handleTempInputChange}
                                  style={{ borderRadius: "10px", height: "38px" }}
                                />
                              ) : (
                                visit.requestedOrders
                              )}
                            </td>
                            <td>
                              {editingId === visit.id ? (
                                <Input
                                  type="date"
                                  name="nextVisitDate"
                                  value={tempVisit.nextVisitDate || visit.nextVisitDate}
                                  onChange={handleTempInputChange}
                                  style={{ borderRadius: "10px", height: "38px" }}
                                />
                              ) : (
                                visit.nextVisitDate
                              )}
                            </td>
                            <td>
                              <div className="d-flex gap-2 justify-content-center">
                                {editingId === visit.id ? (
                                  <>
                                    <FaSave
                                      style={{
                                        fontSize: "18px",
                                        color: "#28a745",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => handleSave(visit.id)}
                                      title="Save"
                                    />
                                    <FaTimes
                                      style={{
                                        fontSize: "18px",
                                        color: "#dc3545",
                                        cursor: "pointer",
                                      }}
                                      onClick={handleCancel}
                                      title="Cancel"
                                    />
                                  </>
                                ) : (
                                  <>
                                    <FaEye
                                      style={{
                                        fontSize: "18px",
                                        color: "#007bff",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => handleView(visit.id)}
                                      title="View"
                                    />
                                    <FaEdit
                                      style={{
                                        fontSize: "18px",
                                        color: "#4caf50",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => handleEdit(visit.id)}
                                      title="Edit"
                                    />
                                    <FaTrash
                                      style={{
                                        fontSize: "18px",
                                        color: "#f44336",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => handleDelete(visit.id)}
                                      title="Delete"
                                    />
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                  
                    <Button
                      color="primary"
                      onClick={handleSaveAll}
                      style={{
                        height: "35px",
                        padding: "3px 15px",
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
                      <FaDatabase style={{ fontSize: "18px" }} /> Save All Data
                    </Button>
                  </div>
                  
                  {saveStatus.visible && (
                    <Alert color={saveStatus.color} className="mt-3">
                      {saveStatus.message}
                    </Alert>
                  )}
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
          max-height: 500px;
          overflow-y: auto;
          overflow-x: auto;
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .table {
          margin-bottom: 0;
          min-width: 1200px;
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

export default MedicalReportVisitList;