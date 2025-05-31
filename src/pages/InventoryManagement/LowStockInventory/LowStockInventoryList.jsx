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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import {
  FaBox,
  FaExclamationTriangle,
  FaFileExcel,
  FaFilter,
} from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

import {
  getlowStockInventory,
  downloadLowStockExcel,
} from "../../../ApiService/InventoryManagement/LowStockInventory";

const LowStockInventoryList = () => {
  const navigate = useNavigate();

  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStockRange, setFilterStockRange] = useState("All");
  const [modal, setModal] = useState(false); // State for modal visibility
  const [modalSearchTerm, setModalSearchTerm] = useState(""); // Temporary search term for modal

  useEffect(() => {
    const fetchLowStockItems = async () => {
      try {
        setLoading(true);
        const response = await getlowStockInventory();
        const mappedItems =
          response?.low_stock_drugs?.map((drug, index) => ({
            id: drug?.drug_id ?? null,
            name: drug?.drug_name ?? "Unknown",
            productId: drug?.drug_id ?? `DRG${index + 1}`,
            currentStock: drug?.current_stock ?? 0,
            reorderLevel: drug?.reorder_level ?? 0,
            supplier: drug?.suppliers ?? "Unknown",
          })) ?? [];
        setLowStockItems(mappedItems);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch low stock inventory");
        setLoading(false);
      }
    };

    fetchLowStockItems();
  }, []);

  // Calculate summary for dashboard
  const calculateSummary = () => {
    const totalItems = lowStockItems?.length ?? 0;
    const belowReorderLevel =
      lowStockItems?.filter(
        (item) => (item?.currentStock ?? 0) < (item?.reorderLevel ?? 0)
      )?.length ?? 0;
    const totalCurrentStock =
      lowStockItems?.reduce(
        (sum, item) => sum + (item?.currentStock ?? 0),
        0
      ) ?? 0;
    const totalReorderLevel =
      lowStockItems?.reduce(
        (sum, item) => sum + (item?.reorderLevel ?? 0),
        0
      ) ?? 0;
    return {
      totalItems,
      belowReorderLevel,
      totalCurrentStock,
      totalReorderLevel,
    };
  };

  const summary = calculateSummary();

  // Prepare chart data
  const prepareChartData = () => {
    const stockData = {
      labels: lowStockItems?.map((item) => item?.name ?? "Unknown") ?? [],
      datasets: [
        {
          label: "Current Stock",
          data: lowStockItems?.map((item) => item?.currentStock ?? 0) ?? [],
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };

    const stockStatusData = {
      labels: ["Below Reorder Level", "At or Above Reorder Level"],
      datasets: [
        {
          label: "Stock Status Distribution",
          data: [
            lowStockItems?.filter(
              (item) => (item?.currentStock ?? 0) < (item?.reorderLevel ?? 0)
            )?.length ?? 0,
            lowStockItems?.filter(
              (item) => (item?.currentStock ?? 0) >= (item?.reorderLevel ?? 0)
            )?.length ?? 0,
          ],
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
          ],
          borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
          borderWidth: 1,
        },
      ],
    };

    return { stockData, stockStatusData };
  };

  const chartData = prepareChartData();

  // Filter low stock items
  const filteredItems =
    lowStockItems?.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        (item?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ??
          false) ||
        (item?.supplier?.toLowerCase()?.includes(searchTerm.toLowerCase()) ??
          false);
      const matchesStockRange =
        filterStockRange === "All" ||
        (filterStockRange === "0-10" && (item?.currentStock ?? 0) <= 10) ||
        (filterStockRange === "11-20" &&
          (item?.currentStock ?? 0) > 10 &&
          (item?.currentStock ?? 0) <= 20) ||
        (filterStockRange === "20+" && (item?.currentStock ?? 0) > 20);
      return matchesSearch && matchesStockRange;
    }) ?? [];

  const handleBack = () => {
    navigate(-1);
  };

  // Excel download via API
  const handleExcelDownload = async () => {
    try {
      const response = await downloadLowStockExcel();
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "low_stock_inventory.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download Excel file");
    }
  };

  // Modal toggle and filter handling
  const toggleModal = () => {
    setModal(!modal);
    setModalSearchTerm(searchTerm); // Sync modal input with current search term
  };

  const applyModalFilter = () => {
    setSearchTerm(modalSearchTerm);
    toggleModal();
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterStockRange("All");
    setModalSearchTerm("");
  };

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Inventory"
            breadcrumbItem="Low Stock Inventory List"
          />
          <p>Loading...</p>
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
            breadcrumbItem="Low Stock Inventory List"
          />
          <p className="text-danger">{error}</p>
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
            breadcrumbItem="Low Stock Inventory List"
          />

          {/* Filter Section */}
          <Row className="mb-4">
            <Col xs="12">
              <Card
                className="shadow-lg"
                style={{ borderRadius: "20px", background: "#f8f9fa" }}
              >
                <CardBody className="p-3">
                  <div className="d-flex justify-content-between align-items-center mb-1 flex-wrap">
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
                  
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Modal for Filter */}
          <Modal isOpen={modal} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>
              Filter Low Stock Inventory
            </ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="modalSearch">Search by Drug Name</Label>
                  <Input
                    type="text"
                    id="modalSearch"
                    placeholder="Enter drug name"
                    value={modalSearchTerm}
                    onChange={(e) => setModalSearchTerm(e?.target?.value ?? "")}
                    className="input-3d"
                  />
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={applyModalFilter}>
                Apply Filter
              </Button>{" "}
              <Button color="secondary" onClick={toggleModal}>
                Cancel
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
                      <h4 className="text-white mb-0">
                        {summary?.totalItems ?? 0}
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
                      <FaExclamationTriangle size={30} className="text-white" />
                    </div>
                    <div>
                      <h6 className="text-light mb-1">Below Reorder Level</h6>
                      <h4 className="text-white mb-0">
                        {summary?.belowReorderLevel ?? 0}
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
                      <FaBox size={30} className="text-white" />
                    </div>
                    <div>
                      <h6 className="text-light mb-1">Total Current Stock</h6>
                      <h4 className="text-white mb-0">
                        {summary?.totalCurrentStock ?? 0}
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
                      <h6 className="text-light mb-1">Total Reorder Level</h6>
                      <h4 className="text-white mb-0">
                        {summary?.totalReorderLevel ?? 0}
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
                  <h5 className="gradient-text">Current Stock by Drug</h5>
                  <div style={{ height: "250px" }}>
                    <Bar
                      data={
                        chartData?.stockData ?? { labels: [], datasets: [] }
                      }
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
                  <h5 className="gradient-text">Stock Status Distribution</h5>
                  <div style={{ height: "250px" }}>
                    <Pie
                      data={
                        chartData?.stockStatusData ?? {
                          labels: [],
                          datasets: [],
                        }
                      }
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
                    Low Stock Inventory List
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
                          <th>Drug ID</th>
                          <th>Drug Name</th>
                          <th>Current Stock</th>
                          <th>Reorder Level</th>
                          <th>Supplier</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredItems?.map((item, index) => (
                          <tr key={item?.id ?? index}>
                            <td>{index + 1}</td>
                            <td>{item?.productId ?? "N/A"}</td>
                            <td>{item?.name ?? "Unknown"}</td>
                            <td>{item?.currentStock ?? 0}</td>
                            <td>{item?.reorderLevel ?? 0}</td>
                            <td>{item?.supplier ?? "Unknown"}</td>
                          </tr>
                        )) ?? (
                          <tr>
                            <td colSpan="6">No data available</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
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
          min-width: 800px;
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

export default LowStockInventoryList;
