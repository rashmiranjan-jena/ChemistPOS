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

const SupplierLedger = () => {
  const navigate = useNavigate();
  const [ledgerRecords, setLedgerRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    invoice: "",
    description: "",
  });
  const [downloading, setDownloading] = useState(false);

  // Static data for supplier ledger records
  const staticData = [
    {
      id: 1,
      date: "2025-04-01",
      invoice: "PINV001",
      description: "Purchase of Laptops",
      debit: 295000,
      credit: 0,
      balance: 295000, // debit - credit
      credit_days: 30,
      overdue_amounts: 0,
      return_adjustments: 0,
    },
    {
      id: 2,
      date: "2025-04-05",
      invoice: "PINV002",
      description: "Payment to Supplier",
      debit: 0,
      credit: 100000,
      balance: 195000, // previous balance + debit - credit
      credit_days: 0,
      overdue_amounts: 0,
      return_adjustments: 0,
    },
    {
      id: 3,
      date: "2025-04-10",
      invoice: "PINV003",
      description: "Return of Defective Monitors",
      debit: 0,
      credit: 0,
      balance: 195000, // previous balance + debit - credit
      credit_days: 30,
      overdue_amounts: 50000, // overdue portion
      return_adjustments: -12000, // negative for returns
    },
  ];

  // Initialize records on component mount
  useEffect(() => {
    setLedgerRecords(staticData);
    setFilteredRecords(staticData);
  }, []);

  // Handle filtering based on date range, invoice, and description
  useEffect(() => {
    const { startDate, endDate, invoice, description } = filters;
    let filtered = [...ledgerRecords];

    // Date range filter
    if (startDate && endDate) {
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return recordDate >= start && recordDate <= end;
      });
    }

    // Invoice filter
    if (invoice) {
      filtered = filtered.filter((record) =>
        record?.invoice?.toLowerCase()?.includes(invoice.toLowerCase())
      );
    }

    // Description filter
    if (description) {
      filtered = filtered.filter((record) =>
        record?.description?.toLowerCase()?.includes(description.toLowerCase())
      );
    }

    setFilteredRecords(filtered);
  }, [filters, ledgerRecords]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = (id) => {
    navigate("/supplier-ledger-form", { state: { id } }); // Adjust route as needed
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
      setLedgerRecords(ledgerRecords.filter((record) => record?.id !== id));
      setFilteredRecords(filteredRecords.filter((record) => record?.id !== id));
      Swal.fire("Deleted!", "Ledger record has been deleted.", "success");
    }
  };

  const handleExcelDownload = () => {
    setDownloading(true);
    try {
      // Prepare data for Excel
      const worksheetData = filteredRecords.map((record) => ({
        "Sr.No": record.id,
        Date: record.date,
        Invoice: record.invoice,
        Description: record.description,
        Debit: `₹${parseFloat(record.debit).toFixed(2)}`,
        Credit: `₹${parseFloat(record.credit).toFixed(2)}`,
        Balance: `₹${parseFloat(record.balance).toFixed(2)}`,
        "Credit Days": record.credit_days,
        "Overdue Amounts": `₹${parseFloat(record.overdue_amounts).toFixed(2)}`,
        "Return Adjustments": `₹${parseFloat(record.return_adjustments).toFixed(2)}`,
      }));

      // Create worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Supplier Ledger");

      // Download Excel file
      XLSX.writeFile(workbook, "Supplier_Ledger_Report.xlsx");
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

  document.title = "Supplier Ledger";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Accounting Management" breadcrumbItem="Supplier Ledger" />

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
                      Supplier Ledger
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
                        <Label for="invoice">Invoice</Label>
                        <Input
                          type="text"
                          name="invoice"
                          id="invoice"
                          placeholder="Enter Invoice"
                          value={filters.invoice}
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
                        <Label for="description">Description</Label>
                        <Input
                          type="text"
                          name="description"
                          id="description"
                          placeholder="Enter Description"
                          value={filters.description}
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
                      <div className="text-center py-4">No ledger records found.</div>
                    ) : (
                      <Table className="table table-striped table-hover align-middle" responsive>
                        <thead style={{ background: "linear-gradient(90deg, #007bff, #00c4cc)", color: "#fff" }}>
                          <tr>
                            <th>Sr.No</th>
                            <th>Date</th>
                            <th>Invoice</th>
                            <th>Description</th>
                            <th>Debit</th>
                            <th>Credit</th>
                            <th>Balance</th>
                            <th>Credit Days</th>
                            <th>Overdue Amounts</th>
                            <th>Return Adjustments</th>
                       
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRecords.map((record, index) => (
                            <tr key={record?.id}>
                              <td>{index + 1}</td>
                              <td>{record?.date}</td>
                              <td>{record?.invoice}</td>
                              <td>{record?.description}</td>
                              <td>₹{formatNumber(record?.debit)}</td>
                              <td>₹{formatNumber(record?.credit)}</td>
                              <td>₹{formatNumber(record?.balance)}</td>
                              <td>{record?.credit_days}</td>
                              <td>₹{formatNumber(record?.overdue_amounts)}</td>
                              <td>₹{formatNumber(record?.return_adjustments)}</td>
                              
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

export default SupplierLedger;