import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Input,
  FormGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { FaFileExcel, FaFilter } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getPurchaseReport,
  downloadPurchaseReportExcel,
} from "../../../ApiService/AccountingManagement/PurchaseReport";

const PurchaseReport = () => {
  const navigate = useNavigate();
  const [purchaseRecords, setPurchaseRecords] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    billNo: "",
    supplier: "",
  });
  const [tempFilters, setTempFilters] = useState({
    startDate: "",
    endDate: "",
    billNo: "",
    supplier: "",
  });
  const [downloading, setDownloading] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Toggle filter modal
  const toggleFilterModal = () => {
    setFilterModalOpen(!filterModalOpen);
    if (!filterModalOpen) {
      setTempFilters(filters);
    }
  };

  // Fetch data from API with filters and pagination
  useEffect(() => {
    const fetchPurchaseRecords = async () => {
      try {
        setLoading(true);
        const response = await getPurchaseReport(
          {
            start_date: filters.startDate,
            end_date: filters.endDate,
            invoice_no: filters.billNo,
            supplier_name: filters.supplier,
          },
          currentPage,
          pageSize
        );
        setPurchaseRecords(response?.results || []);
        setTotalCount(response?.count || 0);
        setLoading(false);
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error?.message || "Failed to fetch purchase records.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoading(false);
      }
    };

    fetchPurchaseRecords();
  }, [filters, currentPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setCurrentPage(1); // Reset to first page when applying filters
    setFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    setTempFilters({
      startDate: "",
      endDate: "",
      billNo: "",
      supplier: "",
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleExcelDownload = async () => {
    setDownloading(true);
    try {
      await downloadPurchaseReportExcel({
        start_date: filters.startDate,
        end_date: filters.endDate,
        invoice_no: filters.billNo,
        supplier_name: filters.supplier,
      });
      Swal.fire("Success!", "Excel file downloaded successfully.", "success");
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error?.message || "Failed to download Excel file.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setDownloading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(totalCount / pageSize)) {
      setCurrentPage(page);
    }
  };

  // Helper function to format numbers
  const formatNumber = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  document.title = "Purchase Report";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Purchase Management"
            breadcrumbItem="Purchase Report"
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
                      Purchase Report
                    </h4>
                    <div className="d-flex flex-wrap gap-2 align-items-center">
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
                        <FaFilter style={{ fontSize: "16px" }} />
                        Filter
                      </Button>
                      <Button
                        color="success"
                        onClick={handleExcelDownload}
                        disabled={downloading}
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
                        {downloading ? "Downloading..." : "Download"}
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

                  {/* Filter Modal */}
                  <Modal
                    isOpen={filterModalOpen}
                    toggle={toggleFilterModal}
                    centered
                    size="md"
                  >
                    <ModalHeader toggle={toggleFilterModal}>
                      Filter Purchase Records
                    </ModalHeader>
                    <ModalBody>
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <Label for="startDate">Start Date</Label>
                            <Input
                              type="date"
                              name="startDate"
                              id="startDate"
                              value={tempFilters.startDate}
                              onChange={handleFilterChange}
                              style={{
                                borderRadius: "8px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                padding: "8px",
                              }}
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <Label for="endDate">End Date</Label>
                            <Input
                              type="date"
                              name="endDate"
                              id="endDate"
                              value={tempFilters.endDate}
                              onChange={handleFilterChange}
                              style={{
                                borderRadius: "8px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                padding: "8px",
                              }}
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <Label for="billNo">Invoice No</Label>
                            <Input
                              type="text"
                              name="billNo"
                              id="billNo"
                              placeholder="Enter Invoice No"
                              value={tempFilters.billNo}
                              onChange={handleFilterChange}
                              style={{
                                borderRadius: "8px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                padding: "8px",
                              }}
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <Label for="supplier">Supplier</Label>
                            <Input
                              type="text"
                              name="supplier"
                              id="supplier"
                              placeholder="Enter Supplier"
                              value={tempFilters.supplier}
                              onChange={handleFilterChange}
                              style={{
                                borderRadius: "8px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                padding: "8px",
                              }}
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

                  <div className="table-container">
                    {loading ? (
                      <div className="text-center py-4">Loading...</div>
                    ) : purchaseRecords?.length === 0 ? (
                      <div className="text-center py-4">
                        No purchase records found.
                      </div>
                    ) : (
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
                            <th>Date</th>
                            <th>Bill No</th>
                            <th>Supplier</th>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Rate</th>
                            <th>GST</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {purchaseRecords.map((record, index) => {
                            const totalQty =
                              record?.drugs?.reduce(
                                (sum, d) => sum + (d?.quantity || 0),
                                0
                              ) || 0;
                            const totalAmount =
                              record?.drugs?.reduce(
                                (sum, d) => sum + (parseFloat(d?.amount) || 0),
                                0
                              ) || 0;
                            const rate = totalQty ? totalAmount / totalQty : 0;
                            return (
                              <tr key={record?.invoice_no}>
                                <td>
                                  {(currentPage - 1) * pageSize + index + 1}
                                </td>
                                <td>{record?.invoice_date || "N/A"}</td>
                                <td>{record?.invoice_no || "N/A"}</td>
                                <td>{record?.supplier_name || "N/A"}</td>
                                <td>{record?.drugs?.length || 0}</td>
                                <td>{totalQty}</td>
                                <td>₹{formatNumber(rate)}</td>
                                <td>₹{formatNumber(record?.total_GST || 0)}</td>
                                <td>
                                  ₹
                                  {formatNumber(
                                    record?.total_purchase_amount || 0
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    )}
                  </div>

                  {/* Pagination */}
                  {totalCount > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        Showing {(currentPage - 1) * pageSize + 1} to{" "}
                        {Math.min(currentPage * pageSize, totalCount)} of{" "}
                        {totalCount} entries
                      </div>
                      <div className="d-flex gap-2">
                        <Button
                          color="primary"
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          Previous
                        </Button>
                        <span className="align-self-center">
                          Page {currentPage} of{" "}
                          {Math.ceil(totalCount / pageSize)}
                        </span>
                        <Button
                          color="primary"
                          disabled={
                            currentPage === Math.ceil(totalCount / pageSize)
                          }
                          onClick={() => handlePageChange(currentPage + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
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

export default PurchaseReport;
