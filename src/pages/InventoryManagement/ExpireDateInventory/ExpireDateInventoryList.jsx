import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import { FaBox, FaCubes, FaFileExcel } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { getExpireManagementInventory } from "../../../ApiService/InventoryManagement/ExpireManagementInventory";

Chart.register(...registerables);

const ExpireDateInventoryList = () => {
  const navigate = useNavigate();
  const [expiryItems, setExpiryItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getExpireManagementInventory();
        console.log(data);
        const mappedData = data.map((item, index) => ({
          id: index + 1,
          drugName: item?.drug_name ?? "N/A",
          batchNumber: item?.batch_no ?? "N/A",
          expiryDate: item?.expire_date ?? "N/A",
          returnBy: item?.return_by ?? "N/A",
          supplierName: item?.supplier_name ?? "Unknown",
          reorderLevelDays: item?.reorder_level_days ?? 0,
        }));
        setExpiryItems(mappedData);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch inventory data.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateDaysToExpiry = (expiryDate) => {
    const today = new Date();
    const expDate = new Date(expiryDate);
    const diffTime = expDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateSummary = () => {
    const totalItems = expiryItems.length;
    const highReorderItems = expiryItems.filter(
      (item) => (item?.reorderLevelDays ?? 0) > 30
    ).length;
    const totalReorderDays = expiryItems.reduce(
      (sum, item) => sum + (item?.reorderLevelDays ?? 0),
      0
    );
    const uniqueSuppliers = [
      ...new Set(expiryItems.map((item) => item?.supplierName)),
    ].length;
    return { totalItems, highReorderItems, totalReorderDays, uniqueSuppliers };
  };

  const summary = calculateSummary();

  const prepareChartData = () => {
    const daysToExpiryData = {
      labels: expiryItems.map((item) => item?.drugName ?? "Unknown"),
      datasets: [
        {
          label: "Days to Expiry",
          data: expiryItems.map((item) =>
            calculateDaysToExpiry(item?.expiryDate)
          ),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };

    const supplierDistributionData = {
      labels: [...new Set(expiryItems.map((item) => item?.supplierName))],
      datasets: [
        {
          label: "Items by Supplier",
          data: [...new Set(expiryItems.map((item) => item?.supplierName))].map(
            (supplier) =>
              expiryItems.filter((item) => item?.supplierName === supplier)
                .length
          ),
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    return { daysToExpiryData, supplierDistributionData };
  };

  const chartData = prepareChartData();

  const filteredItems = expiryItems.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item?.drugName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      item?.supplierName?.toLowerCase()?.includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleExcelDownload = () => {
    const headers = [
      "Sr.No",
      "Drug Name",
      "Batch Number",
      "Expiry Date",
      "Return By",
      "Supplier Name",
      "Reorder Level Days",
    ];

    const rows = filteredItems.map((item, index) => [
      index + 1,
      item?.drugName ?? "Unknown",
      item?.batchNumber ?? "N/A",
      item?.expiryDate ?? "N/A",
      item?.returnBy ?? "N/A",
      item?.supplierName ?? "Unknown",
      item?.reorderLevelDays ?? 0,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "expiry_inventory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setSearchTerm("");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Inventory"
            breadcrumbItem="Expiry Date Inventory List"
          />

          {/* Filter Section */}
          <Row className="mb-4">
            <Col xs="12">
              <Card
                className="shadow-lg"
                style={{ borderRadius: "20px", background: "#f8f9fa" }}
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
                      Filters
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
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
                        <FaFileExcel style={{ fontSize: "18px" }} /> Download
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
                  <Form className="d-flex flex-wrap gap-3">
                    <FormGroup>
                      <Label>Search</Label>
                      <Input
                        type="text"
                        placeholder="Search by Drug or Supplier"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-3d"
                      />
                    </FormGroup>
                    <Button
                      color="primary"
                      onClick={resetFilters}
                      style={{
                        height: "38px",
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
                      Reset
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Dashboard Section */}
          <Row className="mb-4">
            <Col md="3">
              <Card className="shadow-lg stylish-card income-card">
                <CardBody>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <FaBox size={30} className="text-white" />
                    </div>
                    <div>
                      <h6 className="text-light mb-1">Total Items</h6>
                      <h4 className="text-white mb-0">{summary.totalItems}</h4>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md="3">
              <Card className="shadow-lg stylish-card tax-card">
                <CardBody>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <FaCubes size={30} className="text-white" />
                    </div>
                    <div>
                      <h6 className="text-light mb-1">High Reorder Items</h6>
                      <h4 className="text-white mb-0">
                        {summary.highReorderItems}
                      </h4>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md="3">
              <Card className="shadow-lg stylish-card profit-card">
                <CardBody>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <FaCubes size={30} className="text-white" />
                    </div>
                    <div>
                      <h6 className="text-light mb-1">Total Reorder Days</h6>
                      <h4 className="text-white mb-0">
                        {summary.totalReorderDays}
                      </h4>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md="3">
              <Card className="shadow-lg stylish-card expense-card">
                <CardBody>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <FaBox size={30} className="text-white" />
                    </div>
                    <div>
                      <h6 className="text-light mb-1">Unique Suppliers</h6>
                      <h4 className="text-white mb-0">
                        {summary.uniqueSuppliers}
                      </h4>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Graphs Section */}
          <Row className="mb-4">
            <Col md="6">
              <Card className="shadow-lg stylish-card">
                <CardBody>
                  <h5 className="gradient-text">Days to Expiry by Drug</h5>
                  <div style={{ height: "250px" }}>
                    <Bar
                      data={chartData.daysToExpiryData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md="6">
              <Card className="shadow-lg stylish-card">
                <CardBody>
                  <h5 className="gradient-text">Items by Supplier</h5>
                  <div style={{ height: "250px" }}>
                    <Pie
                      data={chartData.supplierDistributionData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Table Section */}
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
                  <h4
                    className="text-primary mb-4"
                    style={{
                      fontWeight: "700",
                      letterSpacing: "1px",
                      background: "linear-gradient(90deg, #007bff, #00c4cc)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Expiry Date Inventory List
                  </h4>
                  <div className="table-container">
                    {filteredItems.length === 0 ? (
                      <div className="text-center py-4 text-muted">
                        No Expiry Date Inventory items .
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
                            <th>Drug Name</th>
                            <th>Batch Number</th>
                            <th>Expiry Date</th>
                            <th>Return By</th>
                            <th>Supplier Name</th>
                            <th>Reorder Level Days</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredItems.map((item, index) => (
                            <tr key={item?.id ?? `item-${index}`}>
                              <td>{index + 1}</td>
                              <td>{item?.drugName ?? "N/A"}</td>
                              <td>{item?.batchNumber ?? "N/A"}</td>
                              <td>{item?.expiryDate ?? "N/A"}</td>
                              <td>{item?.returnBy ?? "N/A"}</td>
                              <td>{item?.supplierName ?? "N/A"}</td>
                              <td>{item?.reorderLevelDays ?? 0}</td>
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
        .stylish-card {
          border: none;
          border-radius: 15px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          overflow: hidden;
        }
        .income-card {
          background: linear-gradient(135deg, #4bc0c0, #36a2eb);
        }
        .expense-card {
          background: linear-gradient(135deg, #ff6384, #ff9966);
        }
        .tax-card {
          background: linear-gradient(135deg, #ffcd56, #ff9f40);
        }
        .profit-card {
          background: linear-gradient(135deg, #9966ff, #5b6abf);
        }
        .stylish-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
        .gradient-text {
          background: linear-gradient(90deg, #007bff, #00c4cc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 600;
        }
        .hover-scale:hover {
          transform: scale(1.1) !important;
        }
        .table-container {
          max-height: 600px;
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
        .input-3d {
          border: none;
          border-radius: 8px;
          padding: 10px;
          background: #fff;
          box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.1),
            inset -2px -2px 5px rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
        }
        .input-3d:focus {
          box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.2),
            inset -1px -1px 3px rgba(255, 255, 255, 0.9);
          outline: none;
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

const Breadcrumbs = ({ title, breadcrumbItem }) => (
  <div className="page-title-box">
    <h4>{breadcrumbItem}</h4>
    <div>{title}</div>
  </div>
);

export default ExpireDateInventoryList;
