import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Col,
  Container,
  Row,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
} from "reactstrap";
import {
  FaBox,
  FaMoneyBillWave,
  FaDollarSign,
  FaEye,
  FaFileExcel,
  FaSearch,
} from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import { getSupplierWiseInventory } from "../../../ApiService/InventoryManagement/SupplierWiseInventory";

const SupplierWiseInventoryList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [suppliersPerPage] = useState(9);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterQuantityRange, setFilterQuantityRange] = useState("All");
  const [supplierData, setSupplierData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        const response = await getSupplierWiseInventory();
        const mappedData =
          response
            ?.filter((item) => item?.supplier_id && item?.supplier_name)
            ?.map((item) => ({
              id: item?.supplier_id ?? 0,
              supplierName: item?.supplier_name ?? "N/A",
              supplierId: item?.supplier_id ?? 0,
              productList: item?.product_list?.length
                ? item.product_list.join(", ")
                : "No Products",
              quantitySupplied: item?.quantity_supplier ?? 0,
              lastPurchaseDate: item?.last_purchase_date ?? "N/A",
              totalStockValue: item?.total_stock_value ?? 0,
              totalPurchase: item?.total_purchase_amount ?? 0,
              totalQuantity: item?.quantity_supplier ?? 0,
              totalQuantityReturn: 0, 
            })) ?? [];
        setSupplierData(mappedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch supplier data. Please try again later.");
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  // Calculate summary for dashboard
  const calculateSummary = () => {
    const totalSuppliers = supplierData?.length ?? 0;
    const totalPurchase =
      supplierData?.reduce(
        (sum, item) => sum + (item?.totalPurchase ?? 0),
        0
      ) ?? 0;
    const totalQuantity =
      supplierData?.reduce(
        (sum, item) => sum + (item?.totalQuantity ?? 0),
        0
      ) ?? 0;
    const totalStockValue =
      supplierData?.reduce(
        (sum, item) => sum + (item?.totalStockValue ?? 0),
        0
      ) ?? 0;
    return { totalSuppliers, totalPurchase, totalQuantity, totalStockValue };
  };

  const summary = calculateSummary();

  // Prepare chart data
  const prepareChartData = () => {
    const purchaseData = {
      labels:
        supplierData?.map((item) => item?.supplierName ?? "Unknown") ?? [],
      datasets: [
        {
          label: "Total Purchase Amount",
          data: supplierData?.map((item) => item?.totalPurchase ?? 0) ?? [],
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };

    const quantityData = {
      labels:
        supplierData?.map((item) => item?.supplierName ?? "Unknown") ?? [],
      datasets: [
        {
          label: "Quantity Supplied",
          data: supplierData?.map((item) => item?.totalQuantity ?? 0) ?? [],
          backgroundColor:
            supplierData?.map(
              () =>
                `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                  Math.random() * 255
                )}, ${Math.floor(Math.random() * 255)}, 0.6)`
            ) ?? [],
          borderColor:
            supplierData?.map(
              () =>
                `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                  Math.random() * 255
                )}, ${Math.floor(Math.random() * 255)}, 1)`
            ) ?? [],
          borderWidth: 1,
        },
      ],
    };

    return { purchaseData, quantityData };
  };

  const chartData = prepareChartData();

  // Filter supplier data
  const filteredItems =
    supplierData?.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item?.supplierName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        item?.supplierId?.toString()?.includes(searchTerm);
      const matchesQuantity =
        filterQuantityRange === "All" ||
        (filterQuantityRange === "0-500" &&
          (item?.quantitySupplied ?? 0) <= 500) ||
        (filterQuantityRange === "501-1000" &&
          (item?.quantitySupplied ?? 0) > 500 &&
          (item?.quantitySupplied ?? 0) <= 1000) ||
        (filterQuantityRange === "1000+" &&
          (item?.quantitySupplied ?? 0) > 1000);
      return matchesSearch && matchesQuantity;
    }) ?? [];

  // Pagination Logic
  const indexOfLastSupplier = currentPage * suppliersPerPage;
  const indexOfFirstSupplier = indexOfLastSupplier - suppliersPerPage;
  const currentSuppliers = filteredItems.slice(
    indexOfFirstSupplier,
    indexOfLastSupplier
  );

  const totalPages = Math.ceil(filteredItems.length / suppliersPerPage) || 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleBack = () => {
    navigate(-1);
  };

  const handleView = (id) => {
    navigate(`/supplier-wise-inventory-details/${id}`);
  };

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Excel file selected:", file.name);
    }
  };

  const handleExcelDownload = () => {
    const headers = [
      "Sr.No",
      "Supplier Name",
      "Supplier ID",
      "Product List",
      "Quantity Supplied",
      "Last Purchase Date",
      "Total Stock Value",
      "Total Purchase Amount",
      "Total Quantity",
    ];
    const rows = filteredItems.map((supplier, index) => [
      index + 1,
      supplier?.supplierName ?? "N/A",
      supplier?.supplierId ?? "N/A",
      supplier?.productList ?? "N/A",
      supplier?.quantitySupplied ?? 0,
      supplier?.lastPurchaseDate ?? "N/A",
      `$${supplier?.totalStockValue?.toFixed(2) ?? 0}`,
      `$${supplier?.totalPurchase?.toFixed(2) ?? 0}`,
      supplier?.totalQuantity ?? 0,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "supplier_wise_inventory_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterQuantityRange("All");
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Inventory"
            breadcrumbItem="Supplier Wise Inventory List"
          />

          {loading ? (
            <div className="text-center py-5">
              <p>Loading suppliers...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5 text-danger">
              <p>{error}</p>
            </div>
          ) : (
            <>

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
                            background:
                              "linear-gradient(90deg, #007bff, #00c4cc)",
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
                            <FaFileExcel style={{ fontSize: "18px" }} />{" "}
                            Download
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
                          <InputGroup
                            style={{
                              width: "300px",
                              borderRadius: "25px",
                              overflow: "hidden",
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <InputGroupText
                              style={{ background: "#fff", border: "none" }}
                            >
                              <FaSearch color="#6c757d" />
                            </InputGroupText>
                            <Input
                              type="text"
                              placeholder="Search by Supplier Name or ID"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              style={{ border: "none", background: "#fff" }}
                            />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <Label>Quantity Supplied Range</Label>
                          <Input
                            type="select"
                            value={filterQuantityRange}
                            onChange={(e) =>
                              setFilterQuantityRange(e.target.value)
                            }
                            className="input-3d"
                          >
                            <option value="All">All</option>
                            <option value="0-500">0 - 500</option>
                            <option value="501-1000">501 - 1000</option>
                            <option value="1000+">1000+</option>
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
                          <h6 className="text-light mb-1">Total Suppliers</h6>
                          <h4 className="text-white mb-0">
                            {summary?.totalSuppliers ?? 0}
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
                          <FaMoneyBillWave size={30} className="text-white" />
                        </div>
                        <div>
                          <h6 className="text-light mb-1">Total Purchase</h6>
                          <h4 className="text-white mb-0">
                            ₹{summary?.totalPurchase?.toFixed(2) ?? 0}
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
                          <h6 className="text-light mb-1">Total Stock Value</h6>
                          <h4 className="text-white mb-0">
                            ₹{summary?.totalStockValue?.toFixed(2) ?? 0}
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
                      <h5 className="gradient-text">
                        Total Purchase Amount by Supplier
                      </h5>
                      <div style={{ height: "250px" }}>
                        <Bar
                          data={chartData.purchaseData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: true,
                                title: {
                                  display: true,
                                  text: "Purchase Amount",
                                },
                              },
                              x: {
                                title: {
                                  display: true,
                                  text: "Supplier",
                                },
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
                      <h5 className="gradient-text">
                        Quantity Supplied Distribution
                      </h5>
                      <div style={{ height: "250px" }}>
                        <Pie
                          data={chartData.quantityData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: "top",
                              },
                              tooltip: {
                                callbacks: {
                                  label: (context) =>
                                    `${context.label}: ${context.raw} units`,
                                },
                              },
                            },
                          }}
                        />
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              {/* Card Section */}
              <Row>
                <Col xs="12">
                  <Card
                    className="shadow-lg"
                    style={{
                      borderRadius: "20px",
                      background:
                        "linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%)",
                      overflow: "hidden",
                    }}
                  >
                    <CardBody className="p-4">
                      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                        <h4
                          className="text-primary"
                          style={{
                            fontWeight: "700",
                            letterSpacing: "1px",
                            background:
                              "linear-gradient(90deg, #007bff, #00c4cc)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          Supplier Wise Inventory List
                        </h4>
                      </div>
                      <Row>
                        {currentSuppliers?.length > 0 ? (
                          currentSuppliers.map((supplier) => (
                            <Col
                              xs="12"
                              sm="6"
                              lg="4"
                              key={supplier?.id ?? `supplier-${Math.random()}`}
                              className="mb-4"
                            >
                              <Card
                                className="shadow-sm"
                                style={{
                                  borderRadius: "15px",
                                  border: "none",
                                  background: "#fff",
                                  overflow: "hidden",
                                  transition:
                                    "transform 0.3s ease, box-shadow 0.3s ease",
                                  position: "relative",
                                }}
                              >
                                <div
                                  style={{
                                    height: "5px",
                                    background:
                                      "linear-gradient(90deg, #28a745, #20c997)",
                                  }}
                                ></div>
                                <CardBody className="p-4">
                                  <div className="d-flex align-items-center mb-3">
                                    <div
                                      style={{
                                        width: "50px",
                                        height: "50px",
                                        borderRadius: "50%",
                                        background:
                                          "linear-gradient(45deg, #28a745, #20c997)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#fff",
                                        fontSize: "20px",
                                        fontWeight: "600",
                                        marginRight: "15px",
                                        boxShadow:
                                          "0 2px 8px rgba(0, 0, 0, 0.2)",
                                      }}
                                    >
                                      {supplier?.supplierName?.[0] ?? "?"}
                                    </div>
                                    <CardTitle
                                      tag="h5"
                                      className="mb-0"
                                      style={{
                                        fontWeight: "600",
                                        color: "#2c3e50",
                                        letterSpacing: "0.5px",
                                      }}
                                    >
                                      {supplier?.supplierName ?? "N/A"}
                                    </CardTitle>
                                  </div>
                                  <CardText
                                    style={{
                                      color: "#6c757d",
                                      fontSize: "14px",
                                    }}
                                  >
                                    <div className="mb-2">
                                      ID: <i className="bx bx-id-card me-2"></i>
                                      {supplier?.supplierId ?? "N/A"}
                                    </div>
                                    <div className="mb-2">
                                      <i className="bx bx-purchase-tag me-2"></i>
                                      Quantity Supplied:{" "}
                                      {supplier?.quantitySupplied ?? 0}
                                    </div>
                                    <div className="mb-2">
                                      <i className="bx bx-calendar me-2"></i>
                                      Last Purchase:{" "}
                                      {supplier?.lastPurchaseDate ?? "N/A"}
                                    </div>
                                    <div className="mb-2">
                                      <i className="bx bx-dollar me-2"></i>
                                      Stock Value: ₹
                                      {supplier?.totalStockValue?.toFixed(2) ??
                                        0}
                                    </div>
                                    <div className="mb-2">
                                      <i className="bx bx-money me-2"></i>
                                      Total Purchase: ₹
                                      {supplier?.totalPurchase?.toFixed(2) ?? 0}
                                    </div>
                                  </CardText>
                                  <div className="d-flex gap-2 justify-content-end mt-4">
                                    <Button
                                      color="primary"
                                      size="sm"
                                      style={{
                                        borderRadius: "10px",
                                        background:
                                          "linear-gradient(45deg, #007bff, #00c4cc)",
                                        border: "none",
                                        padding: "8px 12px",
                                        boxShadow:
                                          "0 2px 8px rgba(0, 123, 255, 0.3)",
                                        transition: "all 0.3s ease",
                                      }}
                                      onClick={() => handleView(supplier?.id)}
                                      title="View Details"
                                    >
                                      <FaEye style={{ fontSize: "16px" }} />
                                    </Button>
                                  </div>
                                </CardBody>
                              </Card>
                            </Col>
                          ))
                        ) : (
                          <Col xs="12" className="text-center py-5">
                            <div
                              style={{
                                background: "#fff",
                                borderRadius: "15px",
                                padding: "20px",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              <i
                                className="bx bx-error-circle"
                                style={{ fontSize: "40px", color: "#ff6b6b" }}
                              ></i>
                              <p
                                className="text-muted mb-0 mt-2"
                                style={{ fontSize: "16px", fontWeight: "500" }}
                              >
                                No suppliers found matching your criteria
                              </p>
                            </div>
                          </Col>
                        )}
                      </Row>

                      {/* Pagination */}
                      <div className="d-flex justify-content-between align-items-center mt-4">
                        <div style={{ fontSize: "14px", color: "#6c757d" }}>
                          Showing {(currentPage - 1) * suppliersPerPage + 1} to{" "}
                          {Math.min(
                            currentPage * suppliersPerPage,
                            filteredItems?.length ?? 0
                          )}{" "}
                          of {filteredItems?.length ?? 0} suppliers
                        </div>
                        <div className="d-flex gap-2 align-items-center">
                          <Button
                            color="primary"
                            disabled={currentPage === 1}
                            onClick={() => paginate(currentPage - 1)}
                            style={{
                              borderRadius: "10px",
                              background:
                                "linear-gradient(45deg, #007bff, #00c4cc)",
                              border: "none",
                              padding: "8px 20px",
                              boxShadow: "0 2px 8px rgba(0, 123, 255, 0.3)",
                              transition: "all 0.3s ease",
                            }}
                          >
                            Previous
                          </Button>
                          <span
                            style={{
                              fontSize: "14px",
                              color: "#2c3e50",
                              fontWeight: "600",
                            }}
                          >
                            Page {currentPage} of {totalPages}
                          </span>
                          <Button
                            color="primary"
                            disabled={
                              currentPage === totalPages ||
                              filteredItems?.length === 0
                            }
                            onClick={() => paginate(currentPage + 1)}
                            style={{
                              borderRadius: "10px",
                              background:
                                "linear-gradient(45deg, #007bff, #00c4cc)",
                              border: "none",
                              padding: "8px 20px",
                              boxShadow: "0 2px 8px rgba(0, 123, 255, 0.3)",
                              transition: "all 0.3s ease",
                            }}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </>
          )}
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
        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15) !important;
        }
        .btn {
          transition: all 0.3s ease;
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
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
        .input-group {
          transition: box-shadow 0.3s ease;
        }
        .input-group:focus-within {
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3) !important;
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
          .input-group {
            width: 100% !important;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default SupplierWiseInventoryList;
