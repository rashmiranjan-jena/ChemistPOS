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
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { FaFileExcel, FaFilter } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  getStockInventoryReport,
  downloadStockInventoryReportExcel,
} from "../../../ApiService/AccountingManagement/StockInventoryReport";

const StockInventoryReport = () => {
  const navigate = useNavigate();
  const [stockRecords, setStockRecords] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    item: "",
    batch: "",
  });
  const [tempFilters, setTempFilters] = useState({
    startDate: "",
    endDate: "",
    item: "",
    batch: "",
  });
  const [downloading, setDownloading] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const recordsPerPage = 10;

  // Toggle filter modal
  const toggleFilterModal = () => {
    setFilterModalOpen(!filterModalOpen);
    if (!filterModalOpen) {
      setTempFilters(filters);
    }
  };

  // Fetch data from API with filters and pagination
  const fetchStockRecords = async (page = 1, appliedFilters = filters) => {
    try {
      setLoading(true);
      const response = await getStockInventoryReport({
        start_date: appliedFilters.startDate,
        end_date: appliedFilters.endDate,
        drug_name: appliedFilters.item,
        batch_no: appliedFilters.batch,
        page,
        page_size: recordsPerPage,
      });
      setStockRecords(response?.data || []);
      setTotalItems(response?.total_items || 0);
      setCurrentPage(page);
      setLoading(false);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error?.message || "Failed to fetch stock inventory records.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchStockRecords(1);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setFilterModalOpen(false);
    fetchStockRecords(1, tempFilters); // Reset to page 1 when applying filters
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      startDate: "",
      endDate: "",
      item: "",
      batch: "",
    };
    setTempFilters(defaultFilters);
    setFilters(defaultFilters);
    fetchStockRecords(1, defaultFilters); // Reset filters and fetch data
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(totalItems / recordsPerPage)) {
      fetchStockRecords(page);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleExcelDownload = async () => {
    setDownloading(true);
    try {
      await downloadStockInventoryReportExcel({
        start_date: filters.startDate,
        end_date: filters.endDate,
        drug_name: filters.item,
        batch_no: filters.batch,
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

  // Helper function to format numbers
  const formatNumber = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  document.title = "Stock Inventory Report";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Inventory Management"
            breadcrumbItem="Stock Inventory Report"
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
                      Stock Inventory Report
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
                      Filter Stock Inventory Records
                    </ModalHeader>
                    <ModalBody>
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <Label for="startDate">Expiry Start Date</Label>
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
                            <Label for="endDate">Expiry End Date</Label>
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
                            <Label for="item">Item</Label>
                            <Input
                              type="text"
                              name="item"
                              id="item"
                              placeholder="Enter Item"
                              value={tempFilters.item}
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
                            <Label for="batch">Batch</Label>
                            <Input
                              type="text"
                              name="batch"
                              id="batch"
                              placeholder="Enter Batch"
                              value={tempFilters.batch}
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
                    ) : stockRecords?.length === 0 ? (
                      <div className="text-center py-4">
                        No stock records found.
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
                            <th>Item</th>
                            <th>Batch</th>
                            <th>Expiry</th>
                            <th>Qty</th>
                            <th>Purchase Rate</th>
                            <th>Sale Rate</th>
                            <th>Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stockRecords?.map((record, index) => {
                            const calVal =
                              (parseFloat(record?.mrp) || 0) -
                              (parseFloat(record?.rate) || 0);
                            const value = calVal * (record?.quantity ?? 0);
                            return (
                              <tr key={`${record?.id || "no-id"}-${index}`}>
                                <td>
                                  {(currentPage - 1) * recordsPerPage +
                                    index +
                                    1}
                                </td>
                                <td>{record?.drug_id?.drug_name || "N/A"}</td>
                                <td>{record?.batch_no || "N/A"}</td>
                                <td>{record?.expire_date || "N/A"}</td>
                                <td>{record?.quantity ?? 0}</td>
                                <td>₹{formatNumber(record?.rate)}</td>
                                <td>₹{formatNumber(record?.mrp)}</td>
                                <td>₹{formatNumber(value)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    )}
                  </div>

                  {/* Pagination */}
                  {totalItems > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        Showing {(currentPage - 1) * recordsPerPage + 1} to{" "}
                        {Math.min(currentPage * recordsPerPage, totalItems)} of{" "}
                        {totalItems} entries
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
                          {Math.ceil(totalItems / recordsPerPage)}
                        </span>
                        <Button
                          color="primary"
                          disabled={
                            currentPage ===
                            Math.ceil(totalItems / recordsPerPage)
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

export default StockInventoryReport;
