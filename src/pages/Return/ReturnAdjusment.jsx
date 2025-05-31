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
} from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaFileExcel, FaFilter } from "react-icons/fa";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getReturnAdjustments } from "../../ApiService/ReturnDrug/ReturnProduct";

const ReturnAdjustment = () => {
  const navigate = useNavigate();
  const [returnAdjustments, setReturnAdjustments] = useState([]);
  const [filteredAdjustments, setFilteredAdjustments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [filters, setFilters] = useState({
    returnBillNumber: "",
    fromDate: "",
    toDate: "",
    supplier: "",
  });

  useEffect(() => {
    const fetchAdjustments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getReturnAdjustments();
        console.log("getReturnAdjustments response:", response);
        setReturnAdjustments(response || []);
        setFilteredAdjustments(response || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching return adjustments:", err);
        setError("Failed to load return adjustments. Please try again.");
        setLoading(false);
        Swal.fire({
          title: "Error!",
          text: err.message || "Failed to load return adjustments.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    fetchAdjustments();
  }, []);

  // Toggle filter modal
  const toggleModal = () => setModal(!modal);

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...returnAdjustments];

    if (filters?.returnBillNumber) {
      filtered = filtered.filter((adj) =>
        adj?.return_bill_no
          ?.toLowerCase()
          .includes(filters.returnBillNumber.toLowerCase())
      );
    }

    if (filters?.fromDate) {
      filtered = filtered.filter(
        (adj) =>
          new Date(adj?.return_bill_date) >= new Date(filters.fromDate)
      );
    }

    if (filters?.toDate) {
      filtered = filtered.filter(
        (adj) =>
          new Date(adj?.return_bill_date) <= new Date(filters.toDate)
      );
    }

    if (filters?.supplier) {
      filtered = filtered.filter((adj) =>
        adj?.Supplier_name?.toLowerCase().includes(
          filters.supplier.toLowerCase()
        )
      );
    }

    setFilteredAdjustments(filtered);
    toggleModal();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      returnBillNumber: "",
      fromDate: "",
      toDate: "",
      supplier: "",
    });
    setFilteredAdjustments(returnAdjustments);
    toggleModal();
  };

  const handleBack = () => {
    navigate(-1);
  };



  const handleEdit = (adjustmentId) => {
    navigate(`/return-adjusment-form`, { state: { adjustmentId } });
  };

 
  const handleExcelDownload = () => {
    const headers = [
      "Sr.No",
      "Return Bill Number",
      "Date",
      "Supplier",
      "Amount",
      "Adjustment Date",
      "Purchase Bill Number",
      "Adjustment Amount",
      "Adjustment Status",
      "Return Loss",
    ];
    const rows = filteredAdjustments.map((adj, index) => [
      index + 1,
      adj?.return_bill_no,
      adj?.return_bill_date,
      adj?.Supplier_name,
      adj?.adjustment_amount,
      adj?.adjustment_date,
      adj?.purchase_bill_no,
      adj?.adjustment_amount,
      adj?.status,
      adj?.return_loss,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "return_adjustments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Inventory"
            breadcrumbItem="Return Adjustment List"
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
                        background:
                          "linear-gradient(90deg, #007bff, #00c4cc)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Return Adjustment List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="info"
                        onClick={toggleModal}
                        style={{
                         Jenny_1: "35px",
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

                  {loading ? (
                    <div className="text-center">Loading return adjustments...</div>
                  ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                  ) : (
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
                            <th>Return Bill Number</th>
                            <th>Return Bill Date</th>
                            <th>Supplier</th>
                            <th>Amount</th>
                            <th>Adjustment Date</th>
                            <th>Purchase Bill Number</th>
                            <th>Adjustment Amount</th>
                            <th>Adjustment Status</th>
                            <th>Return Loss</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAdjustments?.length === 0 ? (
                            <tr>
                              <td colSpan="11" className="text-center">
                                No return adjustments found.
                              </td>
                            </tr>
                          ) : (
                            filteredAdjustments?.map((adj, index) => (
                              <tr key={adj?.id}>
                                <td>{index + 1}</td>
                                <td>{adj?.return_bill_no}</td>
                                <td>
                                  {new Date(
                                    adj?.return_bill_date
                                  ).toLocaleString()}
                                </td>
                                <td>{adj?.Supplier_name}</td>
                                <td>{adj?.amount || 0}</td>
                                <td>
                                  {new Date(
                                    adj?.adjustment_date
                                  ).toLocaleString()}
                                </td>
                                <td>{adj?.purchase_bill_no}</td>
                                <td>{adj?.adjustment_amount}</td>
                                <td>{adj?.status}</td>
                                <td>{adj?.return_loss}</td>
                                <td>
                                  <div className="d-flex gap-2 justify-content-center">
                                    
                                    <FaEdit
                                      style={{
                                        fontSize: "18px",
                                        color: "#4caf50",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => handleEdit(adj?.id)}
                                      title="Edit"
                                    />
                                    
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Filter Modal */}
          <Modal isOpen={modal} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>Filter Return Adjustments</ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="returnBillNumber">Return Bill Number</Label>
                  <Input
                    type="text"
                    name="returnBillNumber"
                    id="returnBillNumber"
                    placeholder="Enter return bill number"
                    value={filters?.returnBillNumber || ""}
                    onChange={handleFilterChange}
                    className="form-control"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="fromDate">From Date</Label>
                  <Input
                    type="datetime-local"
                    name="fromDate"
                    id="fromDate"
                    value={filters?.fromDate || ""}
                    onChange={handleFilterChange}
                    className="form-control"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="toDate">To Date</Label>
                  <Input
                    type="datetime-local"
                    name="toDate"
                    id="toDate"
                    value={filters?.toDate || ""}
                    onChange={handleFilterChange}
                    className="form-control"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="supplier">Supplier</Label>
                  <Input
                    type="text"
                    name="supplier"
                    id="supplier"
                    placeholder="Enter supplier name"
                    value={filters?.supplier || ""}
                    onChange={handleFilterChange}
                    className="form-control"
                  />
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={resetFilters}>
                Close
              </Button>
              <Button color="primary" onClick={applyFilters}>
                Apply Filters
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

export default ReturnAdjustment;