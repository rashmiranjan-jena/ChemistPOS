import React, { useState } from "react";
import { Button, Card, CardBody, Col, Container, Row, Table, Form, FormGroup, Input, Label } from "reactstrap";
import { FaBox, FaMoneyBillWave, FaDollarSign, FaUndo, FaEye, FaEdit, FaTrash, FaFileExcel } from "react-icons/fa";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";

const ReturnProduct = () => {
  const navigate = useNavigate();

  const [returnData, setReturnData] = useState([
    {
      id: 1,
      supplierName: "MediCorp",
      supplierId: "MC001",
      invoiceNumber: "INV001",
      productName: "Paracetamol",
      returnQuantity: 100,
      returnDate: "2025-02-20",
      returnAmount: 50.0,
      reason: "Expired",
    },
    {
      id: 2,
      supplierName: "PharmaPlus",
      supplierId: "PP002",
      invoiceNumber: "INV002",
      productName: "Amoxicillin",
      returnQuantity: 50,
      returnDate: "2025-01-25",
      returnAmount: 30.0,
      reason: "Damaged",
    },
    {
      id: 3,
      supplierName: "HealthDist",
      supplierId: "HD003",
      invoiceNumber: "INV003",
      productName: "Aspirin",
      returnQuantity: 150,
      returnDate: "2025-03-05",
      returnAmount: 75.0,
      reason: "Overstock",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("All");
  const [filterDate, setFilterDate] = useState("");
  const [filterInvoice, setFilterInvoice] = useState("");

  // Calculate summary for dashboard
  const calculateSummary = () => {
    const totalReturns = returnData.length;
    const totalReturnQuantity = returnData.reduce((sum, item) => sum + item.returnQuantity, 0);
    const totalReturnAmount = returnData.reduce((sum, item) => sum + item.returnAmount, 0);
    return { totalReturns, totalReturnQuantity, totalReturnAmount };
  };

  const summary = calculateSummary();

  // Filter return data
  const filteredItems = returnData.filter((item) => {
    const matchesSearch = searchTerm === "" || 
      item.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplierId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSupplier = filterSupplier === "All" || item.supplierName === filterSupplier;
    const matchesDate = filterDate === "" || item.returnDate.includes(filterDate);
    const matchesInvoice = filterInvoice === "" || item.invoiceNumber.toLowerCase().includes(filterInvoice.toLowerCase());
    return matchesSearch && matchesSupplier && matchesDate && matchesInvoice;
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleView = (id) => {
    navigate(`/return-details/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/edit-return/${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete return with ID: ${id}`);
    setReturnData(returnData.filter((item) => item.id !== id));
  };

  const handleExcelDownload = () => {
    const headers = [
      "Sr.No",
      "Supplier Name",
      "Supplier ID",
      "Invoice Number",
      "Product Name",
      "Return Quantity",
      "Return Date",
      "Return Amount",
      "Reason",
    ];
    const rows = filteredItems.map((returnItem, index) => [
      index + 1,
      returnItem.supplierName,
      returnItem.supplierId,
      returnItem.invoiceNumber,
      returnItem.productName,
      returnItem.returnQuantity,
      returnItem.returnDate,
      `$${returnItem.returnAmount.toFixed(2)}`,
      returnItem.reason,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "return_products_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterSupplier("All");
    setFilterDate("");
    setFilterInvoice("");
  };

  // Get unique suppliers for filter dropdown
  const uniqueSuppliers = [...new Set(returnData.map(item => item.supplierName))];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Inventory" breadcrumbItem="Return Products List" />

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
                      <h6 className="text-light mb-1">Total Returns</h6>
                      <h4 className="text-white mb-0">{summary.totalReturns}</h4>
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
                      <h6 className="text-light mb-1">Total Return Quantity</h6>
                      <h4 className="text-white mb-0">{summary.totalReturnQuantity}</h4>
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
                      <FaDollarSign size={30} className="text-white" />
                    </div>
                    <div>
                      <h6 className="text-light mb-1">Total Return Amount</h6>
                      <h4 className="text-white mb-0">${summary.totalReturnAmount.toFixed(2)}</h4>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Filter Section */}
          <Row className="mb-4">
            <Col xs="12">
              <Card className="shadow-lg" style={{ borderRadius: "20px", background: "#f8f9fa" }}>
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
                        <FaUndo style={{ fontSize: "18px" }} />
                      </Button>
                    </div>
                  </div>
                  <Form className="d-flex flex-wrap gap-3">
                    <FormGroup>
                      <Label>Search</Label>
                      <Input
                        type="text"
                        placeholder="Search by Supplier, Product, or Invoice"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-3d"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Supplier</Label>
                      <Input
                        type="select"
                        value={filterSupplier}
                        onChange={(e) => setFilterSupplier(e.target.value)}
                        className="input-3d"
                      >
                        <option value="All">All</option>
                        {uniqueSuppliers.map((supplier, index) => (
                          <option key={index} value={supplier}>{supplier}</option>
                        ))}
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label>Return Date</Label>
                      <Input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="input-3d"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Invoice Number</Label>
                      <Input
                        type="text"
                        placeholder="Enter Invoice Number"
                        value={filterInvoice}
                        onChange={(e) => setFilterInvoice(e.target.value)}
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

          {/* Table Section */}
          <Row>
            <Col xs="12">
              <Card className="shadow-lg" style={{ borderRadius: "20px", overflow: "hidden", background: "#f8f9fa" }}>
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
                    Return Products List
                  </h4>
                  <div className="table-container">
                    <Table className="table table-striped table-hover align-middle" responsive>
                      <thead
                        style={{
                          background: "linear-gradient(90deg, #007bff, #00c4cc)",
                          color: "#fff",
                        }}
                      >
                        <tr>
                          <th>Sr.No</th>
                          <th>Supplier Name</th>
                          <th>Supplier ID</th>
                          <th>Invoice Number</th>
                          <th>Product Name</th>
                          <th>Return Quantity</th>
                          <th>Return Date</th>
                          <th>Return Amount</th>
                          <th>Reason</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredItems.map((returnItem, index) => (
                          <tr key={returnItem.id}>
                            <td>{index + 1}</td>
                            <td>{returnItem.supplierName}</td>
                            <td>{returnItem.supplierId}</td>
                            <td>{returnItem.invoiceNumber}</td>
                            <td>{returnItem.productName}</td>
                            <td>{returnItem.returnQuantity}</td>
                            <td>{returnItem.returnDate}</td>
                            <td>${returnItem.returnAmount.toFixed(2)}</td>
                            <td>{returnItem.reason}</td>
                            <td>
                              <div className="d-flex gap-2 justify-content-center">
                                  <FaEye
                                    style={{
                                      fontSize: "18px",
                                      color: "#007bff",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleView(returnItem.id)}
                                    title="View"
                                  />
                                  <FaEdit
                                    style={{
                                      fontSize: "18px",
                                      color: "#4caf50",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleEdit(returnItem.id)}
                                    title="Edit"
                                  />
                                  <FaTrash
                                    style={{
                                      fontSize: "18px",
                                      color: "#f44336",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleDelete(returnItem.id)}
                                    title="Delete"
                                  />
                                </div>
                            </td>
                          </tr>
                        ))}
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

export default ReturnProduct;