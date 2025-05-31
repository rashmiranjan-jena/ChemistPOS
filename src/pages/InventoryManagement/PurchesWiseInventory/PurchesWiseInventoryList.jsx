import React, { useState, useEffect, useMemo } from "react";
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
import { FaFileExcel, FaBox, FaMoneyBillWave, FaTag } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import { fetchInventory } from "../../../ApiService/InventoryManagement/PurchesInventory";

const PurchesWiseInventoryList = () => {
  const navigate = useNavigate();
  const [inventoryItems, setInventoryItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchInventory(currentPage, pageSize);
        const transformedItems =
          response?.data?.map((item) => ({
            id: item?.id,
            productName: item?.drug_id?.drug_name || "N/A",
            productId: item?.drug_id?.drug_id || 0,
            category: item?.drug_id?.drug_type_name || "N/A",
            brand: item?.drug_id?.brand_name || "N/A",
            freedrug: item?.free_drug || 0,
            manufacturer: item?.drug_id?.manufacturer_name || "N/A",
            batchNumber: item?.batch_no || "N/A",
            expiryDate: item?.expire_date || "N/A",
            purchaseCost: parseFloat(item?.rate) || 0,
            mrp: parseFloat(item?.mrp) || 0,
            drugForm: item?.drug_id?.drug_form_name || "N/A",
            quantity: Number(item?.quantity) || 0,
            totalPurchaseCost: parseFloat(item?.purchase_amount) || 0,
            totalMrp:
              (parseFloat(item?.mrp) || 0) * (Number(item?.quantity) || 0),
            barcode: item?.batch_no || "N/A",
          })) || [];
        setInventoryItems(transformedItems);
        setTotalCount(response?.total_items || 0);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setError("Failed to load inventory data. Please try again later.");
        setInventoryItems([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, [currentPage]);

  const calculateSummary = () => {
    const totalItems = totalCount;
    const totalPurchaseCost = inventoryItems?.reduce(
      (sum, item) => sum + (item?.totalPurchaseCost || 0),
      0
    );
    const totalMrp = inventoryItems?.reduce(
      (sum, item) => sum + (item?.totalMrp || 0),
      0
    );
    return {
      totalItems,
      totalPurchaseCost,
      totalMrp,
    };
  };

  const summary = calculateSummary();

  const prepareChartData = () => {
    const costComparisonData = {
      labels: ["Total Purchase Cost", "Total MRP"],
      datasets: [
        {
          label: "Amount (₹)",
          data: [summary?.totalPurchaseCost || 0, summary?.totalMrp || 0],
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
          ],
          borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
          borderWidth: 1,
        },
      ],
    };

    const uniqueCategories = [
      ...new Set(inventoryItems?.map((item) => item?.category)),
    ];
    const categoryCostData = {
      labels: uniqueCategories?.length > 0 ? uniqueCategories : ["No Data"],
      datasets: [
        {
          label: "Total Purchase Amount by Category",
          data:
            uniqueCategories?.length > 0
              ? uniqueCategories?.map((cat) =>
                  inventoryItems
                    ?.filter((item) => item?.category === cat)
                    ?.reduce(
                      (sum, item) => sum + (item?.totalPurchaseCost || 0),
                      0
                    )
                )
              : [0],
          backgroundColor:
            uniqueCategories?.length > 0
              ? uniqueCategories?.map(
                  () =>
                    `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                      Math.random() * 255
                    )}, ${Math.floor(Math.random() * 255)}, 0.6)`
                )
              : ["rgba(200, 200, 200, 0.6)"],
          borderColor:
            uniqueCategories?.length > 0
              ? uniqueCategories?.map(
                  () =>
                    `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                      Math.random() * 255
                    )}, ${Math.floor(Math.random() * 255)}, 1)`
                )
              : ["rgba(200, 200, 200, 1)"],
          borderWidth: 1,
        },
      ],
    };

    return { costComparisonData, categoryCostData };
  };

  const chartData = prepareChartData();

  const filteredItems = useMemo(() => {
    return (
      inventoryItems?.filter((item) => {
        const matchesSearch =
          searchTerm === "" ||
          item?.productName
            ?.toLowerCase()
            ?.includes(searchTerm?.toLowerCase()) ||
          String(item?.productId)
            ?.toLowerCase()
            ?.includes(searchTerm?.toLowerCase());
        const matchesCategory =
          filterCategory === "All" || item?.category === filterCategory;
        return matchesSearch && matchesCategory;
      }) || []
    );
  }, [inventoryItems, searchTerm, filterCategory]);

  const categories = [
    "All",
    ...new Set(inventoryItems?.map((item) => item?.category)),
  ];

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleBack = () => {
    navigate(-1);
  };

  const handleExcelDownload = () => {
    const headers = [
      "Sr.No",
      "Product Name",
      "Product ID",
      "Category",
      "Brand",
      "Manufacturer",
      "Batch Number",
      "Expiry Date",
      "Purchase Cost",
      "MRP",
      "Drug Form",
      "Quantity",
      "Total Purchase Cost",
      "Total MRP",
      "Barcode",
    ];
    const rows =
      filteredItems?.map((item, index) => [
        index + 1,
        item?.productName,
        item?.productId,
        item?.category,
        item?.brand,
        item?.manufacturer,
        item?.batchNumber,
        item?.expiryDate,
        item?.purchaseCost?.toFixed(2),
        item?.mrp?.toFixed(2),
        item?.drugForm,
        item?.quantity,
        item?.totalPurchaseCost?.toFixed(2),
        item?.totalMrp?.toFixed(2),
        item?.barcode,
      ]) || [];
    const csvContent = [
      headers?.join(","),
      ...rows?.map((row) => row?.join(",")),
    ]?.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "inventory_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterCategory("All");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Inventory"
            breadcrumbItem="Purchase Inventory List"
          />
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <p>Loading inventory data...</p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Inventory"
            breadcrumbItem="Purchase Inventory List"
          />
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <p className="text-danger">{error}</p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Inventory"
            breadcrumbItem="Purchase Inventory List"
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
                        placeholder="Search by Product Name or ID"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e?.target?.value)}
                        className="input-3d"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Category</Label>
                      <Input
                        type="select"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e?.target?.value)}
                        className="input-3d"
                      >
                        {categories?.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </Input>
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
            <Col md="4">
              <Card className="shadow-lg stylish-card income-card">
                <CardBody>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <FaBox size={30} className="text-white" />
                    </div>
                    <div>
                      <h6 className="text-light mb-1">Total Items</h6>
                      <h4 className="text-white mb-0">{summary?.totalItems}</h4>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md="4">
              <Card className="shadow-lg stylish-card expense-card">
                <CardBody>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <FaMoneyBillWave size={30} className="text-white" />
                    </div>
                    <div>
                      <h6 className="text-light mb-1">Total Purchase Cost</h6>
                      <h4 className="text-white mb-0">
                        ₹{summary?.totalPurchaseCost?.toFixed(2)}
                      </h4>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md="4">
              <Card className="shadow-lg stylish-card tax-card">
                <CardBody>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <FaTag size={30} className="text-white" />
                    </div>
                    <div>
                      <h6 className="text-light mb-1">Total MRP</h6>
                      <h4 className="text-white mb-0">
                        ₹{summary?.totalMrp?.toFixed(2)}
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
                  <h5 className="gradient-text">Cost Comparison</h5>
                  <div style={{ height: "250px" }}>
                    <Bar
                      data={chartData?.costComparisonData}
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
                  <h5 className="gradient-text">Purchase Amount by Category</h5>
                  <div style={{ height: "250px" }}>
                    <Pie
                      data={chartData?.categoryCostData}
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
                    Purchase Inventory List
                  </h4>
                  <div className="table-container">
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
                          <th>Product Name</th>
                          <th>Product ID</th>
                          <th>Category</th>
                          <th>Brand</th>
                          <th>Manufacturer</th>
                          <th>Free Drug</th>
                          <th>Batch Number</th>
                          <th>Expiry Date</th>
                          <th>Purchase Cost</th>
                          <th>MRP</th>
                          <th>Drug Form</th>
                          <th>Quantity</th>
                          <th>Total Purchase Cost</th>
                          <th>Total MRP</th>
                          <th>Barcode</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredItems?.length > 0 ? (
                          filteredItems?.map((item, index) => (
                            <tr key={item?.id}>
                              <td>
                                {(currentPage - 1) * pageSize + index + 1}
                              </td>
                              <td>{item?.productName}</td>
                              <td>{item?.productId}</td>
                              <td>{item?.category}</td>
                              <td>{item?.brand}</td>
                              <td>{item?.manufacturer}</td>
                              <td>{item?.freedrug}</td>
                              <td>{item?.batchNumber}</td>
                              <td>{item?.expiryDate}</td>
                              <td>₹{item?.purchaseCost?.toFixed(2)}</td>
                              <td>₹{item?.mrp?.toFixed(2)}</td>
                              <td>{item?.drugForm}</td>
                              <td>{item?.quantity}</td>
                              <td>₹{item?.totalPurchaseCost?.toFixed(2)}</td>
                              <td>₹{item?.totalMrp?.toFixed(2)}</td>
                              <td>{item?.barcode}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="16" className="text-center">
                              No inventory items found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>

                  {/* Custom Pagination */}
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      Showing {(currentPage - 1) * pageSize + 1} to{" "}
                      {Math.min(currentPage * pageSize, totalCount)} of{" "}
                      {totalCount} drugs
                    </div>
                    <div className="d-flex gap-2">
                      <Button
                        color="primary"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Previous
                      </Button>
                      <span className="align-self-center">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        color="primary"
                        disabled={
                          currentPage === totalPages || totalCount === 0
                        }
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        Next
                      </Button>
                    </div>
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
          borderradius: 15px;
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
          max-height: 400px;
          overflow-y: auto;
          overflow-x: auto;
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .table {
          margin-bottom: 0;
          width: 100%;
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
          .table-container {
            overflow-x: auto;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default PurchesWiseInventoryList;
