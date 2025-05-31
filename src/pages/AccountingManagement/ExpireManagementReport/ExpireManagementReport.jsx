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
import Breadcrumbs from "../../../components/Common/Breadcrumb"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getExpirationReport,
  downloadExpirationReportExcel,
} from "../../../ApiService/AccountingManagement/ExpireManagementReport";

const ExpireManagementReport = () => {
  const navigate = useNavigate();
  const [expireRecords, setExpireRecords] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    item: "",
    supplier: "",
  });
  const [tempFilters, setTempFilters] = useState({
    startDate: "",
    endDate: "",
    item: "",
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

  // Fetch data from API with filters
  useEffect(() => {
    const fetchExpirationRecords = async () => {
      try {
        setLoading(true);
        const response = await getExpirationReport({
          start_date: filters.startDate,
          end_date: filters.endDate,
          drug_name: filters.item,
          supplier_name: filters.supplier,
        });
        setExpireRecords(response || []);
        setLoading(false);
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error?.message || "Failed to fetch expiration records.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoading(false);
      }
    };

    fetchExpirationRecords();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    setTempFilters({
      startDate: "",
      endDate: "",
      item: "",
      supplier: "",
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleExcelDownload = async () => {
    setDownloading(true);
    try {
      await downloadExpirationReportExcel({
        start_date: filters.startDate,
        end_date: filters.endDate,
        drug_name: filters.item,
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

  document.title = "Expire Management Report";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Inventory Management"
            breadcrumbItem="Expire Management Report"
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
                      Expire Management Report
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
                      Filter Expiration Records
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
                    ) : expireRecords?.length === 0 ? (
                      <div className="text-center py-4">
                        No expiration records found.
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
                            <th>Expiry Date</th>
                            <th>Qty</th>
                            <th>Supplier</th>
                            <th>Return Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expireRecords?.map((record, index) => (
                            <tr key={`${record?.invoice_no || "no-invoice"}-${index}`}>
                              <td>{index + 1}</td>
                              <td>{record?.drug_details?.drug_name || "N/A"}</td>
                              <td>{record?.batch_no || "N/A"}</td>
                              <td>{record?.expire_date || "N/A"}</td>
                              <td>{record?.quantity ?? 0}</td>
                              <td>{record?.supplier_name || "N/A"}</td>
                              <td>{record?.status ? "Returned" : "Not Returned"}</td>
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

export default ExpireManagementReport;