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
  Badge,
} from "reactstrap";
import {
  FaBox,
  FaDollarSign,
  FaExclamationTriangle,
  FaCubes,
  FaFileExcel,
} from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

import { ExpireManagementInventory } from "../../../ApiService/InventoryManagement/ExpireManagementInventory";

Chart.register(...registerables);

const ExpireDrugsInventory = () => {
  const navigate = useNavigate();
  const [expiredDrugs, setExpiredDrugs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterReturnStatus, setFilterReturnStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpiredDrugs = async () => {
      try {
        setLoading(true);
        const data = await ExpireManagementInventory();
        const mappedData =
          data?.map((item, index) => ({
            id: index + 1,
            drugDetails: {
              productName: item?.drug_details?.drug_name ?? "N/A",
              productId: item?.drug_details?.drug_id?.toString() ?? "N/A",
              drug_type_name: item?.drug_details?.drug_type_name ?? "N/A",
              brand: item?.drug_details?.brand_name ?? "N/A",
              manufacturer: item?.drug_details?.manufacturer_name ?? "N/A",
              batchNumber: item?.batch_no ?? "N/A",
            },
            supplier: {
              id: item?.supplier_id?.toString() ?? "N/A",
              name: item?.supplier_name ?? "N/A",
              contact: item?.supplier_contact ?? "N/A",
              email: item?.supplier_email ?? "N/A",
            },
            supplierBill: {
              billNumber: item?.invoice_no ?? "N/A",
              billDate: item?.bill_date ?? "N/A",
              amount: item?.purchase_amount ?? 0,
            },
            expiryDate: item?.expire_date ?? "N/A",
            quantity: item?.quantity ?? 0,
            returnStatus: {
              status: item?.status ? "Initiated" : "Not Initiated",
            },
          })) ?? [];
        setExpiredDrugs(mappedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch expired drugs inventory");
        setLoading(false);
      }
    };

    fetchExpiredDrugs();
  }, []);

  const calculateDaysToExpiry = (expiryDate) => {
    const today = new Date();
    const expDate = new Date(expiryDate);
    const diffTime = expDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getAlertLevel = (days) => {
    if (days <= 30) return "Critical";
    if (days <= 90) return "Warning";
    return "Safe";
  };

  const calculateSummary = () => {
    const totalItems = expiredDrugs?.length ?? 0;
    const totalBillAmount =
      expiredDrugs?.reduce(
        (sum, item) => sum + (item?.supplierBill?.amount ?? 0),
        0
      ) ?? 0;
    const nearExpiryItems =
      expiredDrugs?.filter(
        (item) => calculateDaysToExpiry(item?.expiryDate) <= 90
      )?.length ?? 0;
    const totalQuantity =
      expiredDrugs?.reduce((sum, item) => sum + (item?.quantity ?? 0), 0) ?? 0;
    return { totalItems, totalBillAmount, nearExpiryItems, totalQuantity };
  };

  const summary = calculateSummary();

  const prepareChartData = () => {
    const billAmountData = {
      labels:
        expiredDrugs?.map(
          (item) => item?.drugDetails?.productName ?? "Unknown"
        ) ?? [],
      datasets: [
        {
          label: "Bill Amount (₹)",
          data:
            expiredDrugs?.map((item) => item?.supplierBill?.amount ?? 0) ?? [],
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };

    const returnStatusData = {
      labels: ["Not Initiated", "Initiated"],
      datasets: [
        {
          label: "Return Status Distribution",
          data: [
            expiredDrugs?.filter(
              (item) => item?.returnStatus?.status === "Not Initiated"
            )?.length ?? 0,
            expiredDrugs?.filter(
              (item) => item?.returnStatus?.status === "Initiated"
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

    return { billAmountData, returnStatusData };
  };

  const chartData = prepareChartData();

  const filteredItems =
    expiredDrugs?.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        (item?.drugDetails?.productName
          ?.toLowerCase()
          ?.includes(searchTerm.toLowerCase()) ??
          false) ||
        (item?.supplier?.name
          ?.toLowerCase()
          ?.includes(searchTerm.toLowerCase()) ??
          false);
      const matchesReturnStatus =
        filterReturnStatus === "All" ||
        item?.returnStatus?.status === filterReturnStatus;
      return matchesSearch && matchesReturnStatus;
    }) ?? [];

  const handleBack = () => {
    navigate(-1);
  };

  const handleExcelUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      console.log("Excel file selected:", file.name);
    }
  };

  const handleExcelDownload = () => {
    const headers = [
      "Sr.No",
      "Supplier ID",
      "Supplier Name",
      "Supplier Contact",
      "Bill Number",
      "Bill Date",
      "Bill Amount",
      "Product ID",
      "Product Name",
      "Category",
      "Brand",
      "Manufacturer",
      "Batch Number",
      "Expiry Date",
      "Quantity",
      "Return Status",
    ];

    const rows =
      filteredItems?.map((item, index) => [
        index + 1,
        item?.supplier?.id ?? "N/A",
        item?.supplier?.name ?? "Unknown",
        item?.supplier?.contact ?? "N/A",
        item?.supplierBill?.billNumber ?? "N/A",
        item?.supplierBill?.billDate ?? "N/A",
        item?.supplierBill?.amount ?? 0,
        item?.drugDetails?.productId ?? "N/A",
        item?.drugDetails?.productName ?? "Unknown",
        item?.drugDetails?.drug_type_name ?? "N/A",
        item?.drugDetails?.brand ?? "N/A",
        item?.drugDetails?.manufacturer ?? "N/A",
        item?.drugDetails?.batchNumber ?? "N/A",
        item?.expiryDate ?? "N/A",
        item?.quantity ?? 0,
        item?.returnStatus?.status ?? "Unknown",
      ]) ?? [];

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "expired_drugs_inventory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterReturnStatus("All");
  };

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Inventory" breadcrumbItem="Expired Drugs List" />
          <p>Loading...</p>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Inventory" breadcrumbItem="Expired Drugs List" />
          <p className="text-danger">{error}</p>
        </Container>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Inventory" breadcrumbItem="Expired Drugs List" />

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
                          boxShadows: "0 2px 8px rgba(0, 0, 0, 0.2)",
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
                        onChange={(e) => setSearchTerm(e?.target?.value ?? "")}
                        className="input-3d"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Return Status</Label>
                      <Input
                        type="select"
                        value={filterReturnStatus}
                        onChange={(e) =>
                          setFilterReturnStatus(e?.target?.value ?? "All")
                        }
                        className="input-3d"
                      >
                        <option value="All">All</option>
                        <option value="Not Initiated">Not Initiated</option>
                        <option value="Initiated">Initiated</option>
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
                      <FaDollarSign size={30} className="text-white" />
                    </div>
                    <div>
                      <h6 className="text-light mb-1">Total Bill Amount</h6>
                      <h4 className="text-white mb-0">
                        ₹{(summary?.totalBillAmount ?? 0).toFixed(2)}
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
                      <FaExclamationTriangle size={30} className="text-white" />
                    </div>
                    <div>
                      <h6 className="text-light mb-1">Near Expiry Items</h6>
                      <h4 className="text-white mb-0">
                        {summary?.nearExpiryItems ?? 0}
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
                      <h6 className="text-light mb-1">Total Quantity</h6>
                      <h4 className="text-white mb-0">
                        {summary?.totalQuantity ?? 0}
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
                  <h5 className="gradient-text">Bill Amount by Drug</h5>
                  <div style={{ height: "250px" }}>
                    <Bar
                      data={
                        chartData?.billAmountData ?? {
                          labels: [],
                          datasets: [],
                        }
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
                  <h5 className="gradient-text">Return Status Distribution</h5>
                  <div style={{ height: "250px" }}>
                    <Pie
                      data={
                        chartData?.returnStatusData ?? {
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
                    Expired Drugs Inventory
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
                          <th style={{ width: "10%" }}>Sr.No</th>
                          <th style={{ width: "10%" }}>Supplier</th>
                          <th style={{ width: "10%" }}>Supplier Bill</th>
                          <th style={{ width: "5%" }}>Drug Details</th>
                          <th style={{ width: "10%" }}>Expiry Date</th>
                          <th style={{ width: "10%" }}>Quantity</th>
                          <th style={{ width: "10%" }}>Return Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredItems?.map((item, index) => {
                          const daysToExpiry = calculateDaysToExpiry(
                            item?.expiryDate
                          );
                          const alertLevel = getAlertLevel(daysToExpiry);
                          return (
                            <tr key={item?.id ?? index}>
                              <td>{index + 1}</td>
                              <td>
                                <div className="compact-cell">
                                  <strong className="text-truncate">
                                    {item?.supplier?.name ?? "Unknown"}
                                  </strong>
                                  <div className="small text-muted text-truncate">
                                    ID: {item?.supplier?.id ?? "N/A"}
                                  </div>
                                  <div className="small text-truncate">
                                    {item?.supplier?.contact ?? "N/A"}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="compact-cell">
                                  <strong className="text-truncate">
                                    {item?.supplierBill?.billNumber ?? "N/A"}
                                  </strong>
                                  <div className="small text-truncate">
                                    {item?.supplierBill?.billDate ?? "N/A"}
                                  </div>
                                  <div className="text-truncate">
                                    ₹
                                    {(item?.supplierBill?.amount ?? 0).toFixed(
                                      2
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="compact-cell">
                                  <strong className="text-truncate">
                                    {item?.drugDetails?.productName ??
                                      "Unknown"}
                                  </strong>
                                  <div className="small text-truncate">
                                    ID: {item?.drugDetails?.productId ?? "N/A"}
                                  </div>
                                  <div className="small text-truncate">
                                    Batch:{" "}
                                    {item?.drugDetails?.batchNumber ?? "N/A"}
                                  </div>
                                  <div className="small text-truncate">
                                    {item?.drugDetails?.brand ?? "N/A"} (
                                    {item?.drugDetails?.manufacturer ?? "N/A"})
                                  </div>
                                  <Badge color="info" pill className="mt-1">
                                    {item?.drugDetails?.drug_type_name ?? "N/A"}
                                  </Badge>
                                </div>
                              </td>
                              <td
                                style={{ color: "#dc3545", fontWeight: "bold" }}
                              >
                                {item?.expiryDate ?? "N/A"}
                              </td>
                              <td>{item?.quantity ?? 0}</td>
                              <td>
                                <Badge
                                  color={
                                    item?.returnStatus?.status === "Initiated"
                                      ? "primary"
                                      : "secondary"
                                  }
                                  pill
                                >
                                  {item?.returnStatus?.status ?? "Unknown"}
                                </Badge>
                              </td>
                            </tr>
                          );
                        }) ?? (
                          <tr>
                            <td colSpan="7">No data available</td>
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
          max-height: 500px;
          overflow-y: auto;
          overflow-x: auto;
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .table {
          margin-bottom: 0;
          min-width: 1000px; /* Reduced from 1500px for better fit */
        }
        .table-striped tbody tr:nth-of-type(odd) {
          background-color: rgba(0, 0, 0, 0.03);
        }
        .table-hover tbody tr:hover {
          background-color: rgba(0, 123, 255, 0.1);
        }
        .table th,
        .table td {
          padding: 8px; /* Reduced padding for tighter layout */
          vertical-align: middle;
        }
        .compact-cell {
          line-height: 1.2; /* Tighter line spacing */
          max-width: 100%;
        }
        .compact-cell strong {
          font-size: 14px; /* Slightly smaller primary text */
          display: block;
          margin-bottom: 2px;
        }
        .compact-cell .small {
          font-size: 12px; /* Smaller secondary text */
          margin-bottom: 2px;
        }
        .compact-cell .text-truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .badge {
          padding: 4px 8px;
          font-size: 11px;
        }
        .input-3d {
          border: none;
          border-radius: 8px;
          padding: 8px;
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
          .table {
            min-width: 100%; /* Full width on small screens */
          }
          .compact-cell .text-truncate {
            white-space: normal; /* Allow wrapping on small screens */
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default ExpireDrugsInventory;
