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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import { FaEdit, FaTrash, FaFileExcel, FaFilter } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getPurchaseRecipt } from "../../../ApiService/Purchase/PurchaseRecipt";
import { downloadPurchaseOrderExcel } from "../../../ApiService/Purchase/PurchaseOrderReport";

const PurchesOrderReport = () => {
  const navigate = useNavigate();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    poNo: "",
    supplier: "",
    drugCategory: "",
    startDate: "",
    endDate: "",
  });

  const fetchPurchaseOrders = async () => {
    setLoading(true);
    try {
      const data = await getPurchaseRecipt();
      setPurchaseOrders(data || []);
      setFilteredOrders(data || []);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch purchase orders",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e?.target || {};
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const filtered =
      purchaseOrders?.filter((order) => {
        const orderDate = new Date(order?.pr_no?.date);
        const startDate = filters?.startDate
          ? new Date(filters.startDate)
          : null;
        const endDate = filters?.endDate ? new Date(filters.endDate) : null;

        return (
          (!filters?.poNo ||
            order?.po_id
              ?.toLowerCase()
              ?.includes(filters.poNo.toLowerCase())) &&
          (!filters?.supplier ||
            order?.supplier_name
              ?.toLowerCase()
              ?.includes(filters.supplier.toLowerCase())) &&
          (!filters?.drugCategory ||
            order?.pr_no?.drug_details?.[0]?.drug_name
              ?.toLowerCase()
              ?.includes(filters.drugCategory.toLowerCase())) &&
          (!startDate || orderDate >= startDate) &&
          (!endDate || orderDate <= endDate)
        );
      }) || [];

    setFilteredOrders(filtered);
    toggleFilterModal();
  };

  const resetFilters = () => {
    setFilters({
      poNo: "",
      supplier: "",
      drugCategory: "",
      startDate: "",
      endDate: "",
    });
    setFilteredOrders(purchaseOrders);
    toggleFilterModal();
  };

  const toggleFilterModal = () => {
    setFilterModal(!filterModal);
  };

  const handleBack = () => navigate(-1);

  const handleCardExcelDownload = async (order) => {
    try {
      const response = await downloadPurchaseOrderExcel(order.id);
      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `purchase_order_${order.po_id}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      Swal.fire({
        title: "Success!",
        text: "Excel file downloaded successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to download Excel file",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Reports" breadcrumbItem="Purchase Order Report" />

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
                        background: "linear-gradient(90deg, #007bff, #00c4cc)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Purchase Order Report
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="info"
                        onClick={toggleFilterModal}
                        style={{
                          height: "40px",
                          padding: "8px 12px",
                          borderRadius: "10px",
                          background:
                            "linear-gradient(45deg, #17a2b8, #00c4cc)",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)",
                          transition: "transform 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                        className="hover-scale"
                      >
                        <FaFilter style={{ fontSize: "16px" }} />
                        Filter
                      </Button>
                      <Button
                        color="primary"
                        onClick={handleBack}
                        style={{
                          height: "40px",
                          width: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(45deg, #007bff, #00c4cc)",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)",
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

                  {/* Cards Display */}
                  <div className="cards-container">
                    {loading ? (
                      <div className="text-center py-5">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : filteredOrders?.length > 0 ? (
                      <Row>
                        {filteredOrders?.map((order) => (
                          <Col
                            xs="12"
                            sm="6"
                            lg="4"
                            key={order?.id}
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
                                  background: order?.pr_no?.status
                                    ? "linear-gradient(90deg, #28a745, #20c997)"
                                    : "linear-gradient(90deg, #ff6b6b, #ff8e53)",
                                }}
                              ></div>
                              <CardBody className="p-4">
                                <div className="d-flex align-items-center mb-3">
                                  <div
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      borderRadius: "50%",
                                      background: order?.pr_no?.status
                                        ? "linear-gradient(45deg, #28a745, #20c997)"
                                        : "linear-gradient(45deg, #ff6b6b, #ff8e53)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color: "#fff",
                                      fontSize: "20px",
                                      fontWeight: "600",
                                      marginRight: "15px",
                                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                                    }}
                                  >
                                    {order?.po_id
                                      ?.substring(0, 2)
                                      .toUpperCase()}
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
                                    PO: {order?.po_id}
                                  </CardTitle>
                                </div>
                                <CardText
                                  style={{ color: "#6c757d", fontSize: "14px" }}
                                >
                                  <div className="mb-2">
                                    <i className="bx bx-user me-2"></i>
                                    Supplier: {order?.supplier_name}
                                  </div>
                                  <div className="mb-2">
                                    <i className="bx bx-calendar me-2"></i>
                                    Date: {order?.pr_no?.date}
                                  </div>
                                  <div className="mb-2">
                                    <i className="bx bx-time me-2"></i>
                                    Time: {order?.pr_no?.time}
                                  </div>
                                  <div>
                                    <i
                                      className={`bx ${
                                        order?.pr_no?.status
                                          ? "bx-check-circle"
                                          : "bx-block"
                                      } me-2`}
                                    ></i>
                                    Status:{" "}
                                    {order?.pr_no?.status
                                      ? "Active"
                                      : "Inactive"}
                                  </div>
                                </CardText>
                                <div className="d-flex gap-2 justify-content-end mt-4">
                                  <Button
                                    color="success"
                                    size="sm"
                                    style={{
                                      borderRadius: "10px",
                                      background:
                                        "linear-gradient(45deg, #28a745, #20c997)",
                                      border: "none",
                                      padding: "8px 12px",
                                      boxShadow:
                                        "0 2px 8px rgba(40, 167, 69, 0.3)",
                                      transition: "all 0.3s ease",
                                    }}
                                    onClick={() =>
                                      handleCardExcelDownload(order)
                                    }
                                    title="Download Excel"
                                  >
                                    <FaFileExcel style={{ fontSize: "16px" }} />
                                  </Button>
                                </div>
                              </CardBody>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <div className="text-center py-5">
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
                            No purchase orders found
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Modal
        isOpen={filterModal}
        toggle={toggleFilterModal}
        centered
        className="modal-modern"
      >
        <ModalHeader toggle={toggleFilterModal}>
          Filter Purchase Orders
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="poNo">PO No.</Label>
              <Input
                type="text"
                name="poNo"
                id="poNo"
                placeholder="Enter PO No."
                value={filters.poNo}
                onChange={handleFilterChange}
                className="input-modern"
              />
            </FormGroup>
            <FormGroup>
              <Label for="supplier">Supplier</Label>
              <Input
                type="text"
                name="supplier"
                id="supplier"
                placeholder="Enter Supplier Name"
                value={filters.supplier}
                onChange={handleFilterChange}
                className="input-modern"
              />
            </FormGroup>
            <FormGroup>
              <Label for="drugCategory">Drug Category</Label>
              <Input
                type="text"
                name="drugCategory"
                id="drugCategory"
                placeholder="Enter Drug Category"
                value={filters.drugCategory}
                onChange={handleFilterChange}
                className="input-modern"
              />
            </FormGroup>
            <FormGroup>
              <Label for="startDate">Start Date</Label>
              <Input
                type="date"
                name="startDate"
                id="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="input-modern"
              />
            </FormGroup>
            <FormGroup>
              <Label for="endDate">End Date</Label>
              <Input
                type="date"
                name="endDate"
                id="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="input-modern"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={resetFilters}
            className="btn-modern"
          >
            Reset
          </Button>
          <Button color="primary" onClick={applyFilters} className="btn-modern">
            Apply Filters
          </Button>
        </ModalFooter>
      </Modal>

      <style jsx>{`
        .hover-scale:hover {
          transform: scale(1.1) !important;
        }
        .cards-container {
          min-height: 400px;
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
        .modal-modern .modal-content {
          border: none;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        .input-modern {
          border: none;
          border-radius: 8px;
          padding: 10px;
          background: #fff;
          box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.1),
            inset -2px -2px 5px rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
        }
        .input-modern:focus {
          box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.2),
            inset -1px -1px 3px rgba(255, 255, 255, 0.9);
          outline: none;
        }
        .btn-modern {
          border: none;
          border-radius: 8px;
          padding: 8px 20px;
          box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2),
            -3px -3px 6px rgba(255, 255, 255, 0.7);
          transition: all 0.2s ease;
        }
        .btn-modern:hover {
          box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25),
            -2px -2px 4px rgba(255, 255, 255, 0.8);
          transform: translateY(1px);
        }
        .btn-modern:active {
          box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.2),
            inset -2px -2px 4px rgba(255, 255, 255, 0.7);
          transform: translateY(2px);
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

export default PurchesOrderReport;
