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

const DailyCollectionReport = () => {
  const navigate = useNavigate();
  const [collectionRecords, setCollectionRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    minCash: "",
    maxCash: "",
    minUPI: "",
    maxUPI: "",
    minCard: "",
    maxCard: "",
    minCredit: "",
    maxCredit: "",
  });
  const [downloading, setDownloading] = useState(false);

  // Static data for daily collection records
  const staticData = [
    {
      id: 1,
      date: "2025-04-01",
      cash: 5000,
      upi: 3000,
      card: 2000,
      credit: 1000,
      total: 11000, // cash + upi + card + credit
    },
    {
      id: 2,
      date: "2025-04-02",
      cash: 4000,
      upi: 5000,
      card: 1500,
      credit: 2000,
      total: 12500, // cash + upi + card + credit
    },
    {
      id: 3,
      date: "2025-04-03",
      cash: 6000,
      upi: 2000,
      card: 3000,
      credit: 500,
      total: 11500, // cash + upi + card + credit
    },
  ];

  // Initialize records on component mount
  useEffect(() => {
    setCollectionRecords(staticData);
    setFilteredRecords(staticData);
  }, []);

  // Handle filtering based on date range and payment method amounts
  useEffect(() => {
    const {
      startDate,
      endDate,
      minCash,
      maxCash,
      minUPI,
      maxUPI,
      minCard,
      maxCard,
      minCredit,
      maxCredit,
    } = filters;
    let filtered = [...collectionRecords];

    // Date range filter
    if (startDate && endDate) {
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return recordDate >= start && recordDate <= end;
      });
    }

    // Cash amount range filter
    if (minCash || maxCash) {
      filtered = filtered.filter((record) => {
        const cash = parseFloat(record.cash);
        const min = minCash ? parseFloat(minCash) : -Infinity;
        const max = maxCash ? parseFloat(maxCash) : Infinity;
        return cash >= min && cash <= max;
      });
    }

    // UPI amount range filter
    if (minUPI || maxUPI) {
      filtered = filtered.filter((record) => {
        const upi = parseFloat(record.upi);
        const min = minUPI ? parseFloat(minUPI) : -Infinity;
        const max = maxUPI ? parseFloat(maxUPI) : Infinity;
        return upi >= min && upi <= max;
      });
    }

    // Card amount range filter
    if (minCard || maxCard) {
      filtered = filtered.filter((record) => {
        const card = parseFloat(record.card);
        const min = minCard ? parseFloat(minCard) : -Infinity;
        const max = maxCard ? parseFloat(maxCard) : Infinity;
        return card >= min && card <= max;
      });
    }

    // Credit amount range filter
    if (minCredit || maxCredit) {
      filtered = filtered.filter((record) => {
        const credit = parseFloat(record.credit);
        const min = minCredit ? parseFloat(minCredit) : -Infinity;
        const max = maxCredit ? parseFloat(maxCredit) : Infinity;
        return credit >= min && credit <= max;
      });
    }

    setFilteredRecords(filtered);
  }, [filters, collectionRecords]);

  // Calculate totals for summary row
  const calculateTotals = () => {
    const totalCash = filteredRecords.reduce((sum, record) => sum + (record.cash || 0), 0);
    const totalUPI = filteredRecords.reduce((sum, record) => sum + (record.upi || 0), 0);
    const totalCard = filteredRecords.reduce((sum, record) => sum + (record.card || 0), 0);
    const totalCredit = filteredRecords.reduce((sum, record) => sum + (record.credit || 0), 0);
    const grandTotal = totalCash + totalUPI + totalCard + totalCredit;
    return { totalCash, totalUPI, totalCard, totalCredit, grandTotal };
  };

  const { totalCash, totalUPI, totalCard, totalCredit, grandTotal } = calculateTotals();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = (id) => {
    navigate("/daily-collection-form", { state: { id } }); // Adjust route as needed
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
      setCollectionRecords(collectionRecords.filter((record) => record?.id !== id));
      setFilteredRecords(filteredRecords.filter((record) => record?.id !== id));
      Swal.fire("Deleted!", "Collection record has been deleted.", "success");
    }
  };

  const handleExcelDownload = () => {
    setDownloading(true);
    try {
      // Prepare data for Excel
      const worksheetData = [
        ...filteredRecords.map((record) => ({
          "Sr.No": record.id,
          Date: record.date,
          Cash: `₹${parseFloat(record.cash).toFixed(2)}`,
          UPI: `₹${parseFloat(record.upi).toFixed(2)}`,
          Card: `₹${parseFloat(record.card).toFixed(2)}`,
          Credit: `₹${parseFloat(record.credit).toFixed(2)}`,
          Total: `₹${parseFloat(record.total).toFixed(2)}`,
        })),
        // Summary row
        {
          "Sr.No": "",
          Date: "Total",
          Cash: `₹${parseFloat(totalCash).toFixed(2)}`,
          UPI: `₹${parseFloat(totalUPI).toFixed(2)}`,
          Card: `₹${parseFloat(totalCard).toFixed(2)}`,
          Credit: `₹${parseFloat(totalCredit).toFixed(2)}`,
          Total: `₹${parseFloat(grandTotal).toFixed(2)}`,
        },
      ];

      // Create worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Daily Collection");

      // Download Excel file
      XLSX.writeFile(workbook, "Daily_Collection_Report.xlsx");
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

  document.title = "Daily Collection Report";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Financial Management" breadcrumbItem="Daily Collection Report" />

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
                      Daily Collection Report
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
                        <Label for="minCash">Min Cash</Label>
                        <Input
                          type="number"
                          name="minCash"
                          id="minCash"
                          placeholder="Enter Min Cash"
                          value={filters.minCash}
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
                        <Label for="maxCash">Max Cash</Label>
                        <Input
                          type="number"
                          name="maxCash"
                          id="maxCash"
                          placeholder="Enter Max Cash"
                          value={filters.maxCash}
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
                        <Label for="minUPI">Min UPI</Label>
                        <Input
                          type="number"
                          name="minUPI"
                          id="minUPI"
                          placeholder="Enter Min UPI"
                          value={filters.minUPI}
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
                        <Label for="maxUPI">Max UPI</Label>
                        <Input
                          type="number"
                          name="maxUPI"
                          id="maxUPI"
                          placeholder="Enter Max UPI"
                          value={filters.maxUPI}
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
                        <Label for="minCard">Min Card</Label>
                        <Input
                          type="number"
                          name="minCard"
                          id="minCard"
                          placeholder="Enter Min Card"
                          value={filters.minCard}
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
                        <Label for="maxCard">Max Card</Label>
                        <Input
                          type="number"
                          name="maxCard"
                          id="maxCard"
                          placeholder="Enter Max Card"
                          value={filters.maxCard}
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
                        <Label for="minCredit">Min Credit</Label>
                        <Input
                          type="number"
                          name="minCredit"
                          id="minCredit"
                          placeholder="Enter Min Credit"
                          value={filters.minCredit}
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
                        <Label for="maxCredit">Max Credit</Label>
                        <Input
                          type="number"
                          name="maxCredit"
                          id="maxCredit"
                          placeholder="Enter Max Credit"
                          value={filters.maxCredit}
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
                      <div className="text-center py-4">No collection records found.</div>
                    ) : (
                      <Table className="table table-striped table-hover align-middle" responsive>
                        <thead style={{ background: "linear-gradient(90deg, #007bff, #00c4cc)", color: "#fff" }}>
                          <tr>
                            <th>Sr.No</th>
                            <th>Date</th>
                            <th>Cash</th>
                            <th>UPI</th>
                            <th>Card</th>
                            <th>Credit</th>
                            <th>Total</th>
                          
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRecords.map((record, index) => (
                            <tr key={record?.id}>
                              <td>{index + 1}</td>
                              <td>{record?.date}</td>
                              <td>₹{formatNumber(record?.cash)}</td>
                              <td>₹{formatNumber(record?.upi)}</td>
                              <td>₹{formatNumber(record?.card)}</td>
                              <td>₹{formatNumber(record?.credit)}</td>
                              <td>₹{formatNumber(record?.total)}</td>
                              
                            </tr>
                          ))}
                          {/* Summary Row */}
                          <tr style={{ fontWeight: "bold", backgroundColor: "#e9ecef" }}>
                            <td colSpan={2}>Total</td>
                            <td>₹{formatNumber(totalCash)}</td>
                            <td>₹{formatNumber(totalUPI)}</td>
                            <td>₹{formatNumber(totalCard)}</td>
                            <td>₹{formatNumber(totalCredit)}</td>
                            <td>₹{formatNumber(grandTotal)}</td>
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

export default DailyCollectionReport;