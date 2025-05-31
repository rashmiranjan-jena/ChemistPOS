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
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { FaFileExcel, FaFilter } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import { getPaidAmounts } from "../../../ApiService/AccountingManagement/PaidAmount";

const PaidAmountList = () => {
  const navigate = useNavigate();
  const [paidAmounts, setPaidAmounts] = useState([]);
  const [filteredAmounts, setFilteredAmounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("");
  const [availableStatuses, setAvailableStatuses] = useState([]);
  const [availableSuppliers, setAvailableSuppliers] = useState([]);

  useEffect(() => {
    const fetchPaidAmounts = async () => {
      try {
        setLoading(true);
        const data = await getPaidAmounts();
        const transformedData =
          data?.map((item) => ({
            id: item?.id ?? "N/A",
            dateTime: item?.payment_date
              ? new Date(item.payment_date).toLocaleString("en-US", {
                  dateStyle: "short",
                  timeStyle: "short",
                })
              : "N/A",
            supplierName: item?.supplier_name ?? "N/A",
            paymentMode: item?.payment_mode ?? "N/A",
            invoiceNo: item?.invoice_No ?? "N/A",
            amountPaid: parseFloat(item?.amount_paid ?? 0),
            status: item?.status ?? "N/A",
            referenceNo: item?.slip_no ?? "-",
          })) ?? [];
        setPaidAmounts(transformedData);
        setFilteredAmounts(transformedData);

        // Extract unique statuses and suppliers for filter options
        const statuses = [
          ...new Set(
            transformedData
              .map((item) => item.status)
              .filter((status) => status !== "N/A")
          ),
        ];
        const suppliers = [
          ...new Set(
            transformedData
              .map((item) => item.supplierName)
              .filter((name) => name !== "N/A")
          ),
        ];
        setAvailableStatuses(statuses);
        setAvailableSuppliers(suppliers);
        setError(null);
      } catch (err) {
        setError(err?.message ?? "Failed to fetch paid amounts");
        setPaidAmounts([]);
        setFilteredAmounts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPaidAmounts();
  }, []);

  const toggleModal = () => setModal(!modal);

  const applyFilters = () => {
    let filtered = [...paidAmounts];
    if (filterStatus) {
      filtered = filtered.filter((item) => item.status === filterStatus);
    }
    if (filterSupplier) {
      filtered = filtered.filter(
        (item) => item.supplierName === filterSupplier
      );
    }
    setFilteredAmounts(filtered);
    toggleModal();
  };

  const resetFilters = () => {
    setFilterStatus("");
    setFilterSupplier("");
    setFilteredAmounts(paidAmounts);
    toggleModal();
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleExcelDownload = () => {
    const headers = [
      "Sr.No",
      "ID",
      "Date & Time",
      "Supplier Name",
      "Payment Mode",
      "Invoice No.",
      "Amount Paid",
      "Reference No.",
      "Status",
    ];
    const rows =
      filteredAmounts?.map((amount, index) => [
        index + 1,
        amount?.id ?? "N/A",
        `"${amount?.dateTime ?? "N/A"}"`, // Wrap dateTime in quotes to handle commas
        amount?.supplierName ?? "N/A",
        amount?.paymentMode ?? "N/A",
        amount?.invoiceNo ?? "N/A",
        amount?.amountPaid?.toFixed(2) ?? "0.00",
        amount?.referenceNo ?? "-",
        amount?.status ?? "N/A",
      ]) ?? [];
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "paid_amounts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Payments" breadcrumbItem="Paid Amount List" />

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
                      Paid Amount List
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
                        Download
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
                      <div className="text-center">Loading...</div>
                    ) : error ? (
                      <div className="text-center text-danger">{error}</div>
                    ) : filteredAmounts?.length === 0 ? (
                      <div className="text-center">No data available</div>
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
                            <th>ID</th>
                            <th>Date & Time</th>
                            <th>Supplier Name</th>
                            <th>Payment Mode</th>
                            <th>Invoice No.</th>
                            <th>Amount Paid</th>
                            <th>Reference No.</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAmounts?.map((amount, index) => (
                            <tr key={amount?.id ?? index}>
                              <td>{index + 1}</td>
                              <td>{amount?.id ?? "N/A"}</td>
                              <td>{amount?.dateTime ?? "N/A"}</td>
                              <td>{amount?.supplierName ?? "N/A"}</td>
                              <td>{amount?.paymentMode ?? "N/A"}</td>
                              <td>{amount?.invoiceNo ?? "N/A"}</td>
                              <td>
                                {amount?.amountPaid?.toFixed(2) ?? "0.00"}
                              </td>
                              <td>{amount?.referenceNo ?? "-"}</td>
                              <td>{amount?.status ?? "N/A"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Modal isOpen={modal} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>Filter Paid Amounts</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="filterStatus">Status</Label>
                <Input
                  type="select"
                  name="filterStatus"
                  id="filterStatus"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  {availableStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="filterSupplier">Supplier Name</Label>
                <Input
                  type="select"
                  name="filterSupplier"
                  id="filterSupplier"
                  value={filterSupplier}
                  onChange={(e) => setFilterSupplier(e.target.value)}
                >
                  <option value="">All Suppliers</option>
                  {availableSuppliers.map((supplier) => (
                    <option key={supplier} value={supplier}>
                      {supplier}
                    </option>
                  ))}
                </Input>
              </FormGroup>
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

export default PaidAmountList;
