import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaFileExcel } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getAllKycDetails,
  deleteKycDetails,
} from "../../../ApiService/AdminModule/KycManagement";

const KycManagementList = () => {
  const navigate = useNavigate();
  const [kycData, setKycData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKycData();
  }, []);

  const fetchKycData = async () => {
    setLoading(true);
    try {
      const data = await getAllKycDetails();
      console.log(data);
      setKycData(data ?? []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching KYC data:", error);
      Swal.fire({
        title: "Error!",
        text: error?.message ?? "Failed to fetch KYC data.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setLoading(false);
    }
  };

  const handleBack = () => navigate(-1);
  const handleView = (id) => navigate(`/kyc-details/${id}`);
  const handleEdit = (id) => navigate(`/kyc-management-form`, { state: { id } });

  const handleDelete = async (id) => {
    const firstConfirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this KYC record.",
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
          await deleteKycDetails(id);
          setKycData(kycData.filter((kyc) => kyc.id !== id));
          Swal.fire({
            title: "Deleted!",
            text: "The KYC record has been successfully deleted.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error("Error deleting KYC record:", error);
          Swal.fire({
            title: "Error!",
            text: error?.message ?? "Failed to delete the KYC record.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    }
  };

  
  const handleExcelDownload = () => {
    const headers = [
      "ID",
      "Document Name",
      "Associate Type",
      "Document Number",
      "Upload Document",
      "Status",
    ];
    const rows =
      kycData?.map((kyc) => [
        kyc.id ?? "",
        kyc.document_name ?? "",
        kyc.associate_type ?? "",
        kyc.document_no ?? "",
        kyc.document_file ?? "N/A",
        kyc.status === true ? "Approved" : "Pending", 
      ]) ?? [];
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "kyc_management_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="KYC Management"
            breadcrumbItem="KYC Management List"
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
                      KYC Management List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={() => navigate("/kyc-management-form")}
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
                        ></i>
                        Add KYC
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
                          <th>Sr. No</th>
                          <th>Document Name</th>
                          <th>Associates</th>
                          <th>Document Number</th>
                          <th>Upload Document</th>
                          <th>Kyc Status</th>
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
                        ) : kycData?.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center">
                              No KYC records found.
                            </td>
                          </tr>
                        ) : (
                          kycData?.map((kyc, index) => (
                            <tr key={kyc?.id ?? kyc.document_no}>
                              <td>{index + 1}</td>
                              <td>{kyc?.document_name ?? "N/A"}</td>
                              <td>
                                <span
                                  className={`badge ${
                                    kyc?.associate_type === "Employee"
                                      ? "bg-primary"
                                      : kyc?.associate_type === "Doctor"
                                      ? "bg-info"
                                      : kyc?.associate_type === "Manufacturer"
                                      ? "bg-warning"
                                      : kyc?.associate_type === "Supplier"
                                      ? "bg-success"
                                      : "bg-purple"
                                  }`}
                                >
                                  {kyc?.associate_type ?? "N/A"}
                                </span>
                              </td>
                              <td>{kyc?.document_no ?? "N/A"}</td>
                              <td>
                                {kyc?.document_file ? (
                                  <a
                                    href={`${
                                      import.meta.env.VITE_API_BASE_URL
                                    }${kyc.document_file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary"
                                    style={{ textDecoration: "underline" }}
                                  >
                                    {kyc.document_file.split("/").pop()}
                                  </a>
                                ) : (
                                  "N/A"
                                )}
                              </td>
                              <td>
                                <span
                                  className={`badge ${
                                    kyc?.status === true ? "bg-success" : "bg-warning"
                                  }`}
                                >
                                  {kyc?.status === true ? "Approved" : "Pending"}
                                </span>
                              </td>
                              <td>
                                <div className="d-flex gap-2 justify-content-center">
                                  <FaEye
                                    style={{
                                      fontSize: "18px",
                                      color: "#007bff",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleView(kyc?.id)}
                                    title="View"
                                  />
                                  <FaEdit
                                    style={{
                                      fontSize: "18px",
                                      color: "#4caf50",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleEdit(kyc?.id)}
                                    title="Edit"
                                  />
                                  <FaTrash
                                    style={{
                                      fontSize: "18px",
                                      color: "#f44336",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleDelete(kyc?.id)}
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
          border-radius: 10px; /* Fixed typo: borderradius -> border-radius */
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
        .bg-purple {
          background-color: #9c27b0 !important;
        }
      `}</style>
    </React.Fragment>
  );
};

export default KycManagementList;