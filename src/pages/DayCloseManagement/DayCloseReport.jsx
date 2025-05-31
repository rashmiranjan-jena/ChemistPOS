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
import { FaArrowLeft, FaFilter } from "react-icons/fa";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getDayCloseReport } from "../../ApiService/DaycloseReport/DayCloseReport";

const DayCloseReport = () => {
  document.title = "Pharmacy Day Close Report";
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterModal, setFilterModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);
  const [filterDate, setFilterDate] = useState("");
  const [tempFilterDate, setTempFilterDate] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await getDayCloseReport(
          currentPage,
          pageSize,
          filterDate
        );
        console.log("Day Close Report Response:", response);


        // Map the results to match the expected structure
        const mappedReports =
          response?.data?.results?.map((report) => ({
            id: report?.id ?? null,
            date: report?.summary_data?.date ?? report?.date ?? "N/A",
            total_sale_amount: report?.summary_data?.total_sale_amount ?? 0,
            total_bills_count: report?.summary_data?.total_bills_count ?? 0,
            billed_count: report?.summary_data?.billed_count ?? 0,
            unbilled_count: report?.summary_data?.unbilled_count ?? 0,
            upi_amount: report?.summary_data?.upi_amount ?? 0,
            card_amount: report?.summary_data?.card_amount ?? 0,
            cash_amount: report?.summary_data?.cash_amount ?? 0,
            credit_amount: report?.summary_data?.credit_amount ?? 0,
            walkins: report?.summary_data?.walkins ?? 0,
          
          })) ?? [];

        setReports(mappedReports);
        setTotalCount(response?.count ?? 0); // Use 'count' from response
        setLoading(false);
      } catch (error) {
        console.error("Error fetching day close reports:", error);
        Swal.fire({
          title: "Error!",
          text: error?.message ?? "Failed to fetch day close reports.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoading(false);
      }
    };

    fetchReports();
  }, [currentPage, filterDate]);

  const handleBack = () => {
    navigate(-1);
  };

  const toggleFilterModal = () => {
    setFilterModal(!filterModal);
    if (!filterModal) {
      setTempFilterDate(filterDate);
    }
  };

  const handleApplyFilters = () => {
    setFilterDate(tempFilterDate);
    setCurrentPage(1);
    setFilterModal(false);
  };

  const handleClearFilters = () => {
    setTempFilterDate("");
    setFilterDate(""); // Clear the applied filter as well
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Breadcrumbs title="Reports" breadcrumbItem="Day Close Report" />
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
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                transition: "transform 0.3s ease",
              }}
              className="hover-scale"
              title="Back"
            >
              <FaArrowLeft style={{ fontSize: "18px" }} />
            </Button>
          </div>

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
                      Day Close Report
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
                        title="Filter"
                      >
                        <FaFilter style={{ fontSize: "18px" }} />
                        Filter
                      </Button>
                    </div>
                  </div>

                  <div className="table-container">
                    {loading ? (
                      <p className="text-center py-4">Loading...</p>
                    ) : reports?.length === 0 ? (
                      <div className="text-center py-4">
                        <p
                          className="text-muted mb-0"
                          style={{ fontSize: "14px" }}
                        >
                          No day close reports available
                        </p>
                      </div>
                    ) : (
                      <>
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
                              <th>Total Sale Amount</th>
                              <th>Total Bills</th>
                              <th>Billed Count</th>
                              <th>Unbilled Count</th>
                              <th>UPI Amount</th>
                              <th>Card Amount</th>
                              <th>Cash Amount</th>
                              <th>Credit Amount</th>
                              <th>Walkins</th>
                        
                            </tr>
                          </thead>
                          <tbody>
                            {reports?.map((report, index) => (
                              <tr key={report?.id ?? index}>
                                <td>
                                  {(currentPage - 1) * pageSize + index + 1}
                                </td>
                                <td>{report?.date || "N/A"}</td>
                                <td>
                                  {report?.total_sale_amount?.toFixed(2) ||
                                    "0.00"}
                                </td>
                                <td>{report?.total_bills_count || "0"}</td>
                                <td>{report?.billed_count || "0"}</td>
                                <td>{report?.unbilled_count || "0"}</td>
                                <td>
                                  {report?.upi_amount?.toFixed(2) || "0.00"}
                                </td>
                                <td>
                                  {report?.card_amount?.toFixed(2) || "0.00"}
                                </td>
                                <td>
                                  {report?.cash_amount?.toFixed(2) || "0.00"}
                                </td>
                                <td>
                                  {report?.credit_amount?.toFixed(2) || "0.00"}
                                </td>
                                <td>{report?.walkins || "0"}</td>
                               
                              </tr>
                            ))}
                          </tbody>
                        </Table>

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
                      </>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Filter Modal */}
      <Modal isOpen={filterModal} toggle={toggleFilterModal} centered size="md">
        <ModalHeader
          toggle={toggleFilterModal}
          style={{
            background: "linear-gradient(90deg, #17a2b8, #00c4cc)",
            color: "#fff",
          }}
        >
          Filter Day Close Reports
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="filterDate">Search by Date</Label>
              <Input
                type="date"
                id="filterDate"
                value={tempFilterDate}
                onChange={(e) => setTempFilterDate(e.target.value)}
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
          font-size: 12px;
          padding: 6px 12px;
          border-radius: 20px;
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

export default DayCloseReport;
