import React, { useState, useEffect, useRef } from "react";
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
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import {
  FaEye,
  FaFileExcel,
  FaFilePdf,
  FaFilter,
  FaUpload,
} from "react-icons/fa";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  getSalesHandler,
  uploadPrescription,
} from "../../ApiService/DrugsOrderManagement/DrugOrderManagement";
import Swal from "sweetalert2";

const DrugOrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);
  const [filterCustomerName, setFilterCustomerName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [tempFilterCustomerName, setTempFilterCustomerName] = useState("");
  const [tempFilterStatus, setTempFilterStatus] = useState("");
  const [filterModal, setFilterModal] = useState(false);
  const fileInputRefs = useRef({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getSalesHandler(currentPage, pageSize, {
          customer_name: filterCustomerName,
        });
        setOrders(response.results || []);
        setTotalCount(response.count || 0);
        setLoading(false);
      } catch (err) {
        setError(
          err.message || "Failed to fetch orders. Please try again later."
        );
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentPage, filterCustomerName, filterStatus]);

  const toggleModal = () => setModal(!modal);

  const toggleFilterModal = () => {
    setFilterModal(!filterModal);
    if (!filterModal) {
      setTempFilterCustomerName(filterCustomerName);
      setTempFilterStatus(filterStatus);
    }
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    toggleModal();
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleApplyFilters = () => {
    setFilterCustomerName(tempFilterCustomerName);
    setFilterStatus(tempFilterStatus);
    setCurrentPage(1);
    setFilterModal(false);
  };

  const handleClearFilters = () => {
    setTempFilterCustomerName("");
    setTempFilterStatus("");
  };

  const handleExcelDownload = () => {
    const headers = [
      "Sr.No",
      "Order ID",
      "Order Date",
      "Customer",
      "Total Amount",
      "Status",
      "Items",
      "Prescription No",
    ];
    const rows = orders.map((order, index) => [
      index + 1,
      order.order_id,
      new Date(order.created_at).toLocaleDateString(),
      order.customer_id?.customer_name || "N/A",
      parseFloat(order.total_bill_amount || 0).toFixed(2),
      order.bill_type,
      order.product_details?.map((item) => item.name).join(", ") || "N/A",
      order.prescription_no || "N/A",
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "all_orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePdfDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("All Orders Report", 14, 22);

    const tableColumn = [
      "Sr.No",
      "Order ID",
      "Order Date",
      "Customer",
      "Total Amount",
      "Status",
      "Items",
      "Prescription No",
    ];
    const tableRows = orders.map((order, index) => [
      index + 1,
      order.order_id,
      new Date(order.created_at).toLocaleDateString(),
      order.customer_id?.customer_name || "N/A",
      parseFloat(order.total_bill_amount || 0).toFixed(2),
      order.bill_type,
      order.product_details?.map((item) => item.name).join(", ") || "N/A",
      order.prescription_no || "N/A",
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [0, 123, 255], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      columnStyles: { 6: { cellWidth: 50 }, 7: { cellWidth: 30 } },
    });

    doc.save("all_orders.pdf");
  };

  const handlePrescriptionUpload = async (orderId, file) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("prescription_upload", file);
      formData.append("order_id", String(orderId)); // Ensure order_id is a string

      await uploadPrescription(orderId, formData);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Prescription uploaded successfully!",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-primary",
        },
        buttonsStyling: false,
      });

      // Refresh orders to reflect updated prescription data
      const updatedResponse = await getSalesHandler(currentPage, pageSize, {
        customer_name: filterCustomerName,
      });
      setOrders(updatedResponse.results || []);
      setTotalCount(updatedResponse.count || 0);
    } catch (err) {
      console.error("Upload failed:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to upload prescription. Please try again.",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-danger",
        },
        buttonsStyling: false,
      });
    }
  };

  const triggerFileInput = (orderId) => {
    if (fileInputRefs.current[orderId]) {
      fileInputRefs.current[orderId].click();
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Orders" breadcrumbItem="Order Management" />

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
                      All Orders
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
                        color="danger"
                        onClick={handlePdfDownload}
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
                          <th>Order ID</th>
                          <th>Order Date</th>
                          <th>Customer</th>
                          <th>Total Amount</th>
                          <th>Status</th>
                          <th>Items</th>
                          <th>Prescription No</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="9" className="text-center">
                              <Spinner color="primary" />
                              <span className="ms-2">Loading orders...</span>
                            </td>
                          </tr>
                        ) : error ? (
                          <tr>
                            <td colSpan="9" className="text-center text-danger">
                              {error}
                            </td>
                          </tr>
                        ) : orders.length === 0 ? (
                          <tr>
                            <td colSpan="9" className="text-center">
                              No orders found.
                            </td>
                          </tr>
                        ) : (
                          orders.map((order, index) => (
                            <tr key={order.order_id}>
                              <td>
                                {(currentPage - 1) * pageSize + index + 1}
                              </td>
                              <td>{order.order_id}</td>
                              <td>
                                {new Date(
                                  order.created_at
                                ).toLocaleDateString()}
                              </td>
                              <td>
                                {order.customer_id?.customer_name || "N/A"}
                              </td>
                              <td>
                                {parseFloat(
                                  order.total_bill_amount || 0
                                ).toFixed(2)}
                              </td>
                              <td>
                                <span
                                  className={`badge ${
                                    order.bill_type === "Billed"
                                      ? "bg-success"
                                      : order.bill_type === "Unbilled"
                                      ? "bg-warning"
                                      : "bg-primary"
                                  }`}
                                >
                                  {order.bill_type}
                                </span>
                              </td>
                              <td>
                                {order.product_details
                                  ?.map((item) => item.name)
                                  .join(", ") || "N/A"}
                              </td>
                              <td>{order.prescription_no || "N/A"}</td>
                              <td>
                                <div
                                  className="d-flex gap-2 justify-content-center align-items-center"
                                  style={{ minWidth: "80px" }}
                                >
                                  <div
                                    style={{
                                      width: "24px",
                                      textAlign: "center",
                                    }}
                                  >
                                    <FaEye
                                      style={{
                                        fontSize: "18px",
                                        color: "#007bff",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => handleView(order)}
                                      title="View"
                                    />
                                  </div>
                                  <div
                                    style={{
                                      width: "24px",
                                      textAlign: "center",
                                    }}
                                  >
                                    {!order.prescription_no && (
                                      <>
                                        <FaUpload
                                          style={{
                                            fontSize: "18px",
                                            color: "#28a745",
                                            cursor: "pointer",
                                          }}
                                          onClick={() =>
                                            triggerFileInput(order.order_id)
                                          }
                                          title="Upload Prescription"
                                        />
                                        <Input
                                          type="file"
                                          accept="image/*,.pdf"
                                          style={{ display: "none" }}
                                          innerRef={(el) =>
                                            (fileInputRefs.current[
                                              order.order_id
                                            ] = el)
                                          }
                                          onChange={(e) =>
                                            handlePrescriptionUpload(
                                              order.order_id,
                                              e.target.files[0]
                                            )
                                          }
                                        />
                                      </>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>

                    {!loading && orders.length > 0 && (
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
                            disabled={
                              currentPage === totalPages || totalCount === 0
                            }
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

      {/* Modal for Order Details */}
      <Modal isOpen={modal} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>Order Details</ModalHeader>
        <ModalBody>
          {selectedOrder && (
            <div>
              <h5>Order Information</h5>
              <Table bordered responsive>
                <tbody>
                  <tr>
                    <th>Order ID</th>
                    <td>{selectedOrder.order_id}</td>
                  </tr>
                  <tr>
                    <th>Order Date</th>
                    <td>
                      {new Date(selectedOrder.created_at).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <th>Total Items</th>
                    <td>{selectedOrder.total_items || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Total Quantity</th>
                    <td>{selectedOrder.total_quantity || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Subtotal</th>
                    <td>
                      ₹{parseFloat(selectedOrder.subtotal || 0).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <th>Total Bill Amount</th>
                    <td>
                      ₹
                      {parseFloat(selectedOrder.total_bill_amount || 0).toFixed(
                        2
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Payment Mode</th>
                    <td>{selectedOrder.payment_mode || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Bill Type</th>
                    <td>{selectedOrder.bill_type || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Payment Status</th>
                    <td>{selectedOrder.payment_status ? "Paid" : "Unpaid"}</td>
                  </tr>
                  <tr>
                    <th>Prescription No</th>
                    <td>{selectedOrder.prescription_no || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Prescription File</th>
                    <td>
                      {selectedOrder.prescription_upload ? (
                        <a
                          href={`${import.meta.env.VITE_API_BASE_URL}${
                            selectedOrder.prescription_upload
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary"
                          style={{ textDecoration: "underline" }}
                          onClick={() =>
                            console.log(
                              "Prescription URL:",
                              `${import.meta.env.VITE_API_BASE_URL}${
                                selectedOrder.prescription_upload
                              }`
                            )
                          }
                        >
                          <FaFilePdf style={{ marginRight: "5px" }} />
                          {selectedOrder.prescription_upload.split("/").pop()}
                        </a>
                      ) : (
                        "No file uploaded"
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>

              <h5 className="mt-4">Customer Information</h5>
              <Table bordered responsive>
                <tbody>
                  <tr>
                    <th>Name</th>
                    <td>{selectedOrder.customer_id?.customer_name || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Contact Number</th>
                    <td>
                      {selectedOrder.customer_id?.contact_number || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>{selectedOrder.customer_id?.email || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Customer Type</th>
                    <td>
                      {selectedOrder.customer_id?.customer_type_name || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <th>GSTIN</th>
                    <td>{selectedOrder.customer_id?.gstin || "N/A"}</td>
                  </tr>
                </tbody>
              </Table>

              <h5 className="mt-4">Seller Information</h5>
              <Table bordered responsive>
                <tbody>
                  <tr>
                    <th>Email</th>
                    <td>{selectedOrder.seller?.email || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Mobile No</th>
                    <td>{selectedOrder.seller?.mobile_no || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>
                      {selectedOrder.seller?.status ? "Active" : "Inactive"}
                    </td>
                  </tr>
                </tbody>
              </Table>

              <h5 className="mt-4">Product Details</h5>
              <Table bordered responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>MRP</th>
                    <th>Selling Price</th>
                    <th>Discount (%)</th>
                    <th>Total MRP</th>
                    <th>Batch Number</th>
                    <th>Expiry Date</th>
                    <th>Manufacturer</th>
                    <th>HSN</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.product_details?.length > 0 ? (
                    selectedOrder.product_details.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name || "N/A"}</td>
                        <td>{item.quantity || "N/A"}</td>
                        <td>₹{parseFloat(item.mrp || 0).toFixed(2)}</td>
                        <td>
                          ₹{parseFloat(item.selling_price || 0).toFixed(2)}
                        </td>
                        <td>{item.discount || "0"}</td>
                        <td>₹{parseFloat(item.totalMrp || 0).toFixed(2)}</td>
                        <td>{item.batch_number || "N/A"}</td>
                        <td>{item.expiry_date || "N/A"}</td>
                        <td>{item.mfg || "N/A"}</td>
                        <td>{item.hsn || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center">
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* Filter Modal */}
      <Modal isOpen={filterModal} toggle={toggleFilterModal} centered size="md">
        <ModalHeader
          toggle={toggleFilterModal}
          style={{
            background: "linear-gradient(90deg, #17a2b8, #00c4cc)",
            color: "#fff",
          }}
        >
          Filter Orders
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="customerName">Search Customer Name</Label>
              <Input
                type="text"
                id="customerName"
                placeholder="Enter customer name"
                value={tempFilterCustomerName}
                onChange={(e) => setTempFilterCustomerName(e.target.value)}
              />
            </FormGroup>
          </Form>
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
        .badge {
          font-size: 0.9rem;
          padding: 5px 10px;
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
          .table-container {
            min-width: 100%;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default DrugOrderManagement;
