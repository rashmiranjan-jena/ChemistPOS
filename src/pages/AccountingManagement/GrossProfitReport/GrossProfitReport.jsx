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

const GrossProfitReport = () => {
  const navigate = useNavigate();
  const [profitRecords, setProfitRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filters, setFilters] = useState({
    item: "",
    minSales: "",
    maxSales: "",
    minPurchase: "",
    maxPurchase: "",
  });
  const [downloading, setDownloading] = useState(false);

  // Static data for gross profit records
  const staticData = [
    {
      id: 1,
      item: "Paracetamol",
      sales_amount: 7000,
      purchase_amount: 5000,
      gross_profit: 2000, // sales_amount - purchase_amount
      gp_percent: 28.57, // (gross_profit / sales_amount) * 100
    },
    {
      id: 2,
      item: "Amoxicillin",
      sales_amount: 15000,
      purchase_amount: 10000,
      gross_profit: 5000, // sales_amount - purchase_amount
      gp_percent: 33.33, // (gross_profit / sales_amount) * 100
    },
    {
      id: 3,
      item: "Ibuprofen",
      sales_amount: 10000,
      purchase_amount: 8000,
      gross_profit: 2000, // sales_amount - purchase_amount
      gp_percent: 20.0, // (gross_profit / sales_amount) * 100
    },
  ];

  // Initialize records on component mount
  useEffect(() => {
    setProfitRecords(staticData);
    setFilteredRecords(staticData);
  }, []);

  // Handle filtering based on item, sales amount range, and purchase amount range
  useEffect(() => {
    const { item, minSales, maxSales, minPurchase, maxPurchase } = filters;
    let filtered = [...profitRecords];

    // Item filter
    if (item) {
      filtered = filtered.filter((record) =>
        record?.item?.toLowerCase()?.includes(item.toLowerCase())
      );
    }

    // Sales amount range filter
    if (minSales || maxSales) {
      filtered = filtered.filter((record) => {
        const sales = parseFloat(record.sales_amount);
        const min = minSales ? parseFloat(minSales) : -Infinity;
        const max = maxSales ? parseFloat(maxSales) : Infinity;
        return sales >= min && sales <= max;
      });
    }

    // Purchase amount range filter
    if (minPurchase || maxPurchase) {
      filtered = filtered.filter((record) => {
        const purchase = parseFloat(record.purchase_amount);
        const min = minPurchase ? parseFloat(minPurchase) : -Infinity;
        const max = maxPurchase ? parseFloat(maxPurchase) : Infinity;
        return purchase >= min && purchase <= max;
      });
    }

    setFilteredRecords(filtered);
  }, [filters, profitRecords]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = (id) => {
    navigate("/gross-profit-form", { state: { id } }); // Adjust route as needed
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
      setProfitRecords(profitRecords.filter((record) => record?.id !== id));
      setFilteredRecords(filteredRecords.filter((record) => record?.id !== id));
      Swal.fire("Deleted!", "Profit record has been deleted.", "success");
    }
  };

  const handleExcelDownload = () => {
    setDownloading(true);
    try {
      // Prepare data for Excel
      const worksheetData = filteredRecords.map((record) => ({
        "Sr.No": record.id,
        Item: record.item,
        "Sales Amount": `₹${parseFloat(record.sales_amount).toFixed(2)}`,
        "Purchase Amount": `₹${parseFloat(record.purchase_amount).toFixed(2)}`,
        "Gross Profit": `₹${parseFloat(record.gross_profit).toFixed(2)}`,
        "GP %": `${parseFloat(record.gp_percent).toFixed(2)}%`,
      }));

      // Create worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Gross Profit");

      // Download Excel file
      XLSX.writeFile(workbook, "Gross_Profit_Report.xlsx");
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

  document.title = "Gross Profit Report";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Financial Management" breadcrumbItem="Gross Profit Report" />

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
                      Gross Profit Report
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
                        <Label for="item">Item</Label>
                        <Input
                          type="text"
                          name="item"
                          id="item"
                          placeholder="Enter Item"
                          value={filters.item}
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
                        <Label for="minSales">Min Sales Amount</Label>
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
                        <Label for="maxSales">Max Sales Amount</Label>
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
                    <Col md="4">
                      <FormGroup>
                        <Label for="minPurchase">Min Purchase Amount</Label>
                        <Input
                          type="number"
                          name="minPurchase"
                          id="minPurchase"
                          placeholder="Enter Min Purchase"
                          value={filters.minPurchase}
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
                        <Label for="maxPurchase">Max Purchase Amount</Label>
                        <Input
                          type="number"
                          name="maxPurchase"
                          id="maxPurchase"
                          placeholder="Enter Max Purchase"
                          value={filters.maxPurchase}
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
                      <div className="text-center py-4">No profit records found.</div>
                    ) : (
                      <Table className="table table-striped table-hover align-middle" responsive>
                        <thead style={{ background: "linear-gradient(90deg, #007bff, #00c4cc)", color: "#fff" }}>
                          <tr>
                            <th>Sr.No</th>
                            <th>Item</th>
                            <th>Sales Amount</th>
                            <th>Purchase Amount</th>
                            <th>Gross Profit</th>
                            <th>GP %</th>
                           
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRecords.map((record, index) => (
                            <tr key={record?.id}>
                              <td>{index + 1}</td>
                              <td>{record?.item}</td>
                              <td>₹{formatNumber(record?.sales_amount)}</td>
                              <td>₹{formatNumber(record?.purchase_amount)}</td>
                              <td>₹{formatNumber(record?.gross_profit)}</td>
                              <td>{formatNumber(record?.gp_percent)}%</td>
                             
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

export default GrossProfitReport;