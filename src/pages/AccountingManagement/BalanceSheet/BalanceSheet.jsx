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

const BalanceSheet = () => {
  const navigate = useNavigate();
  const [bsRecords, setBSRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filters, setFilters] = useState({
    assets: "",
    liabilities: "",
  });
  const [downloading, setDownloading] = useState(false);

  // Static data for balance sheet records
  const staticData = [
    {
      id: 1,
      assets: "Cash",
      assets_amount: 50000,
      liabilities: "Accounts Payable",
      liabilities_amount: 20000,
    },
    {
      id: 2,
      assets: "Inventory",
      assets_amount: 30000,
      liabilities: "Bank Loan",
      liabilities_amount: 25000,
    },
    {
      id: 3,
      assets: "Accounts Receivable",
      assets_amount: 20000,
      liabilities: "Accrued Expenses",
      liabilities_amount: 5000,
    },
  ];

  // Initialize records on component mount
  useEffect(() => {
    setBSRecords(staticData);
    setFilteredRecords(staticData);
  }, []);

  // Handle filtering based on assets and liabilities categories
  useEffect(() => {
    const { assets, liabilities } = filters;
    let filtered = [...bsRecords];

    // Assets filter
    if (assets) {
      filtered = filtered.filter((record) =>
        record?.assets?.toLowerCase()?.includes(assets.toLowerCase())
      );
    }

    // Liabilities filter
    if (liabilities) {
      filtered = filtered.filter((record) =>
        record?.liabilities?.toLowerCase()?.includes(liabilities.toLowerCase())
      );
    }

    setFilteredRecords(filtered);
  }, [filters, bsRecords]);

  // Calculate totals for summary row
  const calculateTotals = () => {
    const totalAssets = filteredRecords.reduce((sum, record) => sum + (record.assets_amount || 0), 0);
    const totalLiabilities = filteredRecords.reduce((sum, record) => sum + (record.liabilities_amount || 0), 0);
    const equity = totalAssets - totalLiabilities;
    return { totalAssets, totalLiabilities, equity };
  };

  const { totalAssets, totalLiabilities, equity } = calculateTotals();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = (id) => {
    navigate("/balance-sheet-form", { state: { id } }); // Adjust route as needed
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
      setBSRecords(bsRecords.filter((record) => record?.id !== id));
      setFilteredRecords(filteredRecords.filter((record) => record?.id !== id));
      Swal.fire("Deleted!", "Balance sheet record has been deleted.", "success");
    }
  };

  const handleExcelDownload = () => {
    setDownloading(true);
    try {
      // Prepare data for Excel
      const worksheetData = [
        ...filteredRecords.map((record) => ({
          "Sr.No": record.id,
          Assets: record.assets,
          "Assets Amount": `₹${parseFloat(record.assets_amount).toFixed(2)}`,
          Liabilities: record.liabilities,
          "Liabilities Amount": `₹${parseFloat(record.liabilities_amount).toFixed(2)}`,
        })),
        // Summary row
        {
          "Sr.No": "",
          Assets: "Total Assets",
          "Assets Amount": `₹${parseFloat(totalAssets).toFixed(2)}`,
          Liabilities: "Total Liabilities",
          "Liabilities Amount": `₹${parseFloat(totalLiabilities).toFixed(2)}`,
        },
        {
          "Sr.No": "",
          Assets: "Equity",
          "Assets Amount": `₹${parseFloat(equity).toFixed(2)}`,
          Liabilities: "",
          "Liabilities Amount": "",
        },
      ];

      // Create worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Balance Sheet");

      // Download Excel file
      XLSX.writeFile(workbook, "Balance_Sheet_Report.xlsx");
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

  document.title = "Balance Sheet";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Financial Management" breadcrumbItem="Balance Sheet" />

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
                      Balance Sheet
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
                    <Col md="6">
                      <FormGroup>
                        <Label for="assets">Assets Category</Label>
                        <Input
                          type="text"
                          name="assets"
                          id="assets"
                          placeholder="Enter Assets Category"
                          value={filters.assets}
                          onChange={handleFilterChange}
                          style={{
                            borderRadius: "8px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            padding: "8px",
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label for="liabilities">Liabilities Category</Label>
                        <Input
                          type="text"
                          name="liabilities"
                          id="liabilities"
                          placeholder="Enter Liabilities Category"
                          value={filters.liabilities}
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
                      <div className="text-center py-4">No balance sheet records found.</div>
                    ) : (
                      <Table className="table table-striped table-hover align-middle" responsive>
                        <thead style={{ background: "linear-gradient(90deg, #007bff, #00c4cc)", color: "#fff" }}>
                          <tr>
                            <th>Sr.No</th>
                            <th>Assets</th>
                            <th>Assets Amount</th>
                            <th>Liabilities</th>
                            <th>Liabilities Amount</th>
                         
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRecords.map((record, index) => (
                            <tr key={record?.id}>
                              <td>{index + 1}</td>
                              <td>{record?.assets}</td>
                              <td>₹{formatNumber(record?.assets_amount)}</td>
                              <td>{record?.liabilities}</td>
                              <td>₹{formatNumber(record?.liabilities_amount)}</td>
                              
                            </tr>
                          ))}
                          {/* Summary Row */}
                          <tr style={{ fontWeight: "bold", backgroundColor: "#e9ecef" }}>
                            <td colSpan={2}>Total Assets</td>
                            <td>₹{formatNumber(totalAssets)}</td>
                            <td>Total Liabilities</td>
                            <td>₹{formatNumber(totalLiabilities)}</td>
                            <td></td>
                          </tr>
                          <tr style={{ fontWeight: "bold", backgroundColor: "#d4edda" }}>
                            <td colSpan={2}>Equity</td>
                            <td colSpan={3}>₹{formatNumber(equity)}</td>
                            <td></td>
                          </tr>
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

export default BalanceSheet;