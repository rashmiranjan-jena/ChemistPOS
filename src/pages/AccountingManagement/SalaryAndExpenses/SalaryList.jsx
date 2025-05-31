import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import { FaEdit, FaTrash, FaFileExcel } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getSalaries,
  deleteSalary,
} from "../../../ApiService/AccountingManagement/SalaryAndExpense";

const SalaryList = () => {
  const navigate = useNavigate();
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        setIsLoading(true);
        const response = await getSalaries();
        setSalaryRecords(response ?? []);
      } catch (error) {
        console.error("Error fetching salaries:", error);
        setError(
          error?.response?.data?.message || "Failed to fetch salary data."
        );
        Swal.fire({
          title: "Error!",
          text:
            error?.response?.data?.message || "Failed to fetch salary data.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSalaries();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = (id) => {
    console.log(id);
    navigate("/salary-form", { state: { id } });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteSalary(id);
          setSalaryRecords(salaryRecords.filter((record) => record.id !== id));
          Swal.fire({
            title: "Deleted!",
            text: "Salary record has been deleted.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error("Error deleting salary:", error);
          Swal.fire({
            title: "Error!",
            text:
              error?.response?.data?.message ||
              "Failed to delete salary record.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };

  const handleExcelDownload = () => {
    const headers = [
      "Sr.No",
      "ID",
      "Employee Name",
      "Employee ID",
      "Salary Amount",
      "Payment Mode",
      "Date of Payment",
      "Reference No.",
    ];
    const rows = salaryRecords.map((record, index) => [
      index + 1,
      record.id,
      record.employee_name,
      record.employee_code,
      record.salary_amount,
      record.payment_mode,
      record.payment_date,
      record.ref_no || "N/A",
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "salary_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Finance" breadcrumbItem="Salary List" />

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
                      Salary List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={() => navigate("/salary-form")}
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

                  {isLoading ? (
                    <div className="text-center">
                      <p>Loading salaries...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center text-danger">
                      <p>{error}</p>
                    </div>
                  ) : salaryRecords.length === 0 ? (
                    <div className="text-center">
                      <p>No salary records found.</p>
                    </div>
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
                            <th>Sr.No</th>
                            <th>ID</th>
                            <th>Employee Name</th>
                            <th>Employee ID</th>
                            <th>Salary Amount</th>
                            <th>Payment Mode</th>
                            <th>Date of Payment</th>
                            <th>Reference No.</th>
                            <th>Net Salary</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {salaryRecords.map((record, index) => (
                            <tr key={record.id}>
                              <td>{index + 1}</td>
                              <td>{record.id}</td>
                              <td>{record.employee_name}</td>
                              <td>{record.employee_code}</td>
                              <td>
                                ${parseFloat(record.salary_amount).toFixed(2)}
                              </td>
                              <td>{record.payment_mode}</td>
                              <td>{record.payment_date}</td>
                              <td>{record.ref_no || "N/A"}</td>
                              <td>{record.net_salary}</td>
                              <td>
                                <div className="d-flex gap-2 justify-content-center">
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

export default SalaryList;
