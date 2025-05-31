import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaFileExcel } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getSellerTypes,
  deleteSellerType,
  uploadSellerTypesExcel,
  downloadSellerTypesExcel,
} from "../../../ApiService/Associate/SellerTypeMaster";

const SellerTypeMasterList = () => {
  const navigate = useNavigate();
  const [sellerTypes, setSellerTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  useEffect(() => {
    const fetchSellerTypes = async () => {
      try {
        const data = await getSellerTypes();
        setSellerTypes(data ?? []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching seller types:", error);
        Swal.fire({
          title: "Error!",
          text: error?.message || "Failed to fetch seller types.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoading(false);
      }
    };

    fetchSellerTypes();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = (id) => {
    navigate(`/seller-type-master-form`, { state: { id } });
  };

  const handleDelete = async (id) => {
    const firstConfirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this seller type.",
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
          await deleteSellerType(id);
          setSellerTypes((prevTypes) =>
            prevTypes.filter((type) => type?.id !== id)
          );
          Swal.fire({
            title: "Deleted!",
            text: "The seller type has been successfully deleted.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error("Error deleting seller type:", error);
          Swal.fire({
            title: "Error!",
            text: error?.message || "Failed to delete the seller type.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    }
  };

  // const handleExcelUpload = async (event) => {
  //   const file = event?.target?.files?.[0];
  //   if (file) {
  //     const formData = new FormData();
  //     formData.append("excel_file", file);

  //     try {
  //       await uploadSellerTypesExcel(formData);
  //       Swal.fire({
  //         title: "Upload Successful!",
  //         text: "The Excel file has been successfully uploaded and processed.",
  //         icon: "success",
  //         confirmButtonText: "OK",
  //       });

  //       const updatedData = await getSellerTypes();
  //       setSellerTypes(updatedData ?? []);
  //     } catch (error) {
  //       console.error("Error uploading Excel file:", error);
  //       Swal.fire({
  //         title: "Error!",
  //         text: error?.message || "Failed to upload the Excel file.",
  //         icon: "error",
  //         confirmButtonText: "OK",
  //       });
  //     }
  //   } else {
  //     Swal.fire({
  //       title: "No File Selected!",
  //       text: "Please select an Excel file to upload.",
  //       icon: "warning",
  //       confirmButtonText: "OK",
  //     });
  //   }
  // };

  const handleExcelDownload = async () => {
    setDownloading(true);
    try {
      await downloadSellerTypesExcel();
      Swal.fire({
        title: "Success!",
        text: "Excel file downloaded successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error downloading Excel file:", error);
      Swal.fire({
        title: "Error!",
        text: error?.message ?? "Failed to download Excel file.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Sellers"
            breadcrumbItem="Seller Type Master List"
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
                      Seller Type Master List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={() => navigate("/seller-type-master-form")}
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
                        Add
                      </Button>
                      {/* <label
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
                      /> */}
                      <Button
                        color="success"
                        onClick={handleExcelDownload}
                        disabled={downloading}
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
                        {downloading ? "Downloading..." : "Download"}
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
                          <th>Seller Type ID</th>
                          <th>Seller Type Name</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="4" className="text-center">
                              Loading...
                            </td>
                          </tr>
                        ) : (sellerTypes?.length ?? 0) === 0 ? (
                          <tr>
                            <td colSpan="4" className="text-center">
                              No seller types found.
                            </td>
                          </tr>
                        ) : (
                          sellerTypes.map((type, index) => (
                            <tr key={type?.id ?? index}>
                              <td>{index + 1}</td>
                              <td>{type?.id ?? "N/A"}</td>
                              <td>{type?.seller_type ?? "N/A"}</td>
                              <td>
                                <div className="d-flex gap-1">
                                 
                                  <FaEdit
                                    style={{
                                      fontSize: "18px",
                                      color: "#4caf50",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleEdit(type?.id)}
                                    title="Edit"
                                  />
                                  <FaTrash
                                    style={{
                                      fontSize: "18px",
                                      color: "#f44336",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleDelete(type?.id)}
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
            justify-content: space-between;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default SellerTypeMasterList;
