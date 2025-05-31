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
  Spinner,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { FaFilePdf, FaFilter } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { getTaxOutputs, downloadTaxOutputPdf } from "../../../ApiService/AccountingManagement/Gstr1";
import Swal from "sweetalert2";

const TaxOutputList = () => {
  const navigate = useNavigate();
  const [taxOutputs, setTaxOutputs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [pdfDownloading, setPdfDownloading] = useState(false);
  const [searchCustomerName, setSearchCustomerName] = useState("");
  const [searchInvoiceNo, setSearchInvoiceNo] = useState("");
  const [tempSearchCustomerName, setTempSearchCustomerName] = useState("");
  const [tempSearchInvoiceNo, setTempSearchInvoiceNo] = useState("");

  useEffect(() => {
    const fetchTaxOutputs = async () => {
      try {
        setLoading(true);
        const response = await getTaxOutputs(
          currentPage,
          pageSize,
          searchCustomerName,
          searchInvoiceNo
        );
        setTaxOutputs(response.results || []);
        setTotalCount(response.count || 0);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch tax outputs. Please try again later.");
        setLoading(false);
        Swal.fire({
          title: "Error!",
          text: err.message || "Failed to fetch tax outputs.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };
    fetchTaxOutputs();
  }, [currentPage, searchCustomerName, searchInvoiceNo]);

  const handleBack = () => {
    navigate(-1);
  };

  const toggleFilterModal = () => {
    setFilterModalOpen(!filterModalOpen);
    if (!filterModalOpen) {
      setTempSearchCustomerName(searchCustomerName);
      setTempSearchInvoiceNo(searchInvoiceNo);
    }
  };

  const togglePdfModal = () => {
    setPdfModalOpen(!pdfModalOpen);
    if (!pdfModalOpen) {
      setSelectedMonth("");
    }
  };

  const handleApplyFilters = () => {
    setSearchCustomerName(tempSearchCustomerName);
    setSearchInvoiceNo(tempSearchInvoiceNo);
    setCurrentPage(1);
    setFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    setTempSearchCustomerName("");
    setTempSearchInvoiceNo("");
  };

  const handlePdfDownload = async () => {
    if (!selectedMonth) {
      Swal.fire({
        title: "Error!",
        text: "Please select a month.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setPdfDownloading(true);
    try {
      const monthNumber = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ].indexOf(selectedMonth) + 1;

      await downloadTaxOutputPdf(monthNumber);
      Swal.fire({
        title: "Success!",
        text: "PDF downloaded successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      togglePdfModal();
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.message || "Failed to download PDF.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setPdfDownloading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Tax Management" breadcrumbItem="Tax Output List" />

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
                      Tax Output List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="danger"
                        onClick={togglePdfModal}
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
                        <FaFilePdf style={{ fontSize: "18px" }} />
                        Download PDF
                      </Button>
                      <Button
                        color="info"
                        onClick={toggleFilterModal}
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
                        title="Filter"
                      >
                        <FaFilter style={{ fontSize: "18px" }} />
                        Filter
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
                          <th>GST Invoice No.</th>
                          <th>Invoice Date</th>
                          <th>Customer Name</th>
                          <th>Customer GSTIN</th>
                          <th>Invoice Value</th>
                          <th>Taxable Value</th>
                          <th>Total CGST</th>
                          <th>Total SGST</th>
                          <th>Payment Mode</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="10" className="text-center">
                              <Spinner color="primary" />
                              <span className="ms-2">Loading tax outputs...</span>
                            </td>
                          </tr>
                        ) : error ? (
                          <tr>
                            <td colSpan="10" className="text-center text-danger">
                              {error}
                            </td>
                          </tr>
                        ) : taxOutputs.length === 0 ? (
                          <tr>
                            <td colSpan="10" className="text-center">
                              No tax outputs found.
                            </td>
                          </tr>
                        ) : (
                          taxOutputs.map((record, index) => (
                            <tr key={record.gst_invoice_no}>
                              <td>{(currentPage - 1) * pageSize + index + 1}</td>
                              <td>{record.gst_invoice_no || "N/A"}</td>
                              <td>{record.invoice_date || "N/A"}</td>
                              <td>{record.customer_name || "N/A"}</td>
                              <td>{record.customer_gstin || "N/A"}</td>
                              <td>₹{parseFloat(record.invoice_value || 0).toFixed(2)}</td>
                              <td>₹{parseFloat(record.taxable_value || 0).toFixed(2)}</td>
                              <td>₹{parseFloat(record.total_cgst || 0).toFixed(2)}</td>
                              <td>₹{parseFloat(record.total_sgst || 0).toFixed(2)}</td>
                              <td>{record.payment_mode || "N/A"}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>

                    {!loading && !error && taxOutputs.length > 0 && (
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <div>
                          Showing {(currentPage - 1) * pageSize + 1} to{" "}
                          {Math.min(currentPage * pageSize, totalCount)} of{" "}
                          {totalCount} items
                        </div>
                        <div className="d-flex gap-2">
                          <Button
                            color="primary"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                          >
                            Previous
                          </Button>
                          <span className="align-self-center">
                            Page {currentPage} of {totalPages}
                          </span>
                          <Button
                            color="primary"
                            disabled={currentPage === totalPages || totalCount === 0}
                            onClick={() => setCurrentPage(currentPage + 1)}
                          >
                            Next
                          </Button>
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
        isOpen={filterModalOpen}
        toggle={toggleFilterModal}
        centered
        size="md"
      >
        <ModalHeader toggle={toggleFilterModal}>Filter Tax Outputs</ModalHeader>
        <ModalBody>
          <Row>
            <Col md="12">
              <FormGroup>
                <Label for="searchCustomerName">Customer Name</Label>
                <Input
                  type="text"
                  id="searchCustomerName"
                  placeholder="Enter customer name"
                  value={tempSearchCustomerName}
                  onChange={(e) => setTempSearchCustomerName(e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md="12">
              <FormGroup>
                <Label for="searchInvoiceNo">GST Invoice No.</Label>
                <Input
                  type="text"
                  id="searchInvoiceNo"
                  placeholder="Enter GST invoice number"
                  value={tempSearchInvoiceNo}
                  onChange={(e) => setTempSearchInvoiceNo(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={handleClearFilters}
            style={{
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            Clear
          </Button>
          <Button
            color="primary"
            onClick={handleApplyFilters}
            style={{
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            Apply Filters
          </Button>
        </ModalFooter>
      </Modal>

      {/* PDF Download Modal */}
      <Modal
        isOpen={pdfModalOpen}
        toggle={togglePdfModal}
        centered
        size="sm"
      >
        <ModalHeader toggle={togglePdfModal}>Download PDF</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="selectMonth">Select Month</Label>
            <Input
              type="select"
              id="selectMonth"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">Select a month</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </Input>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={togglePdfModal}
            style={{
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handlePdfDownload}
            disabled={pdfDownloading || !selectedMonth}
            style={{
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            {pdfDownloading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Downloading...
              </>
            ) : (
              "Download"
            )}
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

export default TaxOutputList;