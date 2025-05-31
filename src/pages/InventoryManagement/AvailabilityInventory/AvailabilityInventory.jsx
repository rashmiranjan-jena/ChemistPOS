import React from "react";
import { Button, Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaFileExcel } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb"; // Adjust path as needed
import { useNavigate } from "react-router-dom";

const AvailabilityInventory = () => {
  const navigate = useNavigate();

  // Sample data for available drugs
  const availableDrugs = [
    {
      id: 1,
      productName: "Paracetamol",
      productId: "PAR001",
      category: "Analgesics",
      quantityInStock: 150,
      unitOfMeasurement: "Tablets",
      store: "Warehouse A1",
      availabilityStatus: "In Stock",
    },
    {
      id: 2,
      productName: "Amoxicillin",
      productId: "AMO002",
      category: "Antibiotics",
      quantityInStock: 75,
      unitOfMeasurement: "Capsules",
      store: "Warehouse B2",
      availabilityStatus: "In Stock",
    },
    {
      id: 3,
      productName: "Ibuprofen",
      productId: "IBU003",
      category: "Analgesics",
      quantityInStock: 0,
      unitOfMeasurement: "Tablets",
      store: "Warehouse A1",
      availabilityStatus: "Out of Stock",
    },
  ];

  const handleBack = () => {
    navigate(-1);
  };

  const handleView = (id) => {
    navigate(`/availability-details/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/edit-availability/${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete drug with ID: ${id}`);
    // Implement delete logic here (e.g., API call)
  };

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Excel file selected:", file.name);
      // Implement Excel upload logic here (e.g., using 'xlsx' library)
    }
  };

  const handleExcelDownload = () => {
    const headers = [
      "Sr.No",
      "Product Name",
      "Product ID",
      "Category",
      "Quantity in Stock",
      "Unit of Measurement",
      "Store",
      "Availability Status",
    ];
    const rows = availableDrugs.map((drug, index) => [
      index + 1,
      drug.productName,
      drug.productId,
      drug.category,
      drug.quantityInStock,
      drug.unitOfMeasurement,
      drug.store,
      drug.availabilityStatus,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "availability_inventory_list.csv");
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
            breadcrumbItem="Availability Inventory List"
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
                        background: "linear-gradient(90deg, #007bff, #dc3545)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Availability Inventory List
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
                        <FaFileExcel style={{ fontSize: "18px" }} /> Upload
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

                  <div className="table-container">
                    <Table
                      className="table table-striped table-hover align-middle"
                      responsive
                    >
                      <thead
                        style={{
                          background:
                            "linear-gradient(90deg, #007bff, #dc3545)",
                          color: "#fff",
                        }}
                      >
                        <tr>
                          <th>Sr.No</th>
                          <th>Product Name</th>
                          <th>Product ID</th>
                          <th>Category</th>
                          <th>Quantity in Stock</th>
                          <th>Unit</th>
                          <th>Store</th>
                          <th>Availability Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {availableDrugs.map((drug, index) => (
                          <tr key={drug.id}>
                            <td>{index + 1}</td>
                            <td>{drug.productName}</td>
                            <td>{drug.productId}</td>
                            <td>{drug.category}</td>
                            <td>{drug.quantityInStock}</td>
                            <td>{drug.unitOfMeasurement}</td>
                            <td>{drug.store}</td>
                            <td>
                              <span
                                className={`badge ${
                                  drug.availabilityStatus === "In Stock"
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                              >
                                {drug.availabilityStatus}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-2 justify-content-center">
                                <FaEye
                                  style={{
                                    fontSize: "18px",
                                    color: "#007bff",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleView(drug.id)}
                                  title="View"
                                />
                                <FaEdit
                                  style={{
                                    fontSize: "18px",
                                    color: "#4caf50",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleEdit(drug.id)}
                                  title="Edit"
                                />
                                <FaTrash
                                  style={{
                                    fontSize: "18px",
                                    color: "#f44336",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleDelete(drug.id)}
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
          min-width: 900px;
        }
        .table-striped tbody tr:nth-of-type(odd) {
          background-color: rgba(0, 0, 0, 0.03);
        }
        .table-hover tbody tr:hover {
          background-color: rgba(0, 123, 255, 0.1);
        }
        .badge {
          padding: 5px 10px;
          font-size: 12px;
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

export default AvailabilityInventory;