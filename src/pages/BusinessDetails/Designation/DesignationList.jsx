import React, { useEffect } from "react";
import { Button, Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaFileExcel } from "react-icons/fa"; // Icons for actions and Excel
import Breadcrumbs from "../../../components/Common/Breadcrumb"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import { deleteDesignation, getDesignationDetails } from "../../../ApiService/Degination/Degination";
import Swal from "sweetalert2";

const DesignationList = () => {
  const navigate = useNavigate();
  const [designations,setDesignations] = React.useState([])

  // Sample designation data (replace with actual data from your API or state)
  // const designations = [
  //   {
  //     id: 1,
  //     designationName: "Sales Manager",
  //     designationCode: "SM01",
  //     reportingManager: "Regional Director",
  //     department: "Sales",
  //     description: "Oversees sales team and targets",
  //   },
  //   {
  //     id: 2,
  //     designationName: "Inventory Clerk",
  //     designationCode: "IC02",
  //     reportingManager: "Inventory Supervisor",
  //     department: "Inventory",
  //     description: "Manages stock records",
  //   },
  //   {
  //     id: 3,
  //     designationName: "Accountant",
  //     designationCode: "AC03",
  //     reportingManager: "Finance Manager",
  //     department: "Accounts",
  //     description: "Handles financial transactions",
  //   },
  //   {
  //     id: 4,
  //     designationName: "Pharmacist",
  //     designationCode: "PH04",
  //     reportingManager: "Pharmacy Head",
  //     department: "Pharmacy",
  //     description: "Dispenses medications",
  //   },
  //   {
  //     id: 5,
  //     designationName: "HR Admin",
  //     designationCode: "HR05",
  //     reportingManager: "HR Manager",
  //     department: "Admin",
  //     description: "Manages employee records",
  //   },
  // ];
  useEffect(()=>{
    fetchDesignations();
  },[]);
  const fetchDesignations = async()=>{
    try {
      const response = await getDesignationDetails();
      if(response.status === 200){
        setDesignations(response.data);
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  const handleBack = () => {
    navigate(-1);
  };

  // const handleView = (id) => {
  //   navigate(`/designation-details/${id}`);
  // };

  const handleEdit = (data) => {
    navigate(`/designation-form/`, { state: { data } });
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteDesignation(id);
          if (response.status === 204) {
            Swal.fire({
              title: "Deleted!",
              text: "The designation has been deleted.",
              icon: "success",
            });
            fetchDesignations(); // Refresh the list after deletion
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Failed to delete designation. Please try again.",
            icon: "error",
          });
          console.error("Delete error:", error);
        }
      }
    });
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
      "Designation Name",
      "Designation Code",
      "Reporting Manager",
      "Department Association",
      "Description",
    ];
    const rows = designations.map((designation, index) => [
      index + 1,
      designation.id,
      designation.designationName,
      designation.designationCode,
      designation.reportingManager,
      designation.department,
      designation.description,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "designations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Company" breadcrumbItem="Designation List" />

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
                      Designation List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={() => navigate("/designation-form")}
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
                          <th>Designation Name</th>
                          <th>Designation Code</th>
                          <th>Reporting Manager</th>
                          <th>Department Association</th>
                          <th>Description</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {designations.map((designation, index) => (
                          <tr key={designation.designation_id}>
                            <td>{index + 1}</td>
                            <td>{designation.designation_id}</td>
                            <td>{designation.designation_name}</td>
                            <td>{designation.designation_code}</td>
                            <td>{designation.reporting_manager}</td>
                            <td>{designation.department_name}</td>
                            <td>{designation.description}</td>
                            <td>
                              <div className="d-flex gap-2 justify-content-center">
                                {/* <FaEye
                                  style={{
                                    fontSize: "18px",
                                    color: "#007bff",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleView(designation.id)}
                                  title="View"
                                /> */}
                                <FaEdit
                                  style={{
                                    fontSize: "18px",
                                    color: "#4caf50",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleEdit(designation)}
                                  title="Edit"
                                />
                                <FaTrash
                                  style={{
                                    fontSize: "18px",
                                    color: "#f44336",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleDelete(designation.designation_id)}
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
        }
      `}</style>
    </React.Fragment>
  );
};

export default DesignationList;