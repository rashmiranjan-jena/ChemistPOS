import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { FaFileExcel } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { getSupplierWiseInventorybyId } from "../../../ApiService/InventoryManagement/SupplierWiseInventory";

const SupplierWiseInventoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const toggleModal = () => setModal(!modal);

  const handleShowProducts = (products) => {
    setSelectedProducts(products ?? []);
    toggleModal();
  };

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await getSupplierWiseInventorybyId(id);
        setSuppliers(response ?? []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch supplier data.");
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleExcelDownload = () => {
    const headers = [
      "Sr.No",
      "Supplier ID",
      "Supplier Name",
      "Product List",
      "Quantity Supplied",
      "Last Purchase Date",
      "Total Stock Value",
      "Total Purchase Amount",
    ];
    const rows =
      suppliers?.map((supplier, index) => [
        index + 1,
        supplier?.supplier_id ?? "N/A",
        supplier?.supplier_name ?? "N/A",
        supplier?.product_list?.join("; ") ?? "N/A",
        supplier?.quantity_supplier ?? "N/A",
        supplier?.last_purchase_date ?? "N/A",
        supplier?.total_stock_value ?? "N/A",
        supplier?.total_purchase_amount ?? "N/A",
      ]) ?? [];
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "supplier_inventory.csv");
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
            breadcrumbItem="Supplier-Wise Inventory"
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
                      Supplier-Wise Inventory
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
                        <FaFileExcel style={{ fontSize: "18px" }} />
                        Download Excel
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
                  {loading ? (
                    <p>Loading...</p>
                  ) : error ? (
                    <p className="text-danger">{error}</p>
                  ) : (
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
                            <th>Supplier ID</th>
                            <th>Supplier Name</th>
                            <th>Product List</th>
                            <th>Quantity Supplied</th>
                            <th>Last Purchase Date</th>
                            <th>Total Stock Value</th>
                            <th>Total Purchase Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {suppliers && suppliers.length > 0 ? (
                            suppliers.map((supplier, index) => (
                              <tr key={supplier?.supplier_id ?? index}>
                                <td>{index + 1}</td>
                                <td>{supplier?.supplier_id ?? "N/A"}</td>
                                <td>{supplier?.supplier_name ?? "N/A"}</td>
                                <td>
                                  <Button
                                    color="link"
                                    onClick={() =>
                                      handleShowProducts(supplier?.product_list)
                                    }
                                    style={{
                                      padding: 0,
                                      textDecoration: "underline",
                                    }}
                                  >
                                    Click here to show Products
                                  </Button>
                                </td>
                                <td>{supplier?.quantity_supplier ?? "N/A"}</td>
                                <td>{supplier?.last_purchase_date ?? "N/A"}</td>
                                <td>{supplier?.total_stock_value ?? "N/A"}</td>
                                <td>
                                  {supplier?.total_purchase_amount ?? "N/A"}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8" className="text-center">
                                No Supplier data available.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Product List</ModalHeader>
        <ModalBody>
          <ul>
            {selectedProducts?.map((product, index) => (
              <li key={index}>{product ?? "N/A"}</li>
            )) ?? <li>No products available</li>}
          </ul>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

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

export default SupplierWiseInventoryForm;
