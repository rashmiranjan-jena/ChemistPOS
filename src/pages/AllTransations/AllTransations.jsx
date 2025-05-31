import React, { useEffect, useState } from "react";
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
} from "reactstrap";
import { FaFilter } from "react-icons/fa";
import Breadcrumbs from "../../components/Common/Breadcrumb"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import { fetchTransactions } from "../../ApiService/AccountingManagement/FinancialTransation";

const AllTransactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Matches API default page_size
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");

  // Toggle modal
  const toggleModal = () => {
    setModal(!modal);
    // Reset temporary dates to current applied dates when opening modal
    if (!modal) {
      setTempStartDate(startDate);
      setTempEndDate(endDate);
    }
  };

  // Fetch transactions from API
  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { page: currentPage, page_size: pageSize };
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

        const data = await fetchTransactions(params);
        const { results, total_count } = data;

        // Transform API response into a unified format
        const formattedTransactions = results
          .map((item, index) => {
            if (item.slip_no) {
              // Supplier Bill
              return {
                id: item.slip_no,
                date: new Date(item.payment_date).toISOString().split("T")[0],
                type: "Supplier Bill",
                supplier: item.supplier_name,
                amount: item.amount_paid,
                status: item.payment_mode === "Cash" ? "Completed" : "Pending",
              };
            } else if (item.order_id && item.paid_amount) {
              // Customer Collection
              return {
                id: `${item.order_id}-${index}`, // Unique ID to avoid duplicates
                date: new Date(item.payment_date).toISOString().split("T")[0],
                type: "Customer Collection",
                supplier: item.customer_name,
                amount: item.paid_amount,
                status: item.payment_mode === "cash" ? "Completed" : "Pending",
              };
            } else if (item.order_id && item.total_bill_amount) {
              // Sales Order
              return {
                id: item.order_id,
                date: new Date(item.payment_date).toISOString().split("T")[0],
                type: "Sale",
                supplier: item.customer_name,
                amount: item.total_bill_amount,
                status:
                  item.payment_mode === "Cash"
                    ? "Completed"
                    : item.payment_mode === "Credit"
                    ? "Pending"
                    : "Processing",
              };
            }
            return null;
          })
          .filter((item) => item !== null); // Remove any null entries

        setTransactions(formattedTransactions);
        setTotalCount(total_count || 0);
      } catch (error) {
        setError("Failed to load transactions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [currentPage, pageSize, startDate, endDate]);

  const handleBack = () => {
    navigate(-1);
  };

  // Handle filter form submission
  const handleFilterSubmit = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setCurrentPage(1); // Reset to first page when applying filters
    toggleModal(); // Close modal after applying filters
  };

  // Clear filters
  const handleClearFilters = () => {
    setTempStartDate("");
    setTempEndDate("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1); // Reset to first page
    toggleModal(); // Close modal
  };

  // Pagination calculations
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Finance" breadcrumbItem="All Transactions" />

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
                      All Transactions
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={toggleModal}
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
                        disabled={loading}
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

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  {loading ? (
                    <div className="text-center">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <>
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
                              <th>ID</th>
                              <th>Date</th>
                              <th>Type</th>
                              <th>Supplier/Customer</th>
                              <th>Amount ($)</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions.map((transaction, index) => (
                              <tr key={transaction.id}>
                                <td>
                                  {(currentPage - 1) * pageSize + index + 1}
                                </td>
                                <td>{transaction.id}</td>
                                <td>{transaction.date}</td>
                                <td>{transaction.type}</td>
                                <td>{transaction.supplier}</td>
                                <td>{transaction.amount.toFixed(2)}</td>
                                <td>{transaction.status}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>

                      {totalCount > 0 && (
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
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Filter Modal */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Filter Transactions</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="startDate">Start Date</Label>
              <Input
                type="date"
                name="startDate"
                id="startDate"
                value={tempStartDate}
                onChange={(e) => setTempStartDate(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="endDate">End Date</Label>
              <Input
                type="date"
                name="endDate"
                id="endDate"
                value={tempEndDate}
                onChange={(e) => setTempEndDate(e.target.value)}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleClearFilters}>
            Clear
          </Button>
          <Button color="primary" onClick={handleFilterSubmit}>
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
          min-width: 800px;
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
        }
      `}</style>
    </React.Fragment>
  );
};

export default AllTransactions;
