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
import {
  FaEdit,
  FaTrash,
  FaFilePdf,
  FaFileExcel,
  FaFilter,
} from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getPurchaseEntries } from "../../../ApiService/Purchase/PurchaseEntry";

const GoodsReport = () => {
  const navigate = useNavigate();
  const [goodsData, setGoodsData] = useState([]);
  const [filteredGoods, setFilteredGoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterModal, setFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    poNo: "",
    supplier: "",
    receiveStatus: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchGoodsData = async () => {
      try {
        const response = await getPurchaseEntries();
        const completeDeliveries =
          response?.filter((item) => item?.delivery_Type === "Complete") || [];
        setGoodsData(completeDeliveries);
        setFilteredGoods(completeDeliveries);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching goods data:", error);
        setLoading(false);
      }
    };

    fetchGoodsData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const filtered = goodsData.filter((item) => {
      const receiveDate = new Date(item?.date);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;

      return (
        (!filters.poNo ||
          item?.po_id_name
            ?.toLowerCase()
            ?.includes(filters.poNo.toLowerCase())) &&
        (!filters.supplier ||
          item?.po_supplier_name
            ?.toLowerCase()
            ?.includes(filters.supplier.toLowerCase())) &&
        (!filters.receiveStatus ||
          (item?.purchase_Invoice_Received ? "Complete" : "Partial") ===
            filters.receiveStatus) &&
        (!startDate || receiveDate >= startDate) &&
        (!endDate || receiveDate <= endDate)
      );
    });

    setFilteredGoods(filtered);
    toggleFilterModal();
  };

  const resetFilters = () => {
    setFilters({
      poNo: "",
      supplier: "",
      receiveStatus: "",
      startDate: "",
      endDate: "",
    });
    setFilteredGoods(goodsData);
    toggleFilterModal();
  };

  const toggleFilterModal = () => {
    setFilterModal(!filterModal);
  };

  const handleBack = () => navigate(-1);

  const handleRowExcelDownload = (item) => {
    const headers = [
      "Sr.No",
      "ID",
      "Date Received",
      "Time Received",
      "Received By",
      "Phone No.",
      "Email ID",
      "Supplier",
      "Drug",
      "Order Qty",
      "Received Qty",
      "PO No.",
      "Receive Status",
    ];
    const row = [
      1,
      item?.id,
      item?.date,
      item?.time,
      item?.delivery_boy_name,
      item?.phone_no,
      item?.email,
      item?.po_supplier_name,
      item?.drug_tally?.[0]?.drug_name,
      item?.drug_tally?.[0]?.totalOrder,
      item?.drug_tally?.[0]?.orderReceived,
      item?.po_id_name,
      item?.purchase_Invoice_Received ? "Complete" : "Partial",
    ];
    const csvContent = [headers.join(","), row.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `goods_receive_${item?.po_id_name || "unknown"}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRowPdfDownload = (item) => {
    const doc = new jsPDF();
    doc.text(`Goods Receive - PO No: ${item?.po_id_name || "Unknown"}`, 14, 20);
    const tableColumn = [
      "Sr.No",
      "ID",
      "Date Received",
      "Time Received",
      "Received By",
      "Phone No.",
      "Email ID",
      "Supplier",
      "Drug",
      "Order Qty",
      "Received Qty",
      "PO No.",
      "Receive Status",
    ];
    const tableRows = [
      [
        1,
        item?.id,
        item?.date,
        item?.time,
        item?.delivery_boy_name,
        item?.phone_no,
        item?.email,
        item?.po_supplier_name,
        item?.drug_tally?.[0]?.drug_name,
        item?.drug_tally?.[0]?.totalOrder,
        item?.drug_tally?.[0]?.orderReceived,
        item?.po_id_name,
        item?.purchase_Invoice_Received ? "Complete" : "Partial",
      ],
    ];
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 123, 255] },
    });
    doc.save(`goods_receive_${item?.po_id_name || "unknown"}.pdf`);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Reports" breadcrumbItem="Goods Receive Report" />

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
                      Goods Receive Report (Complete Deliveries)
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
                    ) : filteredGoods.length > 0 ? (
                      <Row>
                        {filteredGoods.map((item) => (
                          <Col
                            xs="12"
                            sm="6"
                            lg="4"
                            key={item?.id}
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
                                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                                    }}
                                  >
                                    {item?.po_id_name
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
                                    PO: {item?.po_id_name || "N/A"}
                                  </CardTitle>
                                </div>
                                <CardText
                                  style={{ color: "#6c757d", fontSize: "14px" }}
                                >
                                  <div className="mb-2">
                                    <i className="bx bx-user me-2"></i>
                                    Received By:{" "}
                                    {item?.delivery_boy_name || "N/A"}
                                  </div>
                                  <div className="mb-2">
                                    <i className="bx bx-store me-2"></i>
                                    Supplier: {item?.po_supplier_name || "N/A"}
                                  </div>
                                  <div className="mb-2">
                                    <i className="bx bx-calendar me-2"></i>
                                    Date: {item?.date || "N/A"}
                                  </div>
                                  <div className="mb-2">
                                    <i className="bx bx-package me-2"></i>
                                    Drug:{" "}
                                    {item?.drug_tally?.[0]?.drug_name || "N/A"}
                                  </div>
                                  <div className="mb-2">
                                    <i className="bx bx-cart me-2"></i>
                                    Order Qty:{" "}
                                    {item?.drug_tally?.[0]?.totalOrder || "0"}
                                  </div>
                                  <div>
                                    <i className="bx bx-check-circle me-2"></i>
                                    Received Qty:{" "}
                                    {item?.drug_tally?.[0]?.orderReceived ||
                                      "0"}
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
                                    onClick={() => handleRowExcelDownload(item)}
                                    title="Download Excel"
                                  >
                                    <FaFileExcel style={{ fontSize: "16px" }} />
                                  </Button>
                                  <Button
                                    color="danger"
                                    size="sm"
                                    style={{
                                      borderRadius: "10px",
                                      background:
                                        "linear-gradient(45deg, #dc3545, #ff6b6b)",
                                      border: "none",
                                      padding: "8px 12px",
                                      boxShadow:
                                        "0 2px 8px rgba(220, 53, 69, 0.3)",
                                      transition: "all 0.3s ease",
                                    }}
                                    onClick={() => handleRowPdfDownload(item)}
                                    title="Download PDF"
                                  >
                                    <FaFilePdf style={{ fontSize: "16px" }} />
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
                            No complete goods deliveries found
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
          Filter Goods Receive Report
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
              <Label for="receiveStatus">Receive Status</Label>
              <Input
                type="select"
                name="receiveStatus"
                id="receiveStatus"
                value={filters.receiveStatus}
                onChange={handleFilterChange}
                className="input-modern"
              >
                <option value="">All Status</option>
                <option value="Partial">Partial</option>
                <option value="Complete">Complete</option>
              </Input>
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

export default GoodsReport;
