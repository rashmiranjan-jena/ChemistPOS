import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Input,
  ModalFooter,
  Spinner,
} from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaFileExcel, FaFilter } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import {
  getDrug,
  deleteDrug,
  uploadExcellDrugs,
  downloadDrugsExcel,
} from "../../../ApiService/Drugs/Drug";
import Swal from "sweetalert2";

const DrugList = () => {
  const navigate = useNavigate();
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [searchDrugName, setSearchDrugName] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [tempSearchDrugName, setTempSearchDrugName] = useState("");
  const [tempSelectedType, setTempSelectedType] = useState("");
  const [downloadType, setDownloadType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchDrugs(currentPage, searchDrugName, selectedType);
  }, [currentPage, searchDrugName, selectedType]);

  const fetchDrugs = async (page, drugName, type) => {
    try {
      setLoading(true);
      const response = await getDrug(page, pageSize, drugName, type);
      setDrugs(response?.data || []);
      setTotalCount(response?.total_items || 0);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching drugs:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch drugs.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleView = (drug) => {
    setSelectedDrug(drug);
    setDetailsModalOpen(true);
  };

  const handleEdit = (id) => {
    navigate(`/add-drug-form`, { state: { id } });
  };

  const handleDelete = async (id) => {
    const firstResult = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed",
    });

    if (firstResult?.isConfirmed) {
      const secondResult = await Swal.fire({
        title: "Final Confirmation",
        text: "Are you absolutely certain you want to delete this item?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (secondResult?.isConfirmed) {
        try {
          await deleteDrug(id);
          setDrugs(drugs.filter((drug) => drug?.drug_id !== id));
          if (drugs.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            fetchDrugs(currentPage, searchDrugName, selectedType);
          }
          Swal.fire("Deleted!", "The item has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting item:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to delete the item.",
            icon: "error",
          });
        }
      }
    }
  };

  const handleExcelUpload = async (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("excel_file", file);

      try {
        setUploading(true);
        setUploadProgress(0);
        await uploadExcellDrugs(formData, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        });
        Swal.fire({
          title: "Upload Successful!",
          text: "The Excel file has been successfully uploaded and processed.",
          icon: "success",
          confirmButtonText: "OK",
        });
        fetchDrugs(currentPage, searchDrugName, selectedType);
      } catch (error) {
        console.error("Error uploading Excel file:", error);
        Swal.fire({
          title: "Error!",
          text: error?.message ?? "Failed to upload the Excel file.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setUploading(false);
        setUploadProgress(0);
        event.target.value = null; // Reset file input
      }
    } else {
      Swal.fire({
        title: "No File Selected!",
        text: "Please select an Excel file to upload.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    }
  };

  const handleExcelDownload = () => {
    setDownloadModalOpen(true);
  };

  const handleDownloadConfirm = async () => {
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      Swal.fire({
        title: "Invalid Date Range",
        text: "End date cannot be before start date.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    setDownloading(true);
    try {
      await downloadDrugsExcel(downloadType, startDate, endDate);
      Swal.fire({
        title: "Success!",
        text: "Excel file downloaded successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      setDownloadModalOpen(false);
      setDownloadType("");
      setStartDate("");
      setEndDate("");
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

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(`${import.meta.env.VITE_API_BASE_URL}${imageUrl}`);
    setImageModalOpen(true);
  };

  const toggleImageModal = () => {
    setImageModalOpen(!imageModalOpen);
  };

  const toggleFilterModal = () => {
    setFilterModalOpen(!filterModalOpen);
    if (!filterModalOpen) {
      setTempSearchDrugName(searchDrugName);
      setTempSelectedType(selectedType);
    }
  };

  const toggleDetailsModal = () => {
    setDetailsModalOpen(!detailsModalOpen);
  };

  const toggleDownloadModal = () => {
    setDownloadModalOpen(!downloadModalOpen);
  };

  const handleApplyFilters = () => {
    setSearchDrugName(tempSearchDrugName);
    setSelectedType(tempSelectedType);
    setCurrentPage(1);
    setFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    setTempSearchDrugName("");
    setTempSelectedType("");
  };

  const getTableHeaders = () => {
    const baseHeaders = [
      { label: "Sr.No", key: "srNo" },
      {
        label: selectedType === "nonmedical" ? "Product ID" : "Drug ID",
        key: "drug_id",
      },
      {
        label: selectedType === "nonmedical" ? "Product Name" : "Drug Name",
        key: "drug_name",
      },
      { label: "Brand", key: "brand_name" },
      { label: "Image", key: "image" },
      { label: "Actions", key: "actions" },
    ];
    return baseHeaders;
  };

  const getDetailFields = (drug) => {
    const baseFields = [
      {
        label:
          drug?.type?.toLowerCase() === "nonmedical" ? "Product ID" : "Drug ID",
        key: "drug_id",
      },
      {
        label:
          drug?.type?.toLowerCase() === "nonmedical"
            ? "Product Name"
            : "Drug Name",
        key: "drug_name",
      },
      { label: "Brand", key: "brand_name" },
      { label: "Category", key: "category_name" },
      {
        label:
          drug?.type?.toLowerCase() === "nonmedical"
            ? "Product Description"
            : "Drug Description",
        key: "drug_description",
      },
      { label: "Manufacturer", key: "manufacturer_name" },
      { label: "Max Discount", key: "max_discount" },
      { label: "Returnable", key: "returnable", type: "boolean" },
    ];

    const medicalFields = [
      ...baseFields,
      { label: "Drug Type", key: "drug_type_name" },
      {
        label: "Prescription Needed",
        key: "prescription_needed",
        type: "boolean",
      },
      { label: "Prohibition", key: "prohibition", type: "boolean" },
      { label: "Hide", key: "hide", type: "boolean" },
      { label: "Restriction", key: "restriction", type: "boolean" },
      { label: "Strength", key: "strength_name" },
      { label: "Drug Composition", key: "drug_composition" },
      { label: "Generic Description", key: "generic_description_name" },
      { label: "Use", key: "use" },
      { label: "Form", key: "drug_form_name" },
      { label: "Group Category", key: "group_category_name" },
      { label: "Sub Category", key: "sub_category_name" },
      { label: "Product Type", key: "product_type_name" },
      { label: "Group Disease", key: "group_disease_name" },
      { label: "Disease", key: "disease_name" },
      { label: "HSN Code", key: "hsn_code" },
    ];

    const nonMedicalFields = [
      ...baseFields,
      { label: "Sub Category", key: "sub_category_name" },
      { label: "Product Type", key: "product_type_name" },
    ];

    return drug?.type?.toLowerCase() === "medical"
      ? medicalFields
      : nonMedicalFields;
  };

  const renderTableRow = (drug, index) => {
    return getTableHeaders().map((header, idx) => {
      if (header.key === "srNo") {
        return <td key={idx}>{(currentPage - 1) * pageSize + index + 1}</td>;
      } else if (header.key === "actions") {
        return (
          <td key={idx}>
            <div className="d-flex gap-1">
              <FaEye
                style={{
                  fontSize: "18px",
                  color: "#007bff",
                  cursor: "pointer",
                }}
                onClick={() => handleView(drug)}
                title="View Details"
              />
              <FaEdit
                style={{
                  fontSize: "18px",
                  color: "#4caf50",

                  cursor: "pointer",
                }}
                onClick={() => handleEdit(drug?.drug_id)}
                title="Edit"
              />
              <FaTrash
                style={{
                  fontSize: "18px",
                  color: "#f44336",
                  cursor: "pointer",
                }}
                onClick={() => handleDelete(drug?.drug_id)}
                title="Delete"
              />
            </div>
          </td>
        );
      } else if (header.key === "image") {
        return (
          <td key={idx}>
            {drug?.image && (
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}${drug.image}`}
                alt={drug?.drug_name}
                style={{
                  maxWidth: "50px",
                  cursor: "pointer",
                }}
                onError={(e) => (e.target.src = "/path/to/placeholder.jpg")}
                onClick={() => handleImageClick(drug.image)}
              />
            )}
          </td>
        );
      } else {
        return <td key={idx}>{drug[header.key] || "-"}</td>;
      }
    });
  };

  const renderDetailModalContent = (drug) => {
    if (!drug) return null;
    const fields = getDetailFields(drug);
    return (
      <div>
        {drug.image && (
          <div className="text-center mb-3">
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}${drug.image}`}
              alt={drug.drug_name}
              style={{
                maxWidth: "200px",
                maxHeight: "200px",
                objectFit: "contain",
              }}
              onError={(e) => (e.target.src = "/path/to/placeholder.jpg")}
            />
          </div>
        )}
        {fields.map((field, idx) => (
          <Row key={idx} className="mb-2">
            <Col md="4" className="fw-bold">
              {field.label}:
            </Col>
            <Col md="8">
              {field.type === "boolean" ? (
                <Badge
                  color={
                    drug[field.key]
                      ? field.key === "hide"
                        ? "warning"
                        : "success"
                      : "danger"
                  }
                  pill
                >
                  {drug[field.key] ? "Yes" : "No"}
                </Badge>
              ) : (
                drug[field.key] || "-"
              )}
            </Col>
          </Row>
        ))}
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Drugs" breadcrumbItem="Drug List" />

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
                      Drug List
                    </h4>
                    <div className="d-flex flex-wrap gap-2 position-relative">
                      <Button
                        color="primary"
                        onClick={() => navigate("/add-drug-form")}
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
                      <label
                        htmlFor="excel-upload"
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
                          backgroundColor: "#28a745",
                          color: "#fff",
                          cursor: uploading ? "not-allowed" : "pointer",
                          opacity: uploading ? 0.6 : 1,
                          pointerEvents: uploading ? "none" : "auto",
                        }}
                        className="hover-scale m-0"
                      >
                        <FaFileExcel style={{ fontSize: "18px" }} />
                        {uploading ? (
                          <Spinner size="sm" color="light" />
                        ) : (
                          "Upload"
                        )}
                      </label>
                      <input
                        id="excel-upload"
                        type="file"
                        accept=".xlsx, .xls"
                        style={{ display: "none" }}
                        onChange={handleExcelUpload}
                        disabled={uploading}
                      />
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
                    ) : drugs?.length === 0 ? (
                      <div className="text-center py-4">
                        <p
                          className="text-muted mb-0"
                          style={{ fontSize: "14px" }}
                        >
                          No items available
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
                              {getTableHeaders().map((header) => (
                                <th key={header.key}>{header.label}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {drugs?.map((drug, index) => (
                              <tr key={drug?.drug_id}>
                                {renderTableRow(drug, index)}
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

          <Modal
            isOpen={imageModalOpen}
            toggle={toggleImageModal}
            centered
            size="lg"
          >
            <ModalHeader toggle={toggleImageModal}>
              {selectedDrug?.type?.toLowerCase() === "nonmedical"
                ? "Product Image"
                : "Drug Image"}
            </ModalHeader>
            <ModalBody className="text-center">
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt={selectedDrug?.drug_name || "Preview"}
                  style={{
                    width: "100%",
                    maxHeight: "400px",
                    objectFit: "contain",
                  }}
                  onError={(e) => (e.target.src = "/path/to/placeholder.jpg")}
                />
              )}
            </ModalBody>
          </Modal>

          <Modal
            isOpen={detailsModalOpen}
            toggle={toggleDetailsModal}
            centered
            size="lg"
          >
            <ModalHeader toggle={toggleDetailsModal}>
              {selectedDrug?.type?.toLowerCase() === "nonmedical"
                ? "Product Details"
                : "Drug Details"}{" "}
              - {selectedDrug?.drug_name}
            </ModalHeader>
            <ModalBody>{renderDetailModalContent(selectedDrug)}</ModalBody>
            <ModalFooter>
              <Button
                color="secondary"
                onClick={toggleDetailsModal}
                style={{
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                }}
              >
                Close
              </Button>
            </ModalFooter>
          </Modal>

          <Modal
            isOpen={filterModalOpen}
            toggle={toggleFilterModal}
            centered
            size="md"
          >
            <ModalHeader toggle={toggleFilterModal}>Filter Items</ModalHeader>
            <ModalBody>
              <Row>
                <Col md="12">
                  <FormGroup>
                    <Label for="searchDrugName">
                      Search{" "}
                      {selectedType === "nonmedical" ? "Product" : "Drug"} Name
                    </Label>
                    <Input
                      type="text"
                      id="searchDrugName"
                      placeholder={`Enter ${
                        selectedType === "nonmedical" ? "product" : "drug"
                      } name`}
                      value={tempSearchDrugName}
                      onChange={(e) => setTempSearchDrugName(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <Label for="typeFilter">Filter by Type</Label>
                    <Input
                      type="select"
                      id="typeFilter"
                      value={tempSelectedType}
                      onChange={(e) => setTempSelectedType(e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="medical">Medical</option>
                      <option value="nonmedical">Nonmedical</option>
                    </Input>
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

          <Modal
            isOpen={downloadModalOpen}
            toggle={toggleDownloadModal}
            centered
            size="md"
          >
            <ModalHeader toggle={toggleDownloadModal}>
              Download Options
            </ModalHeader>
            <ModalBody>
              <Row>
                <Col md="12">
                  <FormGroup>
                    <Label for="downloadType">Select Product Type</Label>
                    <Input
                      type="select"
                      id="downloadType"
                      value={downloadType}
                      onChange={(e) => setDownloadType(e.target.value)}
                    >
                      <option value="">All Products</option>
                      <option value="medical">Medical Products</option>
                      <option value="nonmedical">Non-Medical Products</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <Label for="startDate">Start Date</Label>
                    <Input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <Label for="endDate">End Date</Label>
                    <Input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button
                color="secondary"
                onClick={toggleDownloadModal}
                style={{
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onClick={handleDownloadConfirm}
                disabled={downloading}
                style={{
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                }}
              >
                {downloading ? "Downloading..." : "Download"}
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

export default DrugList;
