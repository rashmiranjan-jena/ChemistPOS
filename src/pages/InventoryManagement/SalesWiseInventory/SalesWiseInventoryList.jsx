import React from "react";
import { Button, Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaFileExcel } from "react-icons/fa"; 
import Breadcrumbs from "../../../components/Common/Breadcrumb"; 
import { useNavigate } from "react-router-dom";

const SalesWiseInventoryList = () => {
  const navigate = useNavigate();

  const salesData = [
    {
      id: 1,
      invoiceNo: "INV-001",
      salesDate: "2025-03-01",
      productName: "Paracetamol",
      quantitySold: 50,
      remainingStock: 150,
    },
    {
      id: 2,
      invoiceNo: "INV-002",
      salesDate: "2025-03-02",
      productName: "Amoxicillin",
      quantitySold: 30,
      remainingStock: 70,
    },
    {
      id: 3,
      invoiceNo: "INV-003",
      salesDate: "2025-03-03",
      productName: "Ibuprofen",
      quantitySold: 20,
      remainingStock: 130,
    },
    {
      id: 4,
      invoiceNo: "INV-004",
      salesDate: "2025-03-05",
      productName: "Cetirizine",
      quantitySold: 15,
      remainingStock: 35,
    },
  ];

  const handleBack = () => {
    navigate(-1);
  };

  const handleView = (id) => {
    navigate(`/sales-details/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/edit-sales/${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete sale with ID: ${id}`);
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
      "Sales Invoice No.",
      "Sales Date",
      "Product Name",
      "Quantity Sold",
      "Remaining Stock",
    ];
    const rows = salesData.map((sale, index) => [
      index + 1,
      sale.invoiceNo,
      sale.salesDate,
      sale.productName,
      sale.quantitySold,
      sale.remainingStock,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "sales_wise_inventory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Inventory"
            breadcrumbItem="Sales Wise Inventory List"
          />

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
                      Sales Wise Inventory List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                     
                      <label
                        htmlFor="excel-upload"
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
                          backgroundColor: "#28a745",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                        className="hover-scale m-0"
                      >
                        <FaFileExcel style={{ fontSize: "18px" }} />
                        Upload
                      </label>
                      <input
                        id="excel-upload"
                        type="file"
                        accept=".xlsx, .xls"
                        style={{ display: "none" }}
                        onChange={handleExcelUpload}
                      />
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
                        <FaFileExcel style={{ fontSize: "18px" }} />
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
                          <th>Sales Invoice No.</th>
                          <th>Sales Date</th>
                          <th>Product Name</th>
                          <th>Quantity Sold</th>
                          <th>Remaining Stock</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salesData.map((sale, index) => (
                          <tr key={sale.id}>
                            <td>{index + 1}</td>
                            <td>{sale.invoiceNo}</td>
                            <td>{sale.salesDate}</td>
                            <td>{sale.productName}</td>
                            <td>{sale.quantitySold}</td>
                            <td>{sale.remainingStock}</td>
                            <td>
                              <div className="d-flex gap-2 justify-content-center">
                                <FaEye
                                  style={{
                                    fontSize: "18px",
                                    color: "#007bff",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleView(sale.id)}
                                  title="View"
                                />
                                <FaEdit
                                  style={{
                                    fontSize: "18px",
                                    color: "#4caf50",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleEdit(sale.id)}
                                  title="Edit"
                                />
                                <FaTrash
                                  style={{
                                    fontSize: "18px",
                                    color: "#f44336",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleDelete(sale.id)}
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

export default SalesWiseInventoryList;
