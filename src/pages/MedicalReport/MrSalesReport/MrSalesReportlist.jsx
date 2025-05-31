import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaFileExcel } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { getSalesReports } from "../../../ApiService/MedicalRepresentative/MrSalesReport";
import Swal from "sweetalert2";

const MrSalesReportList = () => {
  const navigate = useNavigate();
  const [salesReports, setSalesReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesReports = async () => {
      try {
        const data = await getSalesReports();
        setSalesReports(data ?? []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sales reports:", error);
        Swal.fire({
          title: "Error!",
          text: error?.message ?? "Failed to fetch sales reports.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoading(false);
      }
    };

    fetchSalesReports();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Excel file selected:", file.name);
    
    }
  };

  const handleExcelDownload = () => {
    const headers = [
      "Sr.No",
      "ID",
      "MR Name",
      "Date Range",
      "Associated Brands",
      "Total Sales",
      "Commission Rate (%)",
      "Commission Amount",
    ];
    const rows = salesReports.map((report, index) => [
      index + 1,
      report.id,
      report.mrName,
      `${report.dateRange.startDate} to ${report.dateRange.endDate}`,
      report.associatedBrands.join(", "),
      `₹${report.totalSales.toLocaleString()}`,
      report.commissionRate,
      `₹${report.commissionAmount.toLocaleString()}`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "mr_sales_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="MR Sales Report" breadcrumbItem="Sales Report List" />

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
                      MR Sales Report List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
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
                          <th>Sales Report ID</th>
                          <th>MR Name</th>
                          <th>Date Range</th>
                          <th>Associated Brands</th>
                          <th>Total Sales</th>
                          <th>Commission Rate (%)</th>
                          <th>Commission Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="8" className="text-center">
                              Loading...
                            </td>
                          </tr>
                        ) : salesReports.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="text-center">
                              No sales reports found.
                            </td>
                          </tr>
                        ) : (
                          salesReports.map((report, index) => (
                            <tr key={report.id}>
                              <td>{index + 1}</td>
                              <td>{report.id}</td>
                              <td>{report.mrName}</td>
                              <td>{`${report.dateRange.startDate} to ${report.dateRange.endDate}`}</td>
                              <td>{report.associatedBrands.join(", ")}</td>
                              <td>₹{report.totalSales.toLocaleString()}</td>
                              <td>{report.commissionRate}%</td>
                              <td>₹{report.commissionAmount.toLocaleString()}</td>
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

export default MrSalesReportList;