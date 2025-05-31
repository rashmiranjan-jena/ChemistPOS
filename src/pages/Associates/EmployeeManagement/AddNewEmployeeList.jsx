import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaFileExcel } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getEmployeeDetails,
  deleteEmployee,
} from "../../../ApiService/Associats/Employee";

const AddNewEmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    getEmployees();
  }, []);

  const getEmployees = async () => {
    try {
      setLoading(true);
      const response = await getEmployeeDetails();
      if (response?.status === 200) {
        setEmployees(response?.data || []);
      }
      setLoading(false);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch employees"
      );
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setModal(true);
  };

  const handleEdit = (id) => {
    navigate(`/add-new-employee-cart`, {
      state: { emp_id: id },
    });
  };

  const handleDelete = (id) => {
    if (!id) {
      Swal.fire({
        title: "Error!",
        text: "Invalid employee ID.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

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
          const response = await deleteEmployee(id);
          if (response?.status === 200 || response?.status === 204) {
            Swal.fire({
              title: "Deleted!",
              text: "The employee has been deleted.",
              icon: "success",
              confirmButtonText: "OK",
            });
            // Refresh employee list
            await getEmployees();
          }
        } catch (error) {
          // Error is already handled in deleteEmployee with Swal, but we can log it
          console.error("Delete error:", error);
        }
      }
    });
  };

  const handleExcelDownload = () => {
    const headers = [
      "ID",
      "Name",
    
      "Department",
      "Designation",
      "Store",
    
    ];
    const rows =
      employees?.map((employee) => [
        employee?.emp_id ?? "N/A",
        employee?.full_name ?? "N/A",
       
        employee?.department_name ?? "N/A",
        employee?.designation_name ?? "N/A",
        employee?.store_name ?? "N/A",
      
      ]) || [];
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "employee_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleModal = () => setModal(!modal);

  // Helper function to format address
  const formatAddress = (address) => {
    if (!address || Object.keys(address).length === 0) return "N/A";
    const { address1, city, state, country } = address;
    return [address1, city, state, country].filter(Boolean).join(", ") || "N/A";
  };

  // Helper function to format educational details
  const formatEducationalDetails = (details) => {
    if (!details || Object.keys(details).length === 0) return "N/A";
    const { institution_name, degree, year_of_completion } = details;
    return `${institution_name || "N/A"}, ${degree || "N/A"}, ${
      year_of_completion || "N/A"
    }`;
  };

  // Helper function to format experience details
  const formatExperienceDetails = (details) => {
    if (!details || Object.keys(details).length === 0) return "N/A";
    const { previous_companies, designation, experience_duration } = details;
    return `${previous_companies || "N/A"}, ${designation || "N/A"}, ${
      experience_duration || "N/A"
    }`;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Employee Management"
            breadcrumbItem="Employee List"
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
                      Employee List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={() => navigate("/add-new-employee-cart")}
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

                  {loading ? (
                    <div className="text-center">Loading...</div>
                  ) : error ? (
                    <div className="text-danger text-center">
                      Error: {error}
                    </div>
                  ) : employees?.length === 0 ? (
                    <div className="text-center">No data available</div>
                  ) : (
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
                            <th>ID</th>
                            <th>Name</th>
                           
                            <th>Department</th>
                            <th>Designation</th>
                            <th>Store</th>
                           
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {employees?.map((employee) => (
                            <tr key={employee?.emp_id ?? "unknown"}>
                              <td>{employee?.emp_id ?? "N/A"}</td>
                              <td>{employee?.full_name ?? "N/A"}</td>
                             
                              <td>{employee?.department_name ?? "N/A"}</td>
                              <td>{employee?.designation_name ?? "N/A"}</td>
                              <td>{employee?.store_name ?? "N/A"}</td>
                            
                              <td>
                                <div className="d-flex gap-2 justify-content-center">
                                  <FaEye
                                    style={{
                                      fontSize: "18px",
                                      color: "#007bff",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleView(employee)}
                                    title="View"
                                  />
                                  <FaEdit
                                    style={{
                                      fontSize: "18px",
                                      color: "#4caf50",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleEdit(employee?.emp_id ?? null)
                                    }
                                    title="Edit"
                                  />
                                  <FaTrash
                                    style={{
                                      fontSize: "18px",
                                      color: "#f44336",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleDelete(employee?.emp_id ?? null)
                                    }
                                    title="Delete"
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Modal for Employee Details */}
      <Modal isOpen={modal} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>Employee Details</ModalHeader>
        <ModalBody>
          {selectedEmployee && (
            <div>
              <p>
                <strong>ID:</strong> {selectedEmployee?.emp_id ?? "N/A"}
              </p>
              <p>
                <strong>Employee Code:</strong>{" "}
                {selectedEmployee?.emp_code ?? "N/A"}
              </p>
              <p>
                <strong>Salutation:</strong>{" "}
                {selectedEmployee?.salutation ?? "N/A"}
              </p>
              <p>
                <strong>Full Name:</strong>{" "}
                {selectedEmployee?.full_name ?? "N/A"}
              </p>
              <p>
                <strong>Father's Name:</strong>{" "}
                {selectedEmployee?.fathers_name ?? "N/A"}
              </p>
              <p>
                <strong>Mother's Name:</strong>{" "}
                {selectedEmployee?.mothers_name ?? "N/A"}
              </p>
              <p>
                <strong>Date of Birth:</strong> {selectedEmployee?.dob ?? "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {selectedEmployee?.email ?? "N/A"}
              </p>
              <p>
                <strong>Aadhaar No:</strong>{" "}
                {selectedEmployee?.aadhaar_no ?? "N/A"}
              </p>
              <p>
                <strong>PAN No:</strong> {selectedEmployee?.pan_no ?? "N/A"}
              </p>
              <p>
                <strong>Contact No:</strong>{" "}
                {selectedEmployee?.contact_no ?? "N/A"}
              </p>
              <p>
                <strong>Emergency Contact:</strong>{" "}
                {selectedEmployee?.emergency_contact ?? "N/A"}
              </p>
              <p>
                <strong>Blood Group:</strong>{" "}
                {selectedEmployee?.blood_group ?? "N/A"}
              </p>
              <p>
                <strong>Present Address:</strong>{" "}
                {formatAddress(selectedEmployee?.present_address)}
              </p>
              <p>
                <strong>Permanent Address:</strong>{" "}
                {formatAddress(selectedEmployee?.permanent_address)}
              </p>
              <p>
                <strong>Date of Joining:</strong>{" "}
                {selectedEmployee?.doj ?? "N/A"}
              </p>
              <p>
                <strong>Date of Leaving:</strong>{" "}
                {selectedEmployee?.dol ?? "N/A"}
              </p>
              <p>
                <strong>Salary:</strong> {selectedEmployee?.salary ?? "N/A"}
              </p>
              <p>
                <strong>Educational Details:</strong>{" "}
                {formatEducationalDetails(
                  selectedEmployee?.educational_details
                )}
              </p>
              <p>
                <strong>Experience Details:</strong>{" "}
                {formatExperienceDetails(selectedEmployee?.experience_details)}
              </p>
              <p>
                <strong>Department:</strong>{" "}
                {selectedEmployee?.department_name ?? "N/A"}
              </p>
              <p>
                <strong>Designation:</strong>{" "}
                {selectedEmployee?.designation_name ?? "N/A"}
              </p>
              <p>
                <strong>Store:</strong> {selectedEmployee?.store_name ?? "N/A"}
              </p>
              <p>
                <strong>Customer:</strong> {selectedEmployee?.customer ?? "N/A"}
              </p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

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

export default AddNewEmployeeList;
