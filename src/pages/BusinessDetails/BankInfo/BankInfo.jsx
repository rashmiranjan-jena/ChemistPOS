import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { getBankInfo } from "../../../ApiService/BankInfo/BankInfo";

const BankInfo = () => {
  const navigate = useNavigate();
  const [bankInfos, setBankInfos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBankInfos = async () => {
      try {
        const response = await getBankInfo();
        setBankInfos(response?.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bank info:", error);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch bank details!",
        });
      }
    };
    fetchBankInfos();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = (id) => {
    console.log(id, "Edit button clicked");
    navigate("/bankinfolist", {
      state: { business_bank_id: id },
    });
  };

  const handleDelete = (id, businessName) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete the bank details for ${
        businessName ?? "Unknown"
      }?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Confirm Deletion",
          text: "Please confirm again to delete this bank info.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, confirm deletion!",
        }).then((secondResult) => {
          if (secondResult.isConfirmed) {
            console.log(`Delete bank info with ID: ${id}`);
            // Implement actual delete API call here (e.g., deleteBankInfo(id))
            Swal.fire("Deleted!", "The bank info has been deleted.", "success");
          }
        });
      }
    });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Banking" breadcrumbItem="Bank Info List" />

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
                      Bank Info List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={() => navigate("/bankinfolist")}
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
                        Add Bank Info
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
                    {loading ? (
                      <div>Loading...</div>
                    ) : (
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
                            <th>Business Name</th>
                            <th>Branch</th>
                            <th>Bank Name</th>
                            <th>Account Name</th>
                            <th>Account Number</th>
                            <th>IFSC Code</th>
                            <th>Account Type</th>
                            <th>Payment UPI ID</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bankInfos?.map((bank, index) => (
                            <tr key={bank?.business_bank_id ?? index}>
                              <td>{index + 1}</td>
                              <td>{bank?.business_bank_id}</td>
                              <td>{bank?.buisness_name}</td>
                              <td>{bank?.branch}</td>
                              <td>{bank?.bank_name}</td>
                              <td>{bank?.account_name}</td>
                              <td>{bank?.account_number}</td>
                              <td>{bank?.ifsc_code}</td>
                              <td>{bank?.account_type}</td>
                              <td>{bank?.payment_upi_id ?? "-"}</td>
                              <td>{bank?.status ? "Active" : "Inactive"}</td>
                              <td>
                                <div className="d-flex gap-2 justify-content-center">
                                  <FaEdit
                                    style={{
                                      fontSize: "18px",
                                      color: "#4caf50",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleEdit(bank?.business_bank_id)
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
                                      handleDelete(
                                        bank?.business_bank_id,
                                        bank?.buisness_name
                                      )
                                    }
                                    title="Delete"
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
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
        }
      `}</style>
    </React.Fragment>
  );
};

export default BankInfo;
