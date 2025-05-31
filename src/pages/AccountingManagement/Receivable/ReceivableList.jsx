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
  Form,
  FormGroup,
  Label,
  Input,
  Badge,
} from "reactstrap";
import { FaFilter, FaMoneyBillWave } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getReceivables,
  getCustomerPaymentDetails,
  submitPayment,
  exportReceivables,
} from "../../../ApiService/AccountingManagement/ReceivableList";

// Helper function to group receivables by customer_id
const groupReceivablesByCustomer = (receivables) => {
  const grouped = receivables.reduce((acc, receivable) => {
    const {
      customer_id,
      customer_name,
      order_id,
      due_date,
      amount,
      customer_category,
      created_at,
    } = receivable;

    if (!acc[customer_id]) {
      acc[customer_id] = {
        customer_id,
        customer_name,
        order_ids: [order_id],
        due_dates: [due_date],
        total_amount: amount,
        customer_category: customer_category,
        created_at,
      };
    } else {
      acc[customer_id].order_ids.push(order_id);
      acc[customer_id].due_dates.push(due_date);
      acc[customer_id].total_amount += amount;
      
    }
    return acc;
  }, {});

  return Object.values(grouped);
};

const ReceivableList = () => {
  const navigate = useNavigate();
  const [receivables, setReceivables] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    customer_name: "",
    order_id: "",
    due_date: "",
  
  });
  const [tempFilters, setTempFilters] = useState({
    customer_name: "",
    order_id: "",
    due_date: "",

  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterModal, setFilterModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [excelModal, setExcelModal] = useState(false); 
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    amount_paid: "",
    payment_mode: "cash",
    transaction_id: "",
  });
  const [excelForm, setExcelForm] = useState({
    start_date: "",
    end_date: "",
  }); 
  const [downloading, setDownloading] = useState(false);
  const recordsPerPage = 10;

  const toggleFilterModal = () => {
    setFilterModal(!filterModal);
    if (!filterModal) {
      setTempFilters(filters);
    }
  };

  const togglePaymentModal = () => {
    setPaymentModal(!paymentModal);
    if (!paymentModal) {
      setPaymentForm({
        amount_paid: "",
        payment_mode: "cash",
        transaction_id: "",
      });
      setSelectedCustomer(null);
    }
  };

  const toggleExcelModal = () => {
    setExcelModal(!excelModal);
    if (!excelModal) {
      setExcelForm({
        start_date: "",
        end_date: "",
      });
    }
  };

  const fetchReceivables = async (page = 1, appliedFilters = filters) => {
    try {
      setLoading(true);
      const response = await getReceivables({
        ...appliedFilters,
        page,
        page_size: recordsPerPage,
      });
      const groupedData = groupReceivablesByCustomer(response?.data || []);
      setReceivables(groupedData);
      setTotalItems(response?.total_items || 0);
      setCurrentPage(page);
      setLoading(false);
    } catch (err) {
      setError(err?.message || "An error occurred");
      setLoading(false);
      Swal.fire({
        title: "Error!",
        text: "Failed to load receivables data.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    fetchReceivables(1);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilter = () => {
    setFilters(tempFilters);
    fetchReceivables(1, tempFilters);
    toggleFilterModal();
  };

  const resetFilter = () => {
    const defaultFilters = {
      customer_name: "",
      order_id: "",
      due_date: "",
      payment_status: "",
    };
    setTempFilters(defaultFilters);
    setFilters(defaultFilters);
    fetchReceivables(1, defaultFilters);
    toggleFilterModal();
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(totalItems / recordsPerPage)) {
      fetchReceivables(page);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handlePay = async (customer_id, customer_name, order_ids) => {
    try {
      const response = await getCustomerPaymentDetails(customer_id);
      setPaymentDetails(response);
      setSelectedCustomer({ customer_id, customer_name, order_ids });
      setPaymentModal(true);
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.message || "Failed to fetch payment details.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handlePaymentFormChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentSubmit = async () => {
    const { amount_paid, payment_mode, transaction_id } = paymentForm;
    if (!amount_paid) {
      Swal.fire({
        title: "Error!",
        text: "Amount Paid is required.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    if (
      (payment_mode === "upi" || payment_mode === "card") &&
      !transaction_id
    ) {
      Swal.fire({
        title: "Error!",
        text: "Transaction ID is required for UPI and Card payments.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const paymentData = {
        customer_id: selectedCustomer.customer_id,
        amount_paid: parseFloat(amount_paid),
        payment_mode,
        transaction_id: transaction_id || null,
      };
      await submitPayment(paymentData);
      Swal.fire({
        title: "Success!",
        text: "Payment recorded successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      togglePaymentModal();
      fetchReceivables(currentPage);
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.message || "Failed to submit payment.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleExcelFormChange = (e) => {
    const { name, value } = e.target;
    setExcelForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleExcelDownload = async () => {
    const { start_date, end_date } = excelForm;

    // Validate date range
    if (!start_date || !end_date) {
      Swal.fire({
        title: "Error!",
        text: "Both start date and end date are required.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (new Date(end_date) < new Date(start_date)) {
      Swal.fire({
        title: "Error!",
        text: "End date cannot be earlier than start date.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setDownloading(true);
    try {
      const blob = await exportReceivables({
        ...filters,
        start_date,
        end_date,
      });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Receivables_List.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      Swal.fire("Success!", "Excel file downloaded successfully.", "success");
      toggleExcelModal();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to download Excel file.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Payments" breadcrumbItem="Receivable List" />

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
                      Receivable List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
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
                      >
                        <FaFilter style={{ fontSize: "18px" }} />
                        Filter
                      </Button>
                      <Button
                        color="success"
                        onClick={toggleExcelModal} // Open modal instead of direct download
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
                        <FaMoneyBillWave style={{ fontSize: "18px" }} />
                        {downloading ? "Downloading..." : "Download Excel"}
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
                    {loading ? (
                      <div className="text-center py-4">Loading...</div>
                    ) : error ? (
                      <div className="text-danger">{error}</div>
                    ) : receivables.length === 0 ? (
                      <div className="text-center text-muted py-4">
                        No receivables found
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
                            <th>Customer ID</th>
                            <th>Customer Name</th>
                            <th>Invoice No.</th>
                            <th>Due Date</th>
                            <th>Amount Receivable</th>
                            <th>Customer Type</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {receivables.map((receivable, index) => (
                            <tr key={receivable.customer_id}>
                              <td>
                                {(currentPage - 1) * recordsPerPage + index + 1}
                              </td>
                              <td>{receivable.customer_id}</td>
                              <td>{receivable.customer_name}</td>
                              <td>{receivable.order_ids.join(", ")}</td>
                              <td>{receivable.due_dates.join(", ")}</td>
                              <td>
                                {parseFloat(receivable.total_amount).toFixed(2)}
                              </td>
                              <td>{receivable.customer_category || "N/A"}</td>
                              <td>
                                <div className="d-flex gap-2 justify-content-center">
                                  <FaMoneyBillWave
                                    style={{
                                      fontSize: "18px",
                                      color: "#28a745",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handlePay(
                                        receivable.customer_id,
                                        receivable.customer_name,
                                        receivable.order_ids
                                      )
                                    }
                                    title="Pay"
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </div>

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

          <Modal isOpen={filterModal} toggle={toggleFilterModal}>
            <ModalHeader toggle={toggleFilterModal}>
              Filter Receivables
            </ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="customer_name">Customer Name</Label>
                  <Input
                    type="text"
                    name="customer_name"
                    id="customer_name"
                    value={tempFilters.customer_name}
                    onChange={handleFilterChange}
                    placeholder="Enter Customer Name"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="order_id">Invoice No.</Label>
                  <Input
                    type="text"
                    name="order_id"
                    id="order_id"
                    value={tempFilters.order_id}
                    onChange={handleFilterChange}
                    placeholder="Enter Invoice No."
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="due_date">Due Date</Label>
                  <Input
                    type="date"
                    name="due_date"
                    id="due_date"
                    value={tempFilters.due_date}
                    onChange={handleFilterChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="payment_status">Payment Status</Label>
                  <Input
                    type="select"
                    name="payment_status"
                    id="payment_status"
                    value={tempFilters.payment_status}
                    onChange={handleFilterChange}
                  >
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </Input>
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={resetFilter}>
                Reset
              </Button>
              <Button color="primary" onClick={applyFilter}>
                Apply Filter
              </Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={paymentModal} toggle={togglePaymentModal}>
            <ModalHeader toggle={togglePaymentModal}>
              Record Payment
            </ModalHeader>
            <ModalBody>
              {paymentDetails && selectedCustomer && (
                <Form>
                  <FormGroup>
                    <Label for="customer_name">Customer Name</Label>
                    <Input
                      type="text"
                      name="customer_name"
                      id="customer_name"
                      value={
                        paymentDetails.customer_name ||
                        selectedCustomer.customer_name
                      }
                      disabled
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="total_pending_amount">
                      Total Pending Amount
                    </Label>
                    <Input
                      type="text"
                      name="total_pending_amount"
                      id="total_pending_amount"
                      value={parseFloat(
                        paymentDetails.total_unbilled_due || 0
                      ).toFixed(2)}
                      disabled
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="amount_paid">Amount Paid</Label>
                    <Input
                      type="number"
                      name="amount_paid"
                      id="amount_paid"
                      value={paymentForm.amount_paid}
                      onChange={handlePaymentFormChange}
                      placeholder="Enter Amount Paid"
                      min="0"
                      step="0.01"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="payment_mode">Payment Mode</Label>
                    <Input
                      type="select"
                      name="payment_mode"
                      id="payment_mode"
                      value={paymentForm.payment_mode}
                      onChange={handlePaymentFormChange}
                    >
                      <option value="cash">Cash</option>
                      <option value="upi">UPI</option>
                      <option value="card">Card</option>
                    </Input>
                  </FormGroup>
                  {(paymentForm.payment_mode === "upi" ||
                    paymentForm.payment_mode === "card") && (
                    <FormGroup>
                      <Label for="transaction_id">Transaction ID</Label>
                      <Input
                        type="text"
                        name="transaction_id"
                        id="transaction_id"
                        value={paymentForm.transaction_id}
                        onChange={handlePaymentFormChange}
                        placeholder="Enter Transaction ID"
                        required
                      />
                    </FormGroup>
                  )}
                </Form>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={togglePaymentModal}>
                Cancel
              </Button>
              <Button color="primary" onClick={handlePaymentSubmit}>
                Submit Payment
              </Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={excelModal} toggle={toggleExcelModal}>
            <ModalHeader toggle={toggleExcelModal}>
              Export Receivables
            </ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="start_date">Start Date</Label>
                  <Input
                    type="date"
                    name="start_date"
                    id="start_date"
                    value={excelForm.start_date}
                    onChange={handleExcelFormChange}
                    placeholder="Select Start Date"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="end_date">End Date</Label>
                  <Input
                    type="date"
                    name="end_date"
                    id="end_date"
                    value={excelForm.end_date}
                    onChange={handleExcelFormChange}
                    placeholder="Select End Date"
                  />
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={toggleExcelModal}>
                Cancel
              </Button>
              <Button
                color="primary"
                onClick={handleExcelDownload}
                disabled={downloading}
              >
                {downloading ? "Downloading..." : "Download"}
              </Button>
            </ModalFooter>
          </Modal>
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
          min-width: 800px;
        }
        .table-striped tbody tr:nth-of-type(odd) {
          background-color: rgba(0, 0, 0, 0.03);
        }
        .table-hover tbody tr:hover {
          background-color: rgba(0, 123, 255, 0.1);
        }
        /* Fallback badge styling in case Bootstrap CSS is not loaded */
        .badge {
          display: inline-block;
          padding: 0.25em 0.4em;
          font-size: 75%;
          font-weight: 700;
          line-height: 1;
          text-align: center;
          white-space: nowrap;
          vertical-align: baseline;
          border-radius: 0.25rem;
        }
        .badge-warning {
          color: #212529;
          background-color: #ffc107;
        }
        .badge-success {
          color: #fff;
          background-color: #28a745;
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

export default ReceivableList;
