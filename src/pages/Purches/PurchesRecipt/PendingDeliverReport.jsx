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
import { FaFileExcel, FaFilter } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getPurchaseEntries } from "../../../ApiService/Purchase/PurchaseEntry";

const PendingDeliverReport = () => {
  const navigate = useNavigate();
  const [pendingDeliveries, setPendingDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterModal, setFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    poNo: "",
    supplier: "",
    drugCategory: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchPendingDeliveries = async () => {
      try {
        const response = await getPurchaseEntries();
        const partialDeliveries =
          response?.filter(
            (delivery) => delivery?.delivery_Type === "Partial"
          ) || [];
        setPendingDeliveries(partialDeliveries);
        setFilteredDeliveries(partialDeliveries);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pending deliveries:", error);
        setLoading(false);
      }
    };

    fetchPendingDeliveries();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const filtered = pendingDeliveries.filter((delivery) => {
      const deliveryDate = new Date(delivery?.date);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;

      return (
        (!filters.poNo ||
          delivery?.po_id_name
            ?.toLowerCase()
            ?.includes(filters.poNo.toLowerCase())) &&
        (!filters.supplier ||
          delivery?.supplier_name
            ?.toLowerCase()
            ?.includes(filters.supplier.toLowerCase())) &&
        (!filters.drugCategory ||
          delivery?.drug_category
            ?.toLowerCase()
            ?.includes(filters.drugCategory.toLowerCase())) &&
        (!startDate || deliveryDate >= startDate) &&
        (!endDate || deliveryDate <= endDate)
      );
    });

    setFilteredDeliveries(filtered);
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
    setFilteredDeliveries(pendingDeliveries);
    toggleFilterModal();
  };

  const toggleFilterModal = () => {
    setFilterModal(!filterModal);
  };

  const handleBack = () => navigate(-1);

  const handleRowExcelDownload = (delivery) => {
    const headers = [
      "Sr.No",
      "ID",
      "Date",
      "Time",
      "Delivery Person",
      "Phone No.",
      "Email ID",
      "Mode of Delivery",
      "Vehicle No.",
      "Driver No.",
      "No. of Packs",
      "Receipt No.",
      "PO No.",
      "Supplier",
      "Drug Category",
    ];
    const row = [
      1,
      delivery?.id,
      delivery?.date,
      delivery?.time,
      delivery?.delivery_boy_name,
      delivery?.phone_no,
      delivery?.email,
      delivery?.mode_of_delivery,
      delivery?.vehicle_no,
      delivery?.driver_no,
      delivery?.no_of_packs,
      delivery?.receipt_no,
      delivery?.po_id_name,
      delivery?.supplier_name,
      delivery?.drug_category,
    ];
    const csvContent = [headers.join(","), row.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `pending_delivery_${delivery?.po_id_name || "unknown"}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Reports"
            breadcrumbItem="Pending Delivery Report"
          />

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
                      Pending Delivery Report
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
                          style={{
                            background: "#fff",
                            borderRadius: "15px",
                            padding: "20px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <i
                            className="bx bx-loader bx-spin"
                            style={{ fontSize: "40px", color: "#007bff" }}
                          ></i>
                          <p
                            className="text-muted mb-0 mt-2"
                            style={{ fontSize: "16px", fontWeight: "500" }}
                          >
                            Loading...
                          </p>
                        </div>
                      </div>
                    ) : filteredDeliveries.length > 0 ? (
                      <Row>
                        {filteredDeliveries.map((delivery) => (
                          <Col
                            xs="12"
                            sm="6"
                            lg="4"
                            key={delivery?.id}
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
                              }}
                            >
                              <div
                                style={{
                                  height: "5px",
                                  background:
                                    "linear-gradient(90deg, #ff6b6b, #ff8e53)",
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
                                        "linear-gradient(45deg, #ff6b6b, #ff8e53)",
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
                                    {delivery?.po_id_name
                                      ?.substring(0, 2)
                                      ?.toUpperCase() || "NA"}
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
                                    PO: {delivery?.po_id_name || "Unknown"}
                                  </CardTitle>
                                </div>
                                <CardText
                                  style={{ color: "#6c757d", fontSize: "14px" }}
                                >
                                  <div className="mb-2">
                                    <i className="bx bx-user me-2"></i>
                                    Delivery Person:{" "}
                                    {delivery?.delivery_boy_name || "N/A"}
                                  </div>
                                  <div className="mb-2">
                                    <i className="bx bx-store me-2"></i>
                                    Supplier: {delivery?.supplier_name || "N/A"}
                                  </div>
                                  <div className="mb-2">
                                    <i className="bx bx-calendar me-2"></i>
                                    Date: {delivery?.date || "N/A"}
                                  </div>
                                  <div className="mb-2">
                                    <i className="bx bx-package me-2"></i>
                                    No. of Packs: {delivery?.no_of_packs || "0"}
                                  </div>
                                  <div>
                                    <i className="bx bx-category me-2"></i>
                                    Drug Category:{" "}
                                    {delivery?.drug_category || "N/A"}
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
                                      handleRowExcelDownload(delivery)
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
                            No pending deliveries found
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
          Filter Pending Deliveries
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

export default PendingDeliverReport;
