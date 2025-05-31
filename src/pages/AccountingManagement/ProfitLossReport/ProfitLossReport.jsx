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

const ProfitLossReport = () => {
  const navigate = useNavigate();
  const [plRecords, setPLRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filters, setFilters] = useState({
    income: "",
    expenses: "",
  });
  const [downloading, setDownloading] = useState(false);

  // Static data for profit and loss records
  const staticData = [
    {
      id: 1,
      income: "Product Sales",
      income_amount: 50000,
      expenses: "Raw Materials",
      expenses_amount: 20000,
    },
    {
      id: 2,
      income: "Service Fees",
      income_amount: 30000,
      expenses: "Salaries",
      expenses_amount: 25000,
    },
    {
      id: 3,
      income: "Consulting Revenue",
      income_amount: 20000,
      expenses: "Utilities",
      expenses_amount: 5000,
    },
  ];

  // Initialize records on component mount
  useEffect(() => {
    setPLRecords(staticData);
    setFilteredRecords(staticData);
  }, []);

  // Handle filtering based on income and expenses categories
  useEffect(() => {
    const { income, expenses } = filters;
    let filtered = [...plRecords];

    // Income filter
    if (income) {
      filtered = filtered.filter((record) =>
        record?.income?.toLowerCase()?.includes(income.toLowerCase())
      );
    }

    // Expenses filter
    if (expenses) {
      filtered = filtered.filter((record) =>
        record?.expenses?.toLowerCase()?.includes(expenses.toLowerCase())
      );
    }

    setFilteredRecords(filtered);
  }, [filters, plRecords]);

  // Calculate totals for summary row
  const calculateTotals = () => {
    const totalIncome = filteredRecords.reduce((sum, record) => sum + (record.income_amount || 0), 0);
    const totalExpenses = filteredRecords.reduce((sum, record) => sum + (record.expenses_amount || 0), 0);
    const netProfitLoss = totalIncome - totalExpenses;
    return { totalIncome, totalExpenses, netProfitLoss };
  };

  const { totalIncome, totalExpenses, netProfitLoss } = calculateTotals();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = (id) => {
    navigate("/profit-loss-form", { state: { id } }); // Adjust route as needed
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
      setPLRecords(plRecords.filter((record) => record?.id !== id));
      setFilteredRecords(filteredRecords.filter((record) => record?.id !== id));
      Swal.fire("Deleted!", "Profit and loss record has been deleted.", "success");
    }
  };

  const handleExcelDownload = () => {
    setDownloading(true);
    try {
      // Prepare data for Excel
      const worksheetData = [
        ...filteredRecords.map((record) => ({
          "Sr.No": record.id,
          Income: record.income,
          "Income Amount": `₹${parseFloat(record.income_amount).toFixed(2)}`,
          Expenses: record.expenses,
          "Expenses Amount": `₹${parseFloat(record.expenses_amount).toFixed(2)}`,
        })),
        // Summary row
        {
          "Sr.No": "",
          Income: "Total Income",
          "Income Amount": `₹${parseFloat(totalIncome).toFixed(2)}`,
          Expenses: "Total Expenses",
          "Expenses Amount": `₹${parseFloat(totalExpenses).toFixed(2)}`,
        },
        {
          "Sr.No": "",
          Income: "Net Profit/Loss",
          "Income Amount": `₹${parseFloat(netProfitLoss).toFixed(2)}`,
          Expenses: "",
          "Expenses Amount": "",
        },
      ];

      // Create worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Profit and Loss");

      // Download Excel file
      XLSX.writeFile(workbook, "Profit_Loss_Report.xlsx");
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

  document.title = "Profit and Loss Report";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Financial Management" breadcrumbItem="Profit and Loss Report" />

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
                      Profit and Loss Report
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
                        <Label for="income">Income Category</Label>
                        <Input
                          type="text"
                          name="income"
                          id="income"
                          placeholder="Enter Income Category"
                          value={filters.income}
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
                        <Label for="expenses">Expenses Category</Label>
                        <Input
                          type="text"
                          name="expenses"
                          id="expenses"
                          placeholder="Enter Expenses Category"
                          value={filters.expenses}
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
                      <div className="text-center py-4">No profit and loss records found.</div>
                    ) : (
                      <Table className="table table-striped table-hover align-middle" responsive>
                        <thead style={{ background: "linear-gradient(90deg, #007bff, #00c4cc)", color: "#fff" }}>
                          <tr>
                            <th>Sr.No</th>
                            <th>Income</th>
                            <th>Income Amount</th>
                            <th>Expenses</th>
                            <th>Expenses Amount</th>
                          
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRecords.map((record, index) => (
                            <tr key={record?.id}>
                              <td>{index + 1}</td>
                              <td>{record?.income}</td>
                              <td>₹{formatNumber(record?.income_amount)}</td>
                              <td>{record?.expenses}</td>
                              <td>₹{formatNumber(record?.expenses_amount)}</td>
                             
                            </tr>
                          ))}
                          {/* Summary Row */}
                          <tr style={{ fontWeight: "bold", backgroundColor: "#e9ecef" }}>
                            <td colSpan={2}>Total Income</td>
                            <td>₹{formatNumber(totalIncome)}</td>
                            <td>Total Expenses</td>
                            <td>₹{formatNumber(totalExpenses)}</td>
                            <td></td>
                          </tr>
                          <tr style={{ fontWeight: "bold", backgroundColor: netProfitLoss >= 0 ? "#d4edda" : "#f8d7da" }}>
                            <td colSpan={2}>Net {netProfitLoss >= 0 ? "Profit" : "Loss"}</td>
                            <td colSpan={3}>₹{formatNumber(Math.abs(netProfitLoss))}</td>
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

export default ProfitLossReport;