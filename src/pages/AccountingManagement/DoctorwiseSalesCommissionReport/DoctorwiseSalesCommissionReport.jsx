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
  FormGroup,
  Label,
} from "reactstrap";
import { FaEdit, FaTrash, FaFileExcel } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const DoctorwiseSalesCommissionReport = () => {
  const navigate = useNavigate();
  const [commissionRecords, setCommissionRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    invoiceNo: "",
    doctorName: "",
  });
  const [downloading, setDownloading] = useState(false);

  // Static data for doctor-wise sales commission records
  const staticData = [
    {
      id: 1,
      doctor_name: "Dr. John Smith",
      invoice_no: "INV001",
      date: "2025-04-01",
      item: "Consultation Package",
      amount: 5000,
      commission_percent: 10,
      commission_amount: 500, // amount * (commission_percent / 100)
    },
    {
      id: 2,
      doctor_name: "Dr. Emily Brown",
      invoice_no: "INV002",
      date: "2025-04-03",
      item: "Diagnostic Test",
      amount: 3000,
      commission_percent: 8,
      commission_amount: 240, // amount * (commission_percent / 100)
    },
    {
      id: 3,
      doctor_name: "Dr. Michael Lee",
      invoice_no: "INV003",
      date: "2025-04-05",
      item: "Therapy Session",
      amount: 4000,
      commission_percent: 12,
      commission_amount: 480, // amount * (commission_percent / 100)
    },
  ];

  // Initialize records on component mount
  useEffect(() => {
    setCommissionRecords(staticData);
    setFilteredRecords(staticData);
  }, []);

  // Handle filtering based on date range, invoice no, and doctor name
  useEffect(() => {
    const { startDate, endDate, invoiceNo, doctorName } = filters;
    let filtered = [...commissionRecords];

    // Date range filter
    if (startDate && endDate) {
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return recordDate >= start && recordDate <= end;
      });
    }

    // Invoice No filter
    if (invoiceNo) {
      filtered = filtered.filter((record) =>
        record?.invoice_no?.toLowerCase()?.includes(invoiceNo.toLowerCase())
      );
    }

    // Doctor Name filter
    if (doctorName) {
      filtered = filtered.filter((record) =>
        record?.doctor_name?.toLowerCase()?.includes(doctorName.toLowerCase())
      );
    }

    setFilteredRecords(filtered);
  }, [filters, commissionRecords]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = (id) => {
    navigate("/commission-form", { state: { id } }); // Adjust route as needed
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
      setCommissionRecords(commissionRecords.filter((record) => record?.id !== id));
      setFilteredRecords(filteredRecords.filter((record) => record?.id !== id));
      Swal.fire("Deleted!", "Commission record has been deleted.", "success");
    }
  };

  const handleExcelDownload = () => {
    setDownloading(true);
    try {
      // Prepare data for Excel
      const worksheetData = filteredRecords.map((record) => ({
        "Sr.No": record.id,
        "Doctor Name": record.doctor_name,
        "Invoice No": record.invoice_no,
        Date: record.date,
        Item: record.item,
        Amount: `₹${parseFloat(record.amount).toFixed(2)}`,
        "Commission %": `${record.commission_percent}%`,
        "Commission Amount": `₹${parseFloat(record.commission_amount).toFixed(2)}`,
      }));

      // Create worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Doctorwise Commission");

      // Download Excel file
      XLSX.writeFile(workbook, "Doctorwise_Sales_Commission_Report.xlsx");
      Swal.fire("Success!", "Excel file downloaded successfully.", "success");
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to download Excel file.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setDownloading(false);
    }
  };

  // Helper function to format numbers
  const formatNumber = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  document.title = "Doctorwise Sales Commission Report";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Sales Management" breadcrumbItem="Doctorwise Sales Commission Report" />

          <Row>
            <Col xs="12">
              <Card className="shadow-lg" style={{ borderRadius: "20px", overflow: "hidden", background: "#f8f9fa" }}>
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
                      Doctorwise Sales Commission Report
                    </h4>
                    <div className="d-flex flex-wrap gap-2 align-items-center">
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
                        <i className="bx bx-undo" style={{ fontSize: "18px" }}></i>
                      </Button>
                    </div>
                  </div>

                  {/* Filter Section */}
                  <Row className="mb-4">
                    <Col md="4">
                      <FormGroup>
                        <Label for="startDate">Start Date</Label>
                        <Input
                          type="date"
                          name="startDate"
                          id="startDate"
                          value={filters.startDate}
                          onChange={handleFilterChange}
                          style={{
                            borderRadius: "8px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            padding: "8px",
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label for="endDate">End Date</Label>
                        <Input
                          type="date"
                          name="endDate"
                          id="endDate"
                          value={filters.endDate}
                          onChange={handleFilterChange}
                          style={{
                            borderRadius: "8px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            padding: "8px",
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label for="invoiceNo">Invoice No</Label>
                        <Input
                          type="text"
                          name="invoiceNo"
                          id="invoiceNo"
                          placeholder="Enter Invoice No"
                          value={filters.invoiceNo}
                          onChange={handleFilterChange}
                          style={{
                            borderRadius: "8px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            padding: "8px",
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label for="doctorName">Doctor Name</Label>
                        <Input
                          type="text"
                          name="doctorName"
                          id="doctorName"
                          placeholder="Enter Doctor Name"
                          value={filters.doctorName}
                          onChange={handleFilterChange}
                          style={{
                            borderRadius: "8px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            padding: "8px",
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <div className="table-container">
                    {filteredRecords?.length === 0 ? (
                      <div className="text-center py-4">No commission records found.</div>
                    ) : (
                      <Table className="table table-striped table-hover align-middle" responsive>
                        <thead style={{ background: "linear-gradient(90deg, #007bff, #00c4cc)", color: "#fff" }}>
                          <tr>
                            <th>Sr.No</th>
                            <th>Doctor Name</th>
                            <th>Invoice No</th>
                            <th>Date</th>
                            <th>Item</th>
                            <th>Amount</th>
                            <th>Commission %</th>
                            <th>Commission Amount</th>
                         
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRecords.map((record, index) => (
                            <tr key={record?.id}>
                              <td>{index + 1}</td>
                              <td>{record?.doctor_name}</td>
                              <td>{record?.invoice_no}</td>
                              <td>{record?.date}</td>
                              <td>{record?.item}</td>
                              <td>₹{formatNumber(record?.amount)}</td>
                              <td>{record?.commission_percent}%</td>
                              <td>₹{formatNumber(record?.commission_amount)}</td>
                             
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
          min-width: 1000px;
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

export default DoctorwiseSalesCommissionReport;