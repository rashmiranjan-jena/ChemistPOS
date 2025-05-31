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

const MRwiseSalesCommissionReceivableReport = () => {
  const navigate = useNavigate();
  const [commissionRecords, setCommissionRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filters, setFilters] = useState({
    mrName: "",
    brand: "",
    minSales: "",
    maxSales: "",
  });
  const [downloading, setDownloading] = useState(false);

  // Static data for MR-wise sales commission receivable records
  const staticData = [
    {
      id: 1,
      mr_name: "Amit Sharma",
      brand: "PharmaCorp",
      sales: 50000,
      commission_percent: 5,
      total_commission: 2500, // sales * (commission_percent / 100)
      received: 1000,
      balance: 1500, // total_commission - received
    },
    {
      id: 2,
      mr_name: "Priya Patel",
      brand: "HealthPlus",
      sales: 75000,
      commission_percent: 6,
      total_commission: 4500, // sales * (commission_percent / 100)
      received: 2000,
      balance: 2500, // total_commission - received
    },
    {
      id: 3,
      mr_name: "Rahul Verma",
      brand: "MedLife",
      sales: 30000,
      commission_percent: 4,
      total_commission: 1200, // sales * (commission_percent / 100)
      received: 0,
      balance: 1200, // total_commission - received
    },
  ];

  // Initialize records on component mount
  useEffect(() => {
    setCommissionRecords(staticData);
    setFilteredRecords(staticData);
  }, []);

  // Handle filtering based on MR name, brand, and sales range
  useEffect(() => {
    const { mrName, brand, minSales, maxSales } = filters;
    let filtered = [...commissionRecords];

    // MR Name filter
    if (mrName) {
      filtered = filtered.filter((record) =>
        record?.mr_name?.toLowerCase()?.includes(mrName.toLowerCase())
      );
    }

    // Brand filter
    if (brand) {
      filtered = filtered.filter((record) =>
        record?.brand?.toLowerCase()?.includes(brand.toLowerCase())
      );
    }

    // Sales range filter
    if (minSales || maxSales) {
      filtered = filtered.filter((record) => {
        const sales = parseFloat(record.sales);
        const min = minSales ? parseFloat(minSales) : -Infinity;
        const max = maxSales ? parseFloat(maxSales) : Infinity;
        return sales >= min && sales <= max;
      });
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
    navigate("/mr-commission-form", { state: { id } }); // Adjust route as needed
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
        "MR Name": record.mr_name,
        Brand: record.brand,
        Sales: `₹${parseFloat(record.sales).toFixed(2)}`,
        "Commission %": `${record.commission_percent}%`,
        "Total Commission": `₹${parseFloat(record.total_commission).toFixed(2)}`,
        Received: `₹${parseFloat(record.received).toFixed(2)}`,
        Balance: `₹${parseFloat(record.balance).toFixed(2)}`,
      }));

      // Create worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "MRwise Commission");

      // Download Excel file
      XLSX.writeFile(workbook, "MRwise_Sales_Commission_Receivable_Report.xlsx");
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

  document.title = "MR-wise Sales Commission Receivable Report";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Sales Management" breadcrumbItem="MR-wise Sales Commission Receivable Report" />

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
                      MR-wise Sales Commission Receivable Report
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
                        <Label for="mrName">MR Name</Label>
                        <Input
                          type="text"
                          name="mrName"
                          id="mrName"
                          placeholder="Enter MR Name"
                          value={filters.mrName}
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
                        <Label for="brand">Brand</Label>
                        <Input
                          type="text"
                          name="brand"
                          id="brand"
                          placeholder="Enter Brand"
                          value={filters.brand}
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
                        <Label for="minSales">Min Sales</Label>
                        <Input
                          type="number"
                          name="minSales"
                          id="minSales"
                          placeholder="Enter Min Sales"
                          value={filters.minSales}
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
                        <Label for="maxSales">Max Sales</Label>
                        <Input
                          type="number"
                          name="maxSales"
                          id="maxSales"
                          placeholder="Enter Max Sales"
                          value={filters.maxSales}
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
                            <th>MR Name</th>
                            <th>Brand</th>
                            <th>Sales</th>
                            <th>Commission %</th>
                            <th>Total Commission</th>
                            <th>Received</th>
                            <th>Balance</th>
                           
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRecords.map((record, index) => (
                            <tr key={record?.id}>
                              <td>{index + 1}</td>
                              <td>{record?.mr_name}</td>
                              <td>{record?.brand}</td>
                              <td>₹{formatNumber(record?.sales)}</td>
                              <td>{record?.commission_percent}%</td>
                              <td>₹{formatNumber(record?.total_commission)}</td>
                              <td>₹{formatNumber(record?.received)}</td>
                              <td>₹{formatNumber(record?.balance)}</td>
                              
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

export default MRwiseSalesCommissionReceivableReport;