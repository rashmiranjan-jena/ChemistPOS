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
  Table,
} from "reactstrap";
import { FaFileExcel, FaEye, FaFilter } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { getInvoices } from "../../../ApiService/Purchase/PurchesInvoice";

const InvoiceReport = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterModal, setFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    invoiceNo: "",
    supplier: "",
    status: "",
    startDate: "",
    endDate: "",
  });
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await getInvoices();
        setInvoices(response || []);
        setFilteredInvoices(response || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const filtered = invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice?.invoice_date);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;

      return (
        (!filters.invoiceNo ||
          invoice?.invoice_no
            ?.toLowerCase()
            ?.includes(filters.invoiceNo.toLowerCase())) &&
        (!filters.supplier ||
          invoice?.supplier_name
            ?.toLowerCase()
            ?.includes(filters.supplier.toLowerCase())) &&
        (filters.status === "" ||
          invoice?.status.toString() === filters.status) &&
        (!startDate || invoiceDate >= startDate) &&
        (!endDate || invoiceDate <= endDate)
      );
    });

    setFilteredInvoices(filtered);
    toggleFilterModal();
  };

  const resetFilters = () => {
    setFilters({
      invoiceNo: "",
      supplier: "",
      status: "",
      startDate: "",
      endDate: "",
    });
    setFilteredInvoices(invoices);
    toggleFilterModal();
  };

  const toggleFilterModal = () => {
    setFilterModal(!filterModal);
  };

  const handleBack = () => navigate(-1);

  const handleRowExcelDownload = (invoice) => {
    const headers = [
      "Sr.No",
      "Invoice Date",
      "Invoice Time",
      "Supplier Name",
      "Supplier Email",
      "Supplier Contact",
      "Invoice No.",
      "Total Amount",
      "Status",
      "Due Date",
    ];
    const row = [
      1,
      invoice?.invoice_date,
      invoice?.invoice_time,
      invoice?.supplier_name,
      invoice?.supplier_email,
      invoice?.supplier_contact,
      invoice?.invoice_no,
      invoice?.total_purchase_amount,
      invoice?.status ? "Paid" : "Pending",
      invoice?.due_date,
    ];
    const csvContent = [headers.join(","), row.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `invoice_${invoice?.invoice_no || "unknown"}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDrugDetailsExcelDownload = (invoice) => {
    const headers = ["Drug Name", "Quantity", "Free Drug", "Amount"];
    const rows = invoice.drugs.map((drug, index) => [
      drug.drug_name || "N/A",
      drug.quantity || "0",
      drug.freeDrug ?? "0",
      parseFloat(drug.amount || "0").toFixed(2),
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `drug_details_${invoice?.invoice_no || "unknown"}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleDetailsModal = () => setDetailsModal(!detailsModal);

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    toggleDetailsModal();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Reports" breadcrumbItem="Invoice Report" />

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
                      Invoice Report
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
                    ) : filteredInvoices.length > 0 ? (
                      <Row>
                        {filteredInvoices.map((invoice) => (
                          <Col
                            xs="12"
                            sm="6"
                            lg="4"
                            key={invoice?.invoice_no}
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
                                    {invoice?.invoice_no
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
                                    Invoice: {invoice?.invoice_no || "N/A"}
                                  </CardTitle>
                                </div>
                                <CardText
                                  style={{ color: "#6c757d", fontSize: "14px" }}
                                >
                                  <div className="mb-2">
                                    <i className="bx bx-store me-2"></i>
                                    Supplier: {invoice?.supplier_name || "N/A"}
                                  </div>
                                  <div className="mb-2">
                                    <i className="bx bx-calendar me-2"></i>
                                    Date: {invoice?.invoice_date || "N/A"}
                                  </div>
                                  <div className="mb-2">
                                    <i className="bx bx-rupee me-2"></i>
                                    Total Amount: ₹
                                    {invoice?.total_purchase_amount?.toFixed(
                                      2
                                    ) || "0.00"}
                                  </div>
                                  <div>
                                    <i className="bx bx-check-circle me-2"></i>
                                    Status:{" "}
                                    {invoice?.status ? "Paid" : "Pending"}
                                  </div>
                                </CardText>
                                <div className="d-flex gap-2 justify-content-end mt-4">
                                  <Button
                                    color="info"
                                    size="sm"
                                    style={{
                                      borderRadius: "10px",
                                      background:
                                        "linear-gradient(45deg, #17a2b8, #00c4cc)",
                                      border: "none",
                                      padding: "8px 12px",
                                      boxShadow:
                                        "0 2px 8px rgba(23, 162, 184, 0.3)",
                                      transition: "all 0.3s ease",
                                    }}
                                    onClick={() => handleViewDetails(invoice)}
                                    title="View Details"
                                  >
                                    <FaEye style={{ fontSize: "16px" }} />
                                  </Button>
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
                                      handleRowExcelDownload(invoice)
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
                            No invoices found
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

      {/* Filter Modal */}
      <Modal
        isOpen={filterModal}
        toggle={toggleFilterModal}
        centered
        className="modal-modern"
      >
        <ModalHeader toggle={toggleFilterModal}>Filter Invoices</ModalHeader>
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
              <Label for="status">Status</Label>
              <Input
                type="select"
                name="status"
                id="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="input-modern"
              >
                <option value="">All Statuses</option>
                <option value="true">Paid</option>
                <option value="false">Pending</option>
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

      {/* Modal for Invoice Details */}
      <Modal isOpen={detailsModal} toggle={toggleDetailsModal} size="lg">
        <ModalHeader
          toggle={toggleDetailsModal}
          style={{
            background: "linear-gradient(45deg, #007bff, #00c4cc)",
            color: "#fff",
          }}
        >
          Invoice Details: {selectedInvoice?.invoice_no || "N/A"}
        </ModalHeader>
        <ModalBody>
          {selectedInvoice && (
            <div>
              <Row>
                <Col md={6}>
                  <p>
                    <strong>Supplier Name:</strong>{" "}
                    {selectedInvoice.supplier_name || "N/A"}
                  </p>
                  <p>
                    <strong>Supplier Email:</strong>{" "}
                    {selectedInvoice.supplier_email || "N/A"}
                  </p>
                  <p>
                    <strong>Supplier Contact:</strong>{" "}
                    {selectedInvoice.supplier_contact || "N/A"}
                  </p>
                  <p>
                    <strong>Invoice Date:</strong>{" "}
                    {selectedInvoice.invoice_date || "N/A"}
                  </p>
                  <p>
                    <strong>Invoice Time:</strong>{" "}
                    {selectedInvoice.invoice_time || "N/A"}
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Due Date:</strong>{" "}
                    {selectedInvoice.due_date || "N/A"}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {selectedInvoice.status ? "Paid" : "Pending"}
                  </p>
                  <p>
                    <strong>Total GST:</strong> ₹
                    {selectedInvoice.total_GST?.toFixed(2) || "0.00"}
                  </p>
                  <p>
                    <strong>Total Purchase Amount:</strong> ₹
                    {selectedInvoice.total_purchase_amount?.toFixed(2) ||
                      "0.00"}
                  </p>
                </Col>
              </Row>
              <h5 className="mt-4 mb-3">Drug Details</h5>
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  overflowX: "auto",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Table bordered responsive>
                  <thead
                    style={{
                      background: "#f8f9fa",
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    <tr>
                      <th>Drug Name</th>
                      <th>Quantity</th>
                      <th>Free Drug</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.drugs &&
                    selectedInvoice.drugs.length > 0 ? (
                      selectedInvoice.drugs.map((drug, index) => (
                        <tr key={index}>
                          <td>{drug.drug_name || "N/A"}</td>
                          <td>{drug.quantity || "0"}</td>
                          <td>{drug.freeDrug ?? "0"}</td>
                          <td>₹{parseFloat(drug.amount || "0").toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No drugs found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={() => handleDrugDetailsExcelDownload(selectedInvoice)}
            style={{
              borderRadius: "10px",
              background: "linear-gradient(45deg, #28a745, #20c997)",
              border: "none",
              marginRight: "10px",
            }}
            disabled={
              !selectedInvoice?.drugs || selectedInvoice?.drugs.length === 0
            }
          >
            <FaFileExcel style={{ marginRight: "5px" }} /> Download Drug Details
          </Button>
          <Button
            color="secondary"
            onClick={toggleDetailsModal}
            style={{
              borderRadius: "10px",
              background: "linear-gradient(45deg, #6c757d, #adb5bd)",
              border: "none",
            }}
          >
            Close
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

export default InvoiceReport;
