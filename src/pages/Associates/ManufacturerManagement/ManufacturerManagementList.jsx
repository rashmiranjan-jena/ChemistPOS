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
  ListGroup,
  ListGroupItem,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaFileExcel, FaFilter } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getManufacturers,
  deleteManufacturer,
  downloadManufacturersExcel,
} from "../../../ApiService/Drugs/Drug";

const ManufacturerManagementList = () => {
  const navigate = useNavigate();
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);
  const [searchManufacturerName, setSearchManufacturerName] = useState("");
  const [tempSearchManufacturerName, setTempSearchManufacturerName] =
    useState("");

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        setLoading(true);
        const response = await getManufacturers(
          currentPage,
          pageSize,
          searchManufacturerName
        );
        setManufacturers(response?.data ?? []);
        setTotalCount(response?.total_items ?? 0);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching manufacturers:", error);
        Swal.fire({
          title: "Error!",
          text: error?.message ?? "Failed to fetch manufacturers.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoading(false);
      }
    };

    fetchManufacturers();
  }, [currentPage, searchManufacturerName]);

  const handleBack = () => navigate(-1);

  const handleView = (manufacturer) => {
    setSelectedManufacturer(manufacturer);
    setModalOpen(true);
  };

  const handleEdit = (id) =>
    navigate(`/manufacturer-details-form`, { state: { id } });

  const handleDelete = async (id) => {
    const firstConfirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this manufacturer.",
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
          await deleteManufacturer(id);
          setManufacturers(
            manufacturers.filter(
              (manufacturer) => manufacturer?.manufacturer_id !== id
            )
          );
          if (manufacturers.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            const response = await getManufacturers(
              currentPage,
              pageSize,
              searchManufacturerName
            );
            setManufacturers(response?.data ?? []);
            setTotalCount(response?.total_items ?? 0);
          }
          Swal.fire({
            title: "Deleted!",
            text: "The manufacturer has been successfully deleted.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error("Error deleting manufacturer:", error);
          Swal.fire({
            title: "Error!",
            text: error?.message ?? "Failed to delete the manufacturer.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    }
  };

  const handleExcelDownload = async () => {
    setDownloading(true);
    try {
      await downloadManufacturersExcel();
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
      setDownloading(false);
    }
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) setSelectedManufacturer(null);
  };

  const toggleFilterModal = () => {
    setFilterModalOpen(!filterModalOpen);
    if (!filterModalOpen) {
      setTempSearchManufacturerName(searchManufacturerName);
    }
  };

  const handleApplyFilters = () => {
    setSearchManufacturerName(tempSearchManufacturerName);
    setCurrentPage(1);
    setFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    setTempSearchManufacturerName("");
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Manufacturer Management"
            breadcrumbItem="Manufacturer List"
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
                      Manufacturer List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={() => navigate("/manufacturer-details-form")}
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
                        <i
                          className="bx bx-plus"
                          style={{ fontSize: "18px" }}
                        ></i>
                        Add
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
                    {loading ? (
                      <p className="text-center py-4">Loading...</p>
                    ) : manufacturers?.length === 0 ? (
                      <div className="text-center py-4">
                        <p
                          className="text-muted mb-0"
                          style={{ fontSize: "14px" }}
                        >
                          No manufacturers available
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
                              textAlign: "center",
                            }}
                          >
                            <tr>
                              <th>Sr.No</th>
                              <th>Manufacturer ID</th>
                              <th>Manufacturer Name</th>
                              <th>Short Form</th>
                              <th>Prohibited</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody style={{ textAlign: "center" }}>
                            {manufacturers?.map((manufacturer, index) => (
                              <tr key={manufacturer?.manufacturer_id ?? index}>
                                <td>
                                  {(currentPage - 1) * pageSize + index + 1}
                                </td>
                                <td>
                                  {manufacturer?.manufacturer_id ?? "N/A"}
                                </td>
                                <td>
                                  {manufacturer?.manufacturer_name ?? "N/A"}
                                </td>
                                <td>{manufacturer?.short_form ?? "N/A"}</td>
                                <td>
                                  <span
                                    className={`badge ${
                                      manufacturer?.prohibited_status
                                        ? "bg-danger"
                                        : "bg-success"
                                    }`}
                                  >
                                    {manufacturer?.prohibited_status
                                      ? "Yes"
                                      : "No"}
                                  </span>
                                </td>
                                <td>
                                  <div className="d-flex gap-2 justify-content-center">
                                    <FaEye
                                      style={{
                                        fontSize: "18px",
                                        color: "#007bff",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => handleView(manufacturer)}
                                      title="View"
                                    />
                                    <FaEdit
                                      style={{
                                        fontSize: "18px",
                                        color: "#4caf50",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleEdit(
                                          manufacturer?.manufacturer_id
                                        )
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
                                        handleDelete(
                                          manufacturer?.manufacturer_id
                                        )
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

      {/* Modal for Manufacturer Details */}
      <Modal isOpen={modalOpen} toggle={toggleModal} centered size="lg">
        <ModalHeader
          toggle={toggleModal}
          style={{
            background: "linear-gradient(90deg, #007bff, #00c4cc)",
            color: "#fff",
          }}
        >
          Manufacturer Details
        </ModalHeader>
        <ModalBody>
  {selectedManufacturer && (
    <ListGroup flush>
      <ListGroupItem>
        <strong>Manufacturer ID:</strong>{" "}
        {selectedManufacturer?.manufacturer_id ?? "N/A"}
      </ListGroupItem>
      <ListGroupItem>
        <strong>Manufacturer Name:</strong>{" "}
        {selectedManufacturer?.manufacturer_name ?? "N/A"}
      </ListGroupItem>
      <ListGroupItem>
        <strong>Short Form:</strong>{" "}
        {selectedManufacturer?.short_form ?? "N/A"}
      </ListGroupItem>
      <ListGroupItem>
        <strong>Manufacturer Logo:</strong>{" "}
        {selectedManufacturer?.manufactuter_logo ? (
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}${
              selectedManufacturer.manufactuter_logo
            }`}
            alt={selectedManufacturer?.manufacturer_name ?? "Manufacturer"}
            style={{ width: "100px", marginTop: "10px" }}
            onError={(e) => (e.target.src = "/default-logo.png")}
          />
        ) : (
          "N/A"
        )}
      </ListGroupItem>
      <ListGroupItem>
        <strong>Established Year:</strong>{" "}
        {selectedManufacturer?.estd_year ?? "N/A"}
      </ListGroupItem>
      <ListGroupItem>
        <strong>Prohibited:</strong>{" "}
        <span
          className={`badge ${
            selectedManufacturer?.prohibited_status ? "bg-danger" : "bg-success"
          }`}
        >
          {selectedManufacturer?.prohibited_status ? "Yes" : "No"}
        </span>
      </ListGroupItem>
      <ListGroupItem>
        <strong>Drug Licence No:</strong>{" "}
        {selectedManufacturer?.drug_licence_no ?? "N/A"}
      </ListGroupItem>
      <ListGroupItem>
  <strong>Drug Licence File:</strong>{" "}
  {selectedManufacturer?.drug_licence_no_file ? (
    (() => {
      const fileUrl = `${import.meta.env.VITE_API_BASE_URL}${
        selectedManufacturer.drug_licence_no_file
      }`;
      const fileName = selectedManufacturer.drug_licence_no_file
        .split("/")
        .pop();
      const extension = fileName.split(".").pop().toLowerCase();

      if (["png", "jpg", "jpeg", "gif"].includes(extension)) {
        return (
          <img
            src={fileUrl}
            alt={fileName}
            style={{ width: "100px", marginTop: "10px" }}
            onError={(e) => (e.target.src = "/default-logo.png")}
          />
        );
      } else {
        return (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color: "#007bff",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <i className="bx bx-file" style={{ fontSize: "18px" }}></i>
            {fileName}
          </a>
        );
      }
    })()
  ) : (
    "N/A"
  )}
</ListGroupItem>
      <ListGroupItem>
        <strong>Type:</strong> {selectedManufacturer?.type ?? "N/A"}
      </ListGroupItem>
      <ListGroupItem>
        <strong>Discount Type:</strong>{" "}
        {selectedManufacturer?.discount_type ?? "N/A"}
      </ListGroupItem>
      <ListGroupItem>
        <strong>Expiry Date Management:</strong>{" "}
        {selectedManufacturer?.exp_date_management ?? "N/A"}
      </ListGroupItem>
      <ListGroupItem>
        <strong>Reorder Level:</strong>{" "}
        {selectedManufacturer?.reorder_level ?? "N/A"}
      </ListGroupItem>
      <ListGroupItem>
        <strong>Description:</strong>{" "}
        {selectedManufacturer?.description ?? "N/A"}
      </ListGroupItem>
      <ListGroupItem>
        <strong>Contact Details:</strong>
        <div>
          Phone: {selectedManufacturer?.contact_details?.phone ?? "N/A"}
        </div>
        <div>
          Email: {selectedManufacturer?.contact_details?.email ?? "N/A"}
        </div>
        <div>
          Website: {selectedManufacturer?.contact_details?.website ?? "N/A"}
        </div>
        <div>
          Address: {selectedManufacturer?.contact_details?.address ?? "N/A"}
        </div>
      </ListGroupItem>
      <ListGroupItem>
        <strong>Status:</strong>{" "}
        <span
          className={`badge ${
            selectedManufacturer?.status ? "bg-success" : "bg-danger"
          }`}
        >
          {selectedManufacturer?.status ? "Active" : "Inactive"}
        </span>
      </ListGroupItem>
      <ListGroupItem>
        <strong>Brands:</strong>{" "}
        {selectedManufacturer?.brand_id?.length > 0
          ? selectedManufacturer.brand_id
              .map((brand) => brand?.brand_name ?? "")
              .join(", ")
          : "N/A"}
      </ListGroupItem>
    </ListGroup>
  )}
</ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={toggleModal}
            style={{
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* Filter Modal */}
      <Modal
        isOpen={filterModalOpen}
        toggle={toggleFilterModal}
        centered
        size="md"
      >
        <ModalHeader toggle={toggleFilterModal}>
          Filter Manufacturers
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col md="12">
              <FormGroup>
                <Label for="searchManufacturerName">
                  Search Manufacturer Name
                </Label>
                <Input
                  type="text"
                  id="searchManufacturerName"
                  placeholder="Enter manufacturer name"
                  value={tempSearchManufacturerName}
                  onChange={(e) =>
                    setTempSearchManufacturerName(e.target.value)
                  }
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

export default ManufacturerManagementList;
