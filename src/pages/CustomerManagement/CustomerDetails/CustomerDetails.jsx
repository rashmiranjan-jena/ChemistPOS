import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Input,
  InputGroup,
  InputGroupText,
  Badge,
  Container,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import { FaEye, FaLock, FaLockOpen, FaSearch } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getCustomers } from "../../../ApiService/SalesCustomer/CustomerDetails";

const CustomerDetails = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(9);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await getCustomers(currentPage, customersPerPage, searchTerm);
        setCustomers(response.results || []);
        setTotalCount(response.count || 0);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch customers. Please try again later.");
        setLoading(false);
        Swal.fire({
          title: "Error!",
          text: err.message || "Failed to fetch customers.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };
    fetchCustomers();
  }, [currentPage, searchTerm]);

  const handleStatusChange = (id, currentStatus, name) => {
  
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.customer_id === id
          ? { ...customer, status: !currentStatus }
          : customer
      )
    );

    Swal.fire({
      icon: "success",
      title: "Status Updated",
      text: `Customer ${name} is now ${!currentStatus ? "Blocked" : "Unblocked"}.`,
      confirmButtonText: "OK",
    });
  };

  const handleView = (id) => {
    navigate(`/customer-all-details/${id}`);
  };

  const filteredCustomers = customers.filter((customer) => {
    const name = customer.customer_name?.toLowerCase() || "";
    const email = customer.email?.toLowerCase() || "";
    const mobile = customer.contact_number?.toString() || "";
    return (
      name.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      mobile.includes(searchTerm)
    );
  });

  // Pagination Logic
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  const totalPages = Math.ceil(totalCount / customersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title="Customer Management"
          breadcrumbItem="Customer Details"
        />

        <Row>
          <Col xs="12">
            <Card
              className="shadow-lg"
              style={{
                borderRadius: "20px",
                background: "linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%)",
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
                    Customer Details
                  </h4>
                  <div className="d-flex flex-wrap gap-2">
                    <InputGroup
                      style={{
                        width: "300px",
                        borderRadius: "25px",
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <InputGroupText style={{ background: "#fff", border: "none" }}>
                        <FaSearch color="#6c757d" />
                      </InputGroupText>
                      <Input
                        type="text"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ border: "none", background: "#fff" }}
                      />
                    </InputGroup>
                    <Button
                      color="primary"
                      onClick={() => navigate(-1)}
                      style={{
                        height: "40px",
                        width: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        background: "linear-gradient(45deg, #007bff, #00c4cc)",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)",
                        transition: "transform 0.3s ease",
                      }}
                      className="hover-scale"
                      title="Back"
                    >
                      <i className="bx bx-undo" style={{ fontSize: "18px" }}></i>
                    </Button>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-5">
                    <Spinner color="primary" />
                    <span className="ms-2">Loading customers...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-5 text-danger">{error}</div>
                ) : (
                  <Row>
                    {currentCustomers.length > 0 ? (
                      currentCustomers.map((customer) => (
                        <Col
                          xs="12"
                          sm="6"
                          lg="4"
                          key={customer.customer_id}
                          className="mb-4"
                        >
                          <Card
                            className="shadow-sm"
                            style={{
                              borderRadius: "15px",
                              border: "none",
                              background: "#fff",
                              overflow: "hidden",
                              transition: "transform 0.3s ease, box-shadow 0.3s ease",
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                height: "5px",
                                background: customer.status
                                  ? "linear-gradient(90deg, #ff6b6b, #ff8e53)"
                                  : "linear-gradient(90deg, #28a745, #20c997)",
                              }}
                            ></div>
                            <CardBody className="p-4">
                              <div className="d-flex align-items-center mb-3">
                                <div
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "50%",
                                    background: `linear-gradient(45deg, ${
                                      customer.status ? "#ff6b6b" : "#28a745"
                                    }, ${
                                      customer.status ? "#ff8e53" : "#20c997"
                                    })`,
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
                                  {customer.customer_name?.[0] || "N/A"}
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
                                  {customer.customer_name || "N/A"}
                                </CardTitle>
                              </div>
                              <CardText style={{ color: "#6c757d", fontSize: "14px" }}>
                                <div className="mb-2">
                                  <i className="bx bx-envelope me-2"></i>
                                  {customer.email || "N/A"}
                                </div>
                                <div className="mb-2">
                                  <i className="bx bx-phone me-2"></i>
                                  {customer.contact_number || "N/A"}
                                </div>
                                <div className="mb-2">
                                  <i className="bx bx-id-card me-2"></i>
                                  {customer.gstin || "N/A"}
                                </div>
                                <div>
                                  <i
                                    className={`bx ${
                                      customer.status ? "bx-block" : "bx-check-circle"
                                    } me-2`}
                                  ></i>
                                  <Badge
                                    color={customer.status ? "danger" : "success"}
                                    pill
                                    style={{ fontSize: "12px", padding: "5px 10px" }}
                                  >
                                    {customer.status ? "Blocked" : "Active"}
                                  </Badge>
                                </div>
                              </CardText>
                              <div className="d-flex gap-2 justify-content-end mt-4">
                                <Button
                                  color="primary"
                                  size="sm"
                                  style={{
                                    borderRadius: "10px",
                                    background: "linear-gradient(45deg, #007bff, #00c4cc)",
                                    border: "none",
                                    padding: "8px 12px",
                                    boxShadow: "0 2px 8px rgba(0, 123, 255, 0.3)",
                                    transition: "all 0.3s ease",
                                  }}
                                  onClick={() => handleView(customer.customer_id)}
                                  title="View Details"
                                >
                                  <FaEye style={{ fontSize: "16px" }} />
                                </Button>
                                <Button
                                  color={customer.status ? "success" : "danger"}
                                  size="sm"
                                  style={{
                                    borderRadius: "10px",
                                    background: customer.status
                                      ? "linear-gradient(45deg, #28a745, #20c997)"
                                      : "linear-gradient(45deg, #ff6b6b, #ff8e53)",
                                    border: "none",
                                    padding: "8px 12px",
                                    boxShadow: customer.status
                                      ? "0 2px 8px rgba(40, 167, 69, 0.3)"
                                      : "0 2px 8px rgba(255, 107, 107, 0.3)",
                                    transition: "all 0.3s ease",
                                  }}
                                  onClick={() =>
                                    handleStatusChange(
                                      customer.customer_id,
                                      customer.status,
                                      customer.customer_name
                                    )
                                  }
                                  title={
                                    customer.status
                                      ? "Unblock Customer"
                                      : "Block Customer"
                                  }
                                >
                                  {customer.status ? (
                                    <FaLockOpen style={{ fontSize: "16px" }} />
                                  ) : (
                                    <FaLock style={{ fontSize: "16px" }} />
                                  )}
                                </Button>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <Col xs="12" className="text-center py-5">
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
                            No customers found matching your criteria
                          </p>
                        </div>
                      </Col>
                    )}
                  </Row>
                )}

                {!loading && !error && totalCount > 0 && (
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <div style={{ fontSize: "14px", color: "#6c757d" }}>
                      Showing {(currentPage - 1) * customersPerPage + 1} to{" "}
                      {Math.min(currentPage * customersPerPage, totalCount)} of{" "}
                      {totalCount} customers
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                      <Button
                        color="primary"
                        disabled={currentPage === 1}
                        onClick={() => paginate(currentPage - 1)}
                        style={{
                          borderRadius: "10px",
                          background: "linear-gradient(45deg, #007bff, #00c4cc)",
                          border: "none",
                          padding: "8px 20px",
                          boxShadow: "0 2px 8px rgba(0, 123, 255, 0.3)",
                          transition: "all 0.3s ease",
                        }}
                      >
                        Previous
                      </Button>
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#2c3e50",
                          fontWeight: "600",
                        }}
                      >
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        color="primary"
                        disabled={currentPage === totalPages || totalCount === 0}
                        onClick={() => paginate(currentPage + 1)}
                        style={{
                          borderRadius: "10px",
                          background: "linear-gradient(45deg, #007bff, #00c4cc)",
                          border: "none",
                          padding: "8px 20px",
                          boxShadow: "0 2px 8px rgba(0, 123, 255, 0.3)",
                          transition: "all 0.3s ease",
                        }}
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

      <style jsx>{`
        .hover-scale:hover {
          transform: scale(1.1) !important;
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
        .badge {
          transition: all 0.3s ease;
        }
        .input-group {
          transition: box-shadow 0.3s ease;
        }
        .input-group:focus-within {
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3) !important;
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
          .input-group {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CustomerDetails;