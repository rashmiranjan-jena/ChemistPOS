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
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaFileExcel, FaFilter } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getSuppliers,
  deleteSupplier,
  downloadSuppliersExcel,
} from "../../../ApiService/Associate/Supplier";

const SupplierManagementList = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [modal, setModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);
  const [filterSupplierName, setFilterSupplierName] = useState("");
  const [tempFilterSupplierName, setTempFilterSupplierName] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, [currentPage, filterSupplierName]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await getSuppliers(
        currentPage,
        pageSize,
        filterSupplierName
      );
      setSuppliers(response?.data ?? []);
      setTotalCount(response?.total_items ?? 0);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      Swal.fire({
        title: "Error!",
        text: error?.message ?? "Failed to fetch suppliers.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setLoading(false);
    }
  };

  const handleBack = () => navigate(-1);

  const handleView = (supplier) => {
    setSelectedSupplier(supplier);
    setModal(true);
  };

  const handleEdit = (id) =>
    navigate(`/supplier-management-reports`, { state: { id } });

  const handleDelete = async (id) => {
    const firstConfirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this supplier.",
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
          await deleteSupplier(id);
          if (suppliers.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            await fetchSuppliers();
          }
          Swal.fire("Deleted!", "Supplier has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting supplier:", error);
          Swal.fire({
            title: "Error!",
            text: error?.message ?? "Failed to delete supplier.",
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
      await downloadSuppliersExcel();
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

  const toggleModal = () => setModal(!modal);

  const toggleFilterModal = () => {
    setFilterModal(!filterModal);
    if (!filterModal) {
      setTempFilterSupplierName(filterSupplierName);
    }
  };

  const handleApplyFilters = () => {
    setFilterSupplierName(tempFilterSupplierName);
    setCurrentPage(1);
    setFilterModal(false);
  };

  const handleClearFilters = () => {
    setTempFilterSupplierName("");
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Supplier Management"
            breadcrumbItem="Supplier List"
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
                      Supplier List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={() => navigate("/supplier-management-reports")}
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
                    ) : suppliers?.length === 0 ? (
                      <div className="text-center py-4">
                        <p
                          className="text-muted mb-0"
                          style={{ fontSize: "14px" }}
                        >
                          No suppliers available
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
                              <th>Sr. No</th>
                              <th>Supplier ID</th>
                              <th>Supplier Name</th>
                              <th>Short Form</th>
                              <th>Supplier Type Name</th>
                              <th>Contact</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {suppliers?.map((supplier, index) => (
                              <tr key={supplier?.supplier_id ?? index}>
                                <td>
                                  {(currentPage - 1) * pageSize + index + 1}
                                </td>
                                <td>{supplier?.supplier_id ?? "N/A"}</td>
                                <td>{supplier?.supplier_name ?? "N/A"}</td>
                                <td>{supplier?.short_form ?? "N/A"}</td>
                                <td>{supplier?.supplier_type_name ?? "N/A"}</td>
                                <td>
                                  <div>
                                    {supplier?.contact_details?.phone ?? "N/A"}
                                  </div>
                                  <div>
                                    {supplier?.contact_details?.email ?? "N/A"}
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex gap-2 justify-content-center">
                                    <FaEye
                                      style={{
                                        fontSize: "18px",
                                        color: "#007bff",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => handleView(supplier)}
                                      title="View"
                                    />
                                    <FaEdit
                                      style={{
                                        fontSize: "18px",
                                        color: "#4caf50",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleEdit(supplier?.supplier_id)
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
                                        handleDelete(supplier?.supplier_id)
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
          Filter Suppliers
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="supplierName">Search Supplier Name</Label>
              <Input
                type="text"
                id="supplierName"
                placeholder="Enter supplier name"
                value={tempFilterSupplierName}
                onChange={(e) => setTempFilterSupplierName(e.target.value)}
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

      {/* Supplier Details Modal */}
      <Modal isOpen={modal} toggle={toggleModal} centered size="lg">
        <ModalHeader
          toggle={toggleModal}
          style={{
            background: "linear-gradient(90deg, #007bff, #00c4cc)",
            color: "#fff",
          }}
        >
          Supplier Details
        </ModalHeader>
        <ModalBody>
          {selectedSupplier && (
            <ListGroup flush>
              <ListGroupItem>
                <strong>Supplier ID:</strong>{" "}
                {selectedSupplier?.supplier_id ?? "N/A"}
              </ListGroupItem>
              <ListGroupItem>
                <strong>Supplier Name:</strong>{" "}
                {selectedSupplier?.supplier_name ?? "N/A"}
              </ListGroupItem>
              <ListGroupItem>
                <strong>Short Form:</strong>{" "}
                {selectedSupplier?.short_form ?? "N/A"}
              </ListGroupItem>
              <ListGroupItem>
                <strong>Supplier Logo:</strong>{" "}
                {selectedSupplier?.logo ? (
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}${
                      selectedSupplier.logo
                    }`}
                    alt={selectedSupplier?.supplier_name ?? "Supplier"}
                    style={{ width: "100px", marginTop: "10px" }}
                    onError={(e) => (e.target.src = "/default-logo.png")}
                  />
                ) : (
                  "N/A"
                )}
              </ListGroupItem>
              <ListGroupItem>
                <strong>Description:</strong>{" "}
                {selectedSupplier?.description ?? "N/A"}
              </ListGroupItem>
              <ListGroupItem>
                <strong>Drug Licence:</strong>{" "}
                {selectedSupplier?.drug_license_no ?? "N/A"}
              </ListGroupItem>
              <ListGroupItem>
                <strong>GST No.:</strong> {selectedSupplier?.gst_no ?? "N/A"}
              </ListGroupItem>
              <ListGroupItem>
                <strong>FSSAI No.:</strong>{" "}
                {selectedSupplier?.fssai_no ?? "N/A"}
              </ListGroupItem>
              <ListGroupItem>
                <strong>Prohibited:</strong>{" "}
                <span
                  className={`badge ${
                    selectedSupplier?.prohibited_status
                      ? "bg-danger"
                      : "bg-success"
                  }`}
                >
                  {selectedSupplier?.prohibited_status ? "Yes" : "No"}
                </span>
              </ListGroupItem>
              <ListGroupItem>
                <strong>Supplier Type Name:</strong>{" "}
                {selectedSupplier?.supplier_type_name ?? "N/A"}
              </ListGroupItem>
              <ListGroupItem>
                <strong>Manufacturer Name:</strong>{" "}
                {selectedSupplier?.manufacturer_name
                  ?.map((m) => m?.manufacturer_name ?? "")
                  .join(", ") ?? "N/A"}
              </ListGroupItem>
              <ListGroupItem>
                <strong>Discount:</strong> {selectedSupplier?.discount ?? "N/A"}%
              </ListGroupItem>
              <ListGroupItem>
                <strong>Expiry Management:</strong>{" "}
                {selectedSupplier?.expiry_management ?? "N/A"}
              </ListGroupItem>
              <ListGroupItem>
                <strong>Drug Type:</strong>{" "}
                {selectedSupplier?.drug_type_name
                  ?.map((d) => d?.drug_type_name ?? "")
                  .join(", ") ?? "N/A"}
              </ListGroupItem>
              <ListGroupItem>
                <strong>Contact Details:</strong>
                <div>
                  Phone: {selectedSupplier?.contact_details?.phone ?? "N/A"}
                </div>
                <div>
                  Email: {selectedSupplier?.contact_details?.email ?? "N/A"}
                </div>
              </ListGroupItem>
              <ListGroupItem>
                <strong>Credit Details:</strong>
                <div>
                  Collection Type:{" "}
                  {selectedSupplier?.credit_details?.collectionType ?? "N/A"}
                </div>
                <div>
                  Interest Rate:{" "}
                  {selectedSupplier?.credit_details?.interestRate ?? 0}%
                </div>
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

export default SupplierManagementList;
