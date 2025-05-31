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
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import {
  FaEdit,
  FaTrash,
  FaFilter,
  FaFileUpload,
  FaFileDownload,
} from "react-icons/fa";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getThresholds,
  deleteThreshold,
 
  downloadThresholdsExcel,
} from "../../ApiService/Threshold/Threshold";

const ThresholdList = () => {
  const navigate = useNavigate();
  const [thresholds, setThresholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterModal, setFilterModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);
  const [filterDrugName, setFilterDrugName] = useState("");
  const [tempFilterDrugName, setTempFilterDrugName] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchThresholds = async () => {
      try {
        setLoading(true);
        const response = await getThresholds(
          currentPage,
          pageSize,
          filterDrugName
        );
        console.log(response);
        setThresholds(response?.data ?? []);
        setTotalCount(response?.total_items ?? 0);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching thresholds:", error);
        Swal.fire({
          title: "Error!",
          text: error?.message ?? "Failed to fetch thresholds.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoading(false);
      }
    };

    fetchThresholds();
  }, [currentPage, filterDrugName]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = (id) => {
    navigate(`/threshold-form`, { state: { id } });
  };

  const handleDelete = async (id) => {
    const firstConfirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this threshold.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "No, cancel",
    });

    if (firstConfirmation?.isConfirmed) {
      const secondConfirmation = await Swal.fire({
        title: "Confirm Deletion",
        text: "This action cannot be undone. Are you absolutely sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it",
        cancelButtonText: "No, keep it",
      });

      if (secondConfirmation?.isConfirmed) {
        try {
          await deleteThreshold(id);
          if (thresholds.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            const response = await getThresholds(
              currentPage,
              pageSize,
              filterDrugName
            );
            setThresholds(response?.data ?? []);
            setTotalCount(response?.total_items ?? 0);
          }
          Swal.fire({
            title: "Deleted!",
            text: "The threshold has been successfully deleted.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error("Error deleting threshold:", error);
          Swal.fire({
            title: "Error!",
            text: error?.message ?? "Failed to delete the threshold.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    }
  };

  const toggleFilterModal = () => {
    setFilterModal(!filterModal);
    if (!filterModal) {
      setTempFilterDrugName(filterDrugName);
    }
  };

  const handleApplyFilters = () => {
    setFilterDrugName(tempFilterDrugName);
    setCurrentPage(1);
    setFilterModal(false);
  };

  const handleClearFilters = () => {
    setTempFilterDrugName("");
  };

  const handleUploadExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (!validTypes.includes(file.type)) {
      Swal.fire({
        title: "Error!",
        text: "Please upload a valid Excel file (.xls or .xlsx).",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      await uploadThresholdsExcel(formData);
      const response = await getThresholds(
        currentPage,
        pageSize,
        filterDrugName
      );
      setThresholds(response?.data ?? []);
      setTotalCount(response?.total_items ?? 0);
      Swal.fire({
        title: "Success!",
        text: "Excel file uploaded successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error uploading Excel file:", error);
      Swal.fire({
        title: "Error!",
        text: error?.message ?? "Failed to upload Excel file.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
      fileInputRef.current.value = null; // Reset file input
    }
  };

  const handleDownloadExcel = async () => {
    try {
      setLoading(true);
      await downloadThresholdsExcel();
      Swal.fire({
        title: "Success!",
        text: "Excel file downloaded successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error downloading Excel file:", error);
      Swal.fire({
        title: "Error!",
        text: error?.message ?? "Failed to download Excel file.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Drugs" breadcrumbItem="Threshold List" />

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
                      Threshold List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={() => navigate("/threshold-form")}
                        style={{
                          height: "35px",
                          padding: "3px 10px 3px 10px",
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
                        <i
                          className="bx bx-plus"
                          style={{ fontSize: "18px" }}
                        ></i>{" "}
                        Add
                      </Button>

                      <Button
                        color="info"
                        onClick={handleDownloadExcel}
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
                        title="Download Excel"
                      >
                        <FaFileDownload style={{ fontSize: "18px" }} />
                        Download Excel
                      </Button>
                      <Button
                        color="warning"
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
                    {loading ? (
                      <p className="text-center py-4">Loading...</p>
                    ) : thresholds?.length === 0 ? (
                      <div className="text-center py-4">
                        <p
                          className="text-muted mb-0"
                          style={{ fontSize: "14px" }}
                        >
                          No thresholds available
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
                              <th>Drug Name</th>
                              <th>Threshold</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {thresholds?.map((threshold, index) => (
                              <tr key={threshold?.threshold_id ?? index}>
                                <td>
                                  {(currentPage - 1) * pageSize + index + 1}
                                </td>
                                <td>{threshold?.drug_name ?? "N/A"}</td>
                                <td>{threshold?.threshold ?? "N/A"}</td>
                                <td>
                                  <div className="d-flex gap-1">
                                    <FaEdit
                                      style={{
                                        fontSize: "18px",
                                        color: "#4caf50",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleEdit(threshold?.drug_id)
                                      }
                                      title="Edit"
                                    />
                                    <FaTrash
                                      style={{
                                        fontSize: "18px",
                                        color: "#f44336",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleDelete(threshold?.drug_id)
                                      }
                                      title="Delete"
                                    />
                                  </div>
                                </td>
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
          Filter Thresholds
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="drugName">Search Drug Name</Label>
              <Input
                type="text"
                id="drugName"
                placeholder="Enter drug name"
                value={tempFilterDrugName}
                onChange={(e) => setTempFilterDrugName(e.target.value)}
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
          min-width: 600px;
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

export default ThresholdList;
