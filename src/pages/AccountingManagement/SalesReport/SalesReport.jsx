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
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { getSalesReport } from "../../../ApiService/AccountingManagement/SalesReport";

const SalesReport = () => {
  const navigate = useNavigate();
  const [salesRecords, setSalesRecords] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    invoiceNo: "",
    customer: "",
  });
  const [downloading, setDownloading] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [productModal, setProductModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const recordsPerPage = 10;

  // Toggle filter modal
  const toggleFilterModal = () => setFilterModal(!filterModal);

  // Toggle product details modal
  const toggleProductModal = (order = null) => {
    setSelectedOrder(order);
    setProductModal(!productModal);
  };

  // Fetch sales data
  const fetchSalesData = async (page = 1, appliedFilters = filters) => {
    try {
      setLoading(true);
      const response = await getSalesReport(appliedFilters, page);
      setSalesRecords(response?.results || []);
      setTotalCount(response?.count || 0);
      setCurrentPage(page);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch sales data.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchSalesData(1);
  }, []);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    fetchSalesData(1, filters); // Fetch data with filters, reset to page 1
    toggleFilterModal();
  };

  // Reset filters
  const resetFilters = () => {
    const defaultFilters = {
      startDate: "",
      endDate: "",
      invoiceNo: "",
      customer: "",
    };
    setFilters(defaultFilters);
    fetchSalesData(1, defaultFilters); // Fetch data without filters
    toggleFilterModal();
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(totalCount / recordsPerPage)) {
      fetchSalesData(page);
    }
  };

  // Handle Excel download
  const handleExcelDownload = async () => {
    setDownloading(true);
    try {
      // Fetch all data for Excel (optional: you can limit to current page)
      let allRecords = [];
      const totalPages = Math.ceil(totalCount / recordsPerPage);
      for (let page = 1; page <= totalPages; page++) {
        const response = await getSalesReport(filters, page);
        allRecords = [...allRecords, ...(response?.results || [])];
      }

      // Prepare data for Excel
      const worksheetData = allRecords.map((record, index) => ({
        "Sr.No": index + 1,
        Date: new Date(record?.created_at).toLocaleDateString(),
        "Invoice No": record?.order_id,
        Customer: record?.customer_id?.customer_name,
        Item: record?.product_details?.map((item) => item?.name).join(", "),
        Qty: record?.total_quantity,
        Rate: `₹${parseFloat(
          record?.product_details?.[0]?.selling_price || 0
        ).toFixed(2)}`,
        GST: record?.tax_details?.[0]
          ? `${(
              (record?.tax_details?.[0]?.cgst || 0) +
              (record?.tax_details?.[0]?.sgst || 0)
            ).toFixed(2)}%`
          : "0.00%",
        Total: `₹${parseFloat(record?.total_bill_amount || 0).toFixed(2)}`,
      }));

      // Create worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");

      // Download Excel file
      XLSX.writeFile(workbook, "Sales_Report.xlsx");
      Swal.fire("Success!", "Excel file downloaded successfully.", "success");
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to download Excel file.",
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

  // Handle back button
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Sales Management" breadcrumbItem="Sales Report" />

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
                      Sales Report
                    </h4>
                    <div className="d-flex flex-wrap gap-2 align-items-center">
                      <Button
                        color="primary"
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
                      >
                        <FaFilter style={{ fontSize: "18px" }} />
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
                  <Modal isOpen={filterModal} toggle={toggleFilterModal}>
                    <ModalHeader toggle={toggleFilterModal}>
                      Filter Sales Records
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
                              value={filters.startDate}
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
                              value={filters.endDate}
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
                            <Label for="invoiceNo">Invoice No</Label>
                            <Input
                              type="text"
                              name="invoiceNo"
                              id="invoiceNo"
                              placeholder="Enter Invoice No"
                              value={filters.invoiceNo}
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
                            <Label for="customer">Customer</Label>
                            <Input
                              type="text"
                              name="customer"
                              id="customer"
                              placeholder="Enter Customer"
                              value={filters.customer}
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
                      <Button color="secondary" onClick={resetFilters}>
                        Reset
                      </Button>
                      <Button color="primary" onClick={applyFilters}>
                        Apply Filters
                      </Button>
                    </ModalFooter>
                  </Modal>

                  {/* Product Details Modal */}
                  <Modal
                    isOpen={productModal}
                    toggle={() => toggleProductModal()}
                  >
                    <ModalHeader toggle={() => toggleProductModal()}>
                      Product Details for Order {selectedOrder?.order_id}
                    </ModalHeader>
                    <ModalBody>
                      {selectedOrder?.product_details?.length > 0 ? (
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
                              <th>Name</th>
                              <th>Quantity</th>
                              <th>Selling Price</th>
                              <th>Discount</th>
                              <th>CGST</th>
                              <th>SGST</th>
                              <th>Total MRP</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedOrder?.product_details?.map(
                              (item, index) => (
                                <tr key={index}>
                                  <td>{item?.name || "N/A"}</td>
                                  <td>{item?.quantity || 0}</td>
                                  <td>
                                    ₹{formatNumber(item?.selling_price || 0)}
                                  </td>
                                  <td>{item?.discount || 0}%</td>
                                  <td>{item?.cgst || 0}%</td>
                                  <td>{item?.sgst || 0}%</td>
                                  <td>₹{formatNumber(item?.totalMrp || 0)}</td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </Table>
                      ) : (
                        <div className="text-center py-4">
                          No product details available.
                        </div>
                      )}
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="secondary"
                        onClick={() => toggleProductModal()}
                      >
                        Close
                      </Button>
                    </ModalFooter>
                  </Modal>

                  <div className="table-container">
                    {loading ? (
                      <div className="text-center py-4">Loading...</div>
                    ) : salesRecords?.length === 0 ? (
                      <div className="text-center py-4">
                        No sales records found.
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
                            <th>Invoice No</th>
                            <th>Customer</th>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Rate</th>
                            <th>GST</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {salesRecords.map((record, index) => (
                            <tr key={record?.order_id}>
                              <td>
                                {(currentPage - 1) * recordsPerPage + index + 1}
                              </td>
                              <td>
                                {new Date(
                                  record?.created_at
                                ).toLocaleDateString()}
                              </td>
                              <td>{record?.order_id}</td>
                              <td>{record?.customer_id?.customer_name}</td>
                              <td>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    toggleProductModal(record);
                                  }}
                                  style={{
                                    color: "#007bff",
                                    textDecoration: "underline",
                                  }}
                                >
                                  Click here to show item details
                                </a>
                              </td>
                              <td>{record?.total_quantity}</td>
                              <td>
                                ₹
                                {formatNumber(
                                  record?.product_details?.[0]?.selling_price ||
                                    0
                                )}
                              </td>
                              <td>
                                {record?.tax_details?.[0]
                                  ? `${(
                                      (record?.tax_details?.[0]?.cgst || 0) +
                                      (record?.tax_details?.[0]?.sgst || 0)
                                    ).toFixed(2)}%`
                                  : "0.00%"}
                              </td>
                              <td>
                                ₹{formatNumber(record?.total_bill_amount || 0)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </div>

                  {/* Pagination */}
                  {totalCount > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        Showing {(currentPage - 1) * recordsPerPage + 1} to{" "}
                        {Math.min(currentPage * recordsPerPage, totalCount)} of{" "}
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
                          {Math.ceil(totalCount / recordsPerPage)}
                        </span>
                        <Button
                          color="primary"
                          disabled={
                            currentPage ===
                            Math.ceil(totalCount / recordsPerPage)
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

export default SalesReport;
