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
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { FaEdit, FaTrash, FaFileExcel, FaPlus, FaFilter } from "react-icons/fa";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { getStorage, deleteStorage } from "../../ApiService/Storage/Storage";

const StorageList = () => {
  const navigate = useNavigate();
  const [storageData, setStorageData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    rack_no: "",
    shelf_no: "",
    box_no: "",
    drug_name: "",
  });
  const [tempFilters, setTempFilters] = useState({
    rack_no: "",
    shelf_no: "",
    box_no: "",
    drug_name: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const recordsPerPage = 10;

  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      setTempFilters(filters); // Populate tempFilters when opening modal
    }
  };

  const fetchStorageData = async (page = 1, appliedFilters = filters) => {
    try {
      setLoading(true);
      const response = await getStorage({
        ...appliedFilters,
        page,
        page_size: recordsPerPage,
      });
      setStorageData(response?.data || []);
      setTotalItems(response?.total_items || 0);
      setCurrentPage(page);
      setLoading(false);
    } catch (err) {
      setError(err?.message || "An error occurred");
      setLoading(false);
      Swal.fire({
        title: "Error!",
        text: "Failed to load storage data.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    fetchStorageData(1); // Initial fetch
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilter = () => {
    setFilters(tempFilters);
    fetchStorageData(1, tempFilters); // Fetch data with filters, reset to page 1
    toggleModal();
  };

  const resetFilter = () => {
    const defaultFilters = {
      rack_no: "",
      shelf_no: "",
      box_no: "",
      drug_name: "",
    };
    setTempFilters(defaultFilters);
    setFilters(defaultFilters);
    fetchStorageData(1, defaultFilters); // Fetch all data without filters
    toggleModal();
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(totalItems / recordsPerPage)) {
      fetchStorageData(page);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = (id) => {
    navigate("/storage-form", { state: { id } });
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteStorage(id);
          setStorageData((prevData) =>
            prevData.filter((storage) => storage?.id !== id)
          );
          setTotalItems((prev) => prev - 1);
          Swal.fire({
            title: "Deleted!",
            text: "The storage record has been deleted.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (err) {
          console.error("Delete error:", err);
          Swal.fire({
            title: "Error!",
            text: err.message || "Failed to delete storage record.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };

  const handleExcelDownload = async () => {
    setDownloading(true);
    try {
      let allRecords = [];
      const totalPages = Math.ceil(totalItems / recordsPerPage);
      for (let page = 1; page <= totalPages; page++) {
        const response = await getStorage({
          ...filters,
          page,
          page_size: recordsPerPage,
        });
        allRecords = [...allRecords, ...(response?.data || [])];
      }

      const headers = ["Sr.No", "Rack No", "Shelf No", "Box No", "Drugs"];
      const worksheetData = allRecords.map((storage, index) => ({
        "Sr.No": index + 1,
        "Rack No": storage?.rack_no || "N/A",
        "Shelf No": storage?.self_no || "N/A",
        "Box No": storage?.box_no || "N/A",
        Drugs: storage?.drugs?.map((drug) => drug?.drug_name).join(", ") || "N/A",
      }));

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Storage List");
      XLSX.writeFile(workbook, "Storage_List.xlsx");

      Swal.fire("Success!", "Excel file downloaded successfully.", "success");
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to download Excel file.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleAddStorage = () => {
    navigate("/storage-form");
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Storage" breadcrumbItem="Storage Management" />
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
                      Storage List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="info"
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
                        {downloading ? "Downloading..." : "Download Excel"}
                      </Button>
                      <Button
                        color="primary"
                        onClick={handleAddStorage}
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
                        <FaPlus style={{ fontSize: "18px" }} />
                        Add Storage
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
                    ) : storageData.length === 0 ? (
                      <div className="text-center text-muted py-4">
                        No storage records found
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
                            <th>Rack No</th>
                            <th>Shelf No</th>
                            <th>Box No</th>
                            <th>Drugs</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {storageData.map((storage, index) => (
                            <tr key={storage?.id || index}>
                              <td>
                                {(currentPage - 1) * recordsPerPage + index + 1}
                              </td>
                              <td>{storage?.rack_no || "N/A"}</td>
                              <td>{storage?.self_no || "N/A"}</td>
                              <td>{storage?.box_no || "N/A"}</td>
                              <td>
                                {storage?.drugs
                                  ?.map((drug) => drug?.drug_name)
                                  .join(", ") || "N/A"}
                              </td>
                              <td>
                                <div className="d-flex gap-2 justify-content-center">
                                  <FaEdit
                                    style={{
                                      fontSize: "18px",
                                      color: "#007bff",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleEdit(storage?.id)}
                                    title="Edit"
                                  />
                                  <FaTrash
                                    style={{
                                      fontSize: "18px",
                                      color: "#dc3545",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleDelete(storage?.id)}
                                    title="Delete"
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </div>

                  {/* Pagination */}
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
                            currentPage === Math.ceil(totalItems / recordsPerPage)
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

          <Modal isOpen={modal} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>Filter Storage</ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="rack_no">Rack Number</Label>
                  <Input
                    type="text"
                    name="rack_no"
                    id="rack_no"
                    value={tempFilters.rack_no}
                    onChange={handleFilterChange}
                    placeholder="Enter Rack Number"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="shelf_no">Shelf Number</Label>
                  <Input
                    type="text"
                    name="shelf_no"
                    id="shelf_no"
                    value={tempFilters.shelf_no}
                    onChange={handleFilterChange}
                    placeholder="Enter Shelf Number"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="box_no">Box Number</Label>
                  <Input
                    type="text"
                    name="box_no"
                    id="box_no"
                    value={tempFilters.box_no}
                    onChange={handleFilterChange}
                    placeholder="Enter Box Number"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="drug_name">Drug Name</Label>
                  <Input
                    type="text"
                    name="drug_name"
                    id="drug_name"
                    value={tempFilters.drug_name}
                    onChange={handleFilterChange}
                    placeholder="Enter Drug Name"
                  />
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

export default StorageList;