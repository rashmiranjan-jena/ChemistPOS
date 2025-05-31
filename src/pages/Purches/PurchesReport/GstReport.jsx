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
import { FaFilePdf, FaFileExcel, FaFilter } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getGoodsData } from "../../../ApiService/Purchase/PurchesGstReport";

const GstReport = () => {
  const navigate = useNavigate();
  const [gstData, setGstData] = useState([]);
  const [filteredGstData, setFilteredGstData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterModal, setFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    invoiceNo: "",
    customer: "",
    startDate: "",
    endDate: "",
  });

  const fetchGstData = async () => {
    try {
      const response = await getGoodsData();
      const formattedData =
        response?.map((item) => ({
          id: item.id || Math.random().toString(36).substr(2, 9),
          invoiceNo: item.invoice_no || "N/A",
          supplierName: item.supplier_name || "N/A",
          gstin: item.supplier_GSTIN || "N/A",
          invoiceDate: item.invoice_date || "N/A",
          totalPurchaseAmount: item.total_purchase_amount || 0,
          totalGst: item.total_GST || 0,
        })) || [];
      setGstData(formattedData);
      setFilteredGstData(formattedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching GST data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGstData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const filtered = gstData.filter((item) => {
      const invoiceDate = new Date(item.invoiceDate);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;

      return (
        (!filters.invoiceNo ||
          item.invoiceNo
            .toLowerCase()
            .includes(filters.invoiceNo.toLowerCase())) &&
        (!filters.customer ||
          item.supplierName
            .toLowerCase()
            .includes(filters.customer.toLowerCase())) &&
        (!startDate || invoiceDate >= startDate) &&
        (!endDate || invoiceDate <= endDate)
      );
    });

    setFilteredGstData(filtered);
    toggleFilterModal();
  };

  const resetFilters = () => {
    setFilters({
      invoiceNo: "",
      customer: "",
      startDate: "",
      endDate: "",
    });
    setFilteredGstData(gstData);
    toggleFilterModal();
  };

  const toggleFilterModal = () => {
    setFilterModal(!filterModal);
  };

  const totalGst = filteredGstData.reduce(
    (sum, item) => sum + (item.totalGst || 0),
    0
  );
  const totalAmount = filteredGstData.reduce(
    (sum, item) => sum + (item.totalPurchaseAmount || 0),
    0
  );

  const handleBack = () => navigate(-1);

  const handleExcelDownload = () => {
    const headers = [
      "Sr.No",
      "Invoice No",
      "Supplier Name",
      "Supplier GSTIN",
      "Invoice Date",
      "Total Purchase Amount",
      "Total GST",
    ];
    const rows = filteredGstData.map((item, index) => [
      index + 1,
      item.invoiceNo,
      item.supplierName,
      item.gstin,
      item.invoiceDate,
      item.totalPurchaseAmount,
      item.totalGst,
    ]);
    const totalRow = [
      "",
      "",
      "",
      "",
      "Total",
      totalAmount.toFixed(2),
      totalGst.toFixed(2),
    ];
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
      totalRow.join(","),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "gst_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePdfDownload = () => {
    const doc = new jsPDF();
    doc.text("GST Report", 14, 20);
    const tableColumn = [
      "Sr.No",
      "Invoice No",
      "Supplier Name",
      "Supplier GSTIN",
      "Invoice Date",
      "Total Purchase Amount",
      "Total GST",
    ];
    const tableRows = filteredGstData.map((item, index) => [
      index + 1,
      item.invoiceNo,
      item.supplierName,
      item.gstin,
      item.invoiceDate,
      item.totalPurchaseAmount,
      item.totalGst,
    ]);
    const totalRow = [
      "",
      "",
      "",
      "",
      "Total",
      totalAmount.toFixed(2),
      totalGst.toFixed(2),
    ];
    doc.autoTable({
      head: [tableColumn],
      body: [...tableRows, totalRow],
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 123, 255] },
    });
    doc.save("gst_report.pdf");
  };

  const handleRowExcelDownload = (item) => {
    const headers = [
      "Sr.No",
      "Invoice No",
      "Supplier Name",
      "Supplier GSTIN",
      "Invoice Date",
      "Total Purchase Amount",
      "Total GST",
    ];
    const row = [
      1,
      item.invoiceNo,
      item.supplierName,
      item.gstin,
      item.invoiceDate,
      item.totalPurchaseAmount,
      item.totalGst,
    ];
    const csvContent = [headers.join(","), row.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `gst_${item.invoiceNo}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRowPdfDownload = (item) => {
    const doc = new jsPDF();
    doc.text(`GST Invoice - Invoice No: ${item.invoiceNo}`, 14, 20);
    const tableColumn = [
      "Sr.No",
      "Invoice No",
      "Supplier Name",
      "Supplier GSTIN",
      "Invoice Date",
      "Total Purchase Amount",
      "Total GST",
    ];
    const tableRows = [
      [
        1,
        item.invoiceNo,
        item.supplierName,
        item.gstin,
        item.invoiceDate,
        item.totalPurchaseAmount,
        item.totalGst,
      ],
    ];
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 123, 255] },
    });
    doc.save(`gst_${item.invoiceNo}.pdf`);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Reports" breadcrumbItem="GST Report" />

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
                      GST Report
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
                        color="success"
                        onClick={handleExcelDownload}
                        style={{
                          borderRadius: "10px",
                          background:
                            "linear-gradient(45deg, #28a745, #20c997)",
                          border: "none",
                          padding: "8px 12px",
                          boxShadow: "0 4px 12px rgba(40, 167, 69, 0.3)",
                          transition: "transform 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                        className="hover-scale"
                      >
                        <FaFileExcel style={{ fontSize: "16px" }} />
                        Excel
                      </Button>
                      <Button
                        color="danger"
                        onClick={handlePdfDownload}
                        style={{
                          borderRadius: "10px",
                          background:
                            "linear-gradient(45deg, #dc3545, #ff6b6b)",
                          border: "none",
                          padding: "8px 12px",
                          boxShadow: "0 4px 12px rgba(220, 53, 69, 0.3)",
                          transition: "transform 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                        className="hover-scale"
                      >
                        <FaFilePdf style={{ fontSize: "16px" }} />
                        PDF
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
                    ) : filteredGstData.length > 0 ? (
                      <Row>
                        {filteredGstData.map((item) => (
                          <Col
                            xs="12"
                            sm="6"
                            lg="4"
                            key={item.id}
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
                                    {item.invoiceNo
                                      .substring(0, 2)
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
                                    Invoice: {item.invoiceNo}
                                  </CardTitle>
                                </div>
                                <CardText
                                  style={{ color: "#6c757d", fontSize: "14px" }}
                                >
                                  <div className="mb-2">
                                    <i className="bx bx-store me-2"></i>
                                    Supplier: {item.supplierName}
                                  </div>
                                  <div className="mb-2">
                                    <i className="bx bx-id-card me-2"></i>
                                    GSTIN: {item.gstin}
                                  </div>
                                  <div className="mb-2">
                                    <i className="bx bx-calendar me-2"></i>
                                    Date: {item.invoiceDate}
                                  </div>
                                  <div className="mb-2">
                                    <i className="bx bx-dollar me-2"></i>
                                    Total Amount: ₹
                                    {item.totalPurchaseAmount.toFixed(2)}
                                  </div>
                                  <div>
                                    <i className="bx bx-calculator me-2"></i>
                                    Total GST: ₹{item.totalGst.toFixed(2)}
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
                            No GST data found
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Totals Display */}
                  {filteredGstData.length > 0 && (
                    <Row className="mt-4">
                      <Col xs="12">
                        <Card
                          className="shadow-sm"
                          style={{
                            borderRadius: "15px",
                            background: "#fff",
                          }}
                        >
                          <CardBody className="p-4">
                            <Row>
                              <Col md="6">
                                <h5
                                  style={{
                                    fontWeight: "600",
                                    color: "#2c3e50",
                                  }}
                                >
                                  Total Purchase Amount: ₹
                                  {totalAmount.toFixed(2)}
                                </h5>
                              </Col>
                              <Col md="6" className="text-md-end">
                                <h5
                                  style={{
                                    fontWeight: "600",
                                    color: "#2c3e50",
                                  }}
                                >
                                  Total GST: ₹{totalGst.toFixed(2)}
                                </h5>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  )}
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
        <ModalHeader toggle={toggleFilterModal}>Filter GST Report</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="invoiceNo">Invoice No.</Label>
              <Input
                type="text"
                name="invoiceNo"
                id="invoiceNo"
                placeholder="Enter Invoice No."
                value={filters.invoiceNo}
                onChange={handleFilterChange}
                className="input-modern"
              />
            </FormGroup>
            <FormGroup>
              <Label for="customer">Supplier</Label>
              <Input
                type="text"
                name="customer"
                id="customer"
                placeholder="Enter Supplier Name"
                value={filters.customer}
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

export default GstReport;
