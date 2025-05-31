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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import {
  FaBox,
  FaMoneyBillWave,
  FaDollarSign,
  FaUndo,
  FaEye,
  FaEdit,
  FaTrash,
  FaFileExcel,
  FaFilter,
} from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import { fetchInventory } from "../../../ApiService/InventoryManagement/PurchesInventory";

const TotalInventoryList = () => {
  const navigate = useNavigate();
  const [inventoryData, setInventoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterQuantityRange, setFilterQuantityRange] = useState("All");
  const [filterSupplier, setFilterSupplier] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchInventory(currentPage, pageSize);
        const transformedItems =
          response?.data?.map((item) => ({
            id: item?.id,
            purchaseDate: item?.expire_date
              ? item?.expire_date.split("T")[0]
              : "N/A",
            supplierName: item?.drug_id?.manufacturer_name || "N/A",
            products: [
              {
                productName: item?.drug_id?.drug_name || "N/A",
                productId: item?.drug_id?.drug_id || 0,
                category: item?.drug_id?.drug_type_name || "N/A",
                brand: item?.drug_id?.brand_name || "N/A",
                manufacturer: item?.drug_id?.manufacturer_name || "N/A",
                batchNumber: item?.batch_no || "N/A",
                expiryDate: item?.expire_date || "N/A",
                purchaseCost: parseFloat(item?.rate) || 0,
                mrp: parseFloat(item?.mrp) || 0,
                salesCost: parseFloat(item?.rate) || 0,
                drugForm: item?.drug_id?.drug_form_name || "N/A",
                quantity: Number(item?.quantity) || 0,
                pack: item?.drug_id?.drug_form_name || "N/A",
                totalPurchaseCost: parseFloat(item?.purchase_amount) || 0,
                totalMrp:
                  (parseFloat(item?.mrp) || 0) * (Number(item?.quantity) || 0),
                totalSalesCost:
                  (parseFloat(item?.rate) || 0) * (Number(item?.quantity) || 0),
              },
            ],
          })) || [];
        setInventoryData(transformedItems);
        setTotalCount(response?.total_items || 0);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setError("Failed to load inventory data. Please try again later.");
        setInventoryData([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, [currentPage, pageSize]);

  const uniqueSuppliers = useMemo(() => {
    const suppliers = [
      ...new Set(inventoryData.map((item) => item.supplierName)),
    ].filter((name) => name !== "N/A");
    return ["All", ...suppliers.sort()];
  }, [inventoryData]);

  const flattenedInventory = useMemo(() => {
    return inventoryData.flatMap((purchase) =>
      purchase.products.map((product) => ({
        ...product,
        purchaseDate: purchase.purchaseDate,
        supplierName: purchase.supplierName,
        purchaseId: purchase.id,
      }))
    );
  }, [inventoryData]);

  const calculateSummary = () => {
    const totalItems = flattenedInventory.length;
    const totalPurchase = flattenedInventory.reduce(
      (sum, item) => sum + (item.totalPurchaseCost || 0),
      0
    );
    const totalSell = flattenedInventory.reduce(
      (sum, item) => sum + (item.totalSalesCost || 0),
      0
    );
    const totalQuantity = flattenedInventory.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
    return { totalItems, totalPurchase, totalSell, totalQuantity };
  };

  const summary = calculateSummary();

  const prepareChartData = () => {
    const purchaseData = {
      labels: inventoryData.map((item) => item.supplierName),
      datasets: [
        {
          label: "Total Purchase (₹)",
          data: inventoryData.map((item) =>
            item.products.reduce(
              (sum, p) => sum + (p.totalPurchaseCost || 0),
              0
            )
          ),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };

    const quantityData = {
      labels: inventoryData.map((item) => item.supplierName),
      datasets: [
        {
          label: "Quantity Distribution",
          data: inventoryData.map((item) =>
            item.products.reduce((sum, p) => sum + (p.quantity || 0), 0)
          ),
          backgroundColor: inventoryData.map(
            () =>
              `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                Math.random() * 255
              )}, ${Math.floor(Math.random() * 255)}, 0.6)`
          ),
          borderColor: inventoryData.map(
            () =>
              `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                Math.random() * 255
              )}, ${Math.floor(Math.random() * 255)}, 1)`
          ),
          borderWidth: 1,
        },
      ],
    };

    return { purchaseData, quantityData };
  };

  const chartData = prepareChartData();

  const filteredItems = useMemo(() => {
    return flattenedInventory.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productId
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesQuantity =
        filterQuantityRange === "All" ||
        (filterQuantityRange === "0-50" && item.quantity <= 50) ||
        (filterQuantityRange === "51-100" &&
          item.quantity > 50 &&
          item.quantity <= 100) ||
        (filterQuantityRange === "100+" && item.quantity > 100);
      const matchesSupplier =
        filterSupplier === "All" || item.supplierName === filterSupplier;
      return matchesSearch && matchesQuantity && matchesSupplier;
    });
  }, [flattenedInventory, searchTerm, filterQuantityRange, filterSupplier]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleBack = () => navigate(-1);

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
      "Sales Cost",
      "Drug Form",
      "Quantity",
      "Pack",
      "Total Purchase Cost",
      "Total MRP",
      "Total Sales Cost",
      "Purchase Date",
      "Supplier Name",
    ];
    const rows = filteredItems.map((item, index) => [
      index + 1,
      item.productName,
      item.productId,
      item.category,
      item.brand,
      item.manufacturer,
      item.batchNumber,
      item.expiryDate,
      item.purchaseCost.toFixed(2),
      item.mrp.toFixed(2),
      item.salesCost.toFixed(2),
      item.drugForm,
      item.quantity,
      item.pack,
      item.totalPurchaseCost.toFixed(2),
      item.totalMrp.toFixed(2),
      item.totalSalesCost.toFixed(2),
      item.purchaseDate,
      item.supplierName,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "total_inventory_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterQuantityRange("All");
    setFilterSupplier("All");
    setCurrentPage(1);
  };

  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Inventory"
            breadcrumbItem="Total Inventory List"
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
            breadcrumbItem="Total Inventory List"
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
            breadcrumbItem="Total Inventory List"
          />

          {/* Filter Section */}
          <Row className="mb-4">
            <div className="d-flex justify-content-end">
              <div className="d-flex flex-wrap gap-2">
                <Button
                  color="primary"
                  onClick={toggleFilterModal}
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
                  <FaFilter style={{ fontSize: "18px" }} /> Filter
                </Button>
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
                  <i className="bx bx-undo" style={{ fontSize: "18px" }}></i>
                </Button>
              </div>
            </div>
          </Row>

          {/* Filter Modal */}
          <Modal isOpen={isFilterModalOpen} toggle={toggleFilterModal} centered>
            <ModalHeader toggle={toggleFilterModal}>Apply Filters</ModalHeader>
            <ModalBody>
              <Form className="d-flex flex-column gap-3">
                <FormGroup>
                  <Label>Search</Label>
                  <Input
                    type="text"
                    placeholder="Search by Product, ID, or Supplier"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-3d"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Quantity Range</Label>
                  <Input
                    type="select"
                    value={filterQuantityRange}
                    onChange={(e) => setFilterQuantityRange(e.target.value)}
                    className="input-3d"
                  >
                    <option value="All">All</option>
                    <option value="0-50">0 - 50</option>
                    <option value="51-100">51 - 100</option>
                    <option value="100+">100+</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>Supplier</Label>
                  <Input
                    type="select"
                    value={filterSupplier}
                    onChange={(e) => setFilterSupplier(e.target.value)}
                    className="input-3d"
                  >
                    {uniqueSuppliers.map((supplier) => (
                      <option key={supplier} value={supplier}>
                        {supplier}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={resetFilters}
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                }}
              >
                Reset
              </Button>
              <Button
                color="primary"
                onClick={toggleFilterModal}
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                }}
              >
                Apply
              </Button>
            </ModalFooter>
          </Modal>

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
              <Card className="shadow-lg stylish-card expense-card">
                <CardBody>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <FaMoneyBillWave size={30} className="text-white" />
                    </div>
                    <div>
                      <h6 className="text-light mb-1">Total Purchase</h6>
                      <h4 className="text-white mb-0">
                        ₹{summary.totalPurchase.toFixed(2)}
                      </h4>
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
                      <FaDollarSign size={30} className="text-white" />
                    </div>
                    <div>
                      <h6 className="text-light mb-1">Total Sell</h6>
                      <h4 className="text-white mb-0">
                        ₹{summary.totalSell.toFixed(2)}
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
                      <FaBox size={30} className="text-white" />
                    </div>
                    <div>
                      <h6 className="text-light mb-1">Total Quantity</h6>
                      <h4 className="text-white mb-0">
                        {summary.totalQuantity}
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
                  <h5 className="gradient-text">Total Purchase by Manufacturer</h5>
                  <div style={{ height: "250px" }}>
                    <Bar
                      data={chartData.purchaseData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: { y: { beginAtZero: true } },
                      }}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md="6">
              <Card className="shadow-lg stylish-card">
                <CardBody>
                  <h5 className="gradient-text">Quantity Distribution</h5>
                  <div style={{ height: "250px" }}>
                    <Pie
                      data={chartData.quantityData}
                      options={{ responsive: true, maintainAspectRatio: false }}
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
                    Total Inventory List
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
                          <th>Batch Number</th>
                          <th>Expiry Date</th>
                          <th>Quantity</th>
                          <th>Total Purchase Cost</th>
                          <th>Total Sales Cost</th>
                          <th>Purchase Date</th>
                          <th>Manufacturer Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredItems.length > 0 ? (
                          filteredItems.map((item, index) => (
                            <tr key={`${item.purchaseId}-${item.productId}`}>
                              <td>
                                {(currentPage - 1) * pageSize + index + 1}
                              </td>
                              <td>{item.productName}</td>
                              <td>{item.productId}</td>
                              <td>{item.category}</td>
                              <td>{item.brand}</td>
                              <td>{item.batchNumber}</td>
                              <td>{item.expiryDate}</td>
                              <td>{item.quantity}</td>
                              <td>₹{item.totalPurchaseCost.toFixed(2)}</td>
                              <td>₹{item.totalSalesCost.toFixed(2)}</td>
                              <td>{item.purchaseDate}</td>
                              <td>{item.supplierName}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="15" className="text-center">
                              No inventory items found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      Showing {(currentPage - 1) * pageSize + 1} to{" "}
                      {Math.min(currentPage * pageSize, totalCount)} of{" "}
                      {totalCount} items
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
          max-height: 400px;
          overflow-y: auto;
          overflow-x: auto;
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .table {
          margin-bottom: 0;
          min-width: 1600px;
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
            _SRC_ inset -1px -1px 3px rgba(255, 255, 255, 0.9);
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

export default TotalInventoryList;
