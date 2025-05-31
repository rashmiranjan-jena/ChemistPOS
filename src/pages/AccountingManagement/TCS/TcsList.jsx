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
import { FaEye, FaEdit, FaTrash, FaFileExcel } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getTcsList,
  deleteTcs,
  uploadTcsExcel,
  downloadTcsExcel,
} from "../../../ApiService/AccountingManagement/Tcs";

const TcsList = () => {
  const navigate = useNavigate();
  const [tcsRecords, setTcsRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Fetch TCS records on component mount
  useEffect(() => {
    fetchTcsRecords();
  }, []);

  const fetchTcsRecords = async () => {
    setLoading(true);
    try {
      const response = await getTcsList();
      console.log("TCS Records:", response); // Debug log
      // Ensure numeric fields are converted
      const formattedRecords = response.map((record) => ({
        ...record,
        amount: parseFloat(record.amount) || 0,
        tcs_rate: parseFloat(record.tcs_rate) || 0,
        tcs_deducted: parseFloat(record.tcs_deducted) || 0,
      }));
      setTcsRecords(formattedRecords || []);
      setFilteredRecords(formattedRecords || []);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error?.response?.data?.message || "Failed to fetch TCS records.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle search filtering
  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = tcsRecords.filter(
      (record) =>
        record?.party?.toLowerCase()?.includes(lowerCaseQuery) ||
        record?.pan?.toLowerCase()?.includes(lowerCaseQuery) ||
        record?.invoice_no?.toLowerCase()?.includes(lowerCaseQuery)
    );
    setFilteredRecords(filtered);
  }, [searchQuery, tcsRecords]);

  const handleBack = () => {
    navigate(-1);
  };


  const handleEdit = (id) => {
    navigate("/tcs-form", { state: { id } });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteTcs(id);
        setTcsRecords(tcsRecords.filter((record) => record?.id !== id));
        setFilteredRecords(filteredRecords.filter((record) => record?.id !== id));
        Swal.fire("Deleted!", "TCS record has been deleted.", "success");
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error?.response?.data?.message || "Failed to delete TCS record.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handleExcelUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadTcsExcel(formData);
      Swal.fire("Success!", "Excel file uploaded successfully.", "success");
      fetchTcsRecords();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error?.response?.data?.message || "Failed to upload Excel file.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleExcelDownload = async () => {
    setDownloading(true);
    try {
      await downloadTcsExcel(searchQuery);
      Swal.fire("Success!", "Excel file downloaded successfully.", "success");
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error?.response?.data?.message || "Failed to download Excel file.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setDownloading(false);
    }
  };

  // Helper function to format numbers safely
  const formatNumber = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  document.title = "TCS List";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="TCS Management" breadcrumbItem="TCS List" />

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
                      TCS List
                    </h4>
                    <div className="d-flex flex-wrap gap-2 align-items-center">
                      <Input
                        type="text"
                        placeholder="Search by Party, PAN, or Invoice No."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          width: "250px",
                          borderRadius: "8px",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                          padding: "8px",
                        }}
                      />
                      <Button
                        color="primary"
                        onClick={() => navigate("/tcs-form")}
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
                    {loading ? (
                      <div className="text-center py-4">
                        <i
                          className="bx bx-loader bx-spin"
                          style={{ fontSize: "24px" }}
                        ></i>{" "}
                        Loading...
                      </div>
                    ) : filteredRecords?.length === 0 ? (
                      <div className="text-center py-4">
                        No TCS records found.
                      </div>
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
                            <th>Party</th>
                            <th>PAN</th>
                            <th>Invoice No.</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Section</th>
                            <th>TCS Rate</th>
                            <th>TCS Deducted</th>
                            <th>Payment Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRecords.map((record, index) => (
                            <tr key={record?.id}>
                              <td>{index + 1}</td>
                              <td>{record?.id}</td>
                              <td>{record?.party}</td>
                              <td>{record?.pan}</td>
                              <td>{record?.invoice_no}</td>
                              <td>{record?.date}</td>
                              <td>₹{formatNumber(record?.amount)}</td>
                              <td>{record?.section}</td>
                              <td>{formatNumber(record?.tcs_rate)}</td>
                              <td>₹{formatNumber(record?.tcs_deducted)}</td>
                              <td>{record?.payment_date}</td>
                              <td>
                                <div className="d-flex gap-2 justify-content-center">
                                  
                                  <FaEdit
                                    style={{
                                      fontSize: "18px",
                                      color: "#4caf50",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleEdit(record?.id)}
                                    title="Edit"
                                  />
                                  <FaTrash
                                    style={{
                                      fontSize: "18px",
                                      color: "#f44336",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleDelete(record?.id)}
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

export default TcsList;