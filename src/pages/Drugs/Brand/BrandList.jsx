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
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import {
  getBrands,
  deleteBrand,
  uploadBrandsExcel,
  downloadBrandsExcel,
} from "../../../ApiService/Drugs/BrandForm";
import Swal from "sweetalert2";

const BrandList = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);
  const [filterBrandName, setFilterBrandName] = useState("");
  const [tempFilterBrandName, setTempFilterBrandName] = useState("");

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await getBrands(
          currentPage,
          pageSize,
          filterBrandName
        );
        setBrands(response?.data ?? []);
        setTotalCount(response?.total_items ?? 0);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching brands:", error);
        Swal.fire({
          title: "Error!",
          text: error?.message ?? "Failed to fetch brands.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoading(false);
      }
    };

    fetchBrands();
  }, [currentPage, filterBrandName]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = (id) => {
    navigate(`/brand-form`, { state: { id } });
  };

  const handleDelete = async (id) => {
    const firstConfirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this brand.",
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
          await deleteBrand(id);
          if (brands.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            const response = await getBrands(
              currentPage,
              pageSize,
              filterBrandName
            );
            setBrands(response?.data ?? []);
            setTotalCount(response?.total_items ?? 0);
          }
          Swal.fire({
            title: "Deleted!",
            text: "The brand has been successfully deleted.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error("Error deleting brand:", error);
          Swal.fire({
            title: "Error!",
            text: error?.message ?? "Failed to delete the brand.",
            icon: "error",
            confirmButtonText: "OK",
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
        const response = await uploadBrandsExcel(formData);
        Swal.fire({
          title: "Upload Successful!",
          text: "The Excel file has been successfully uploaded and processed.",
          icon: "success",
          confirmButtonText: "OK",
        });

        const updatedData = await getBrands(
          currentPage,
          pageSize,
          filterBrandName
        );
        setBrands(updatedData?.data ?? []);
        setTotalCount(updatedData?.total_items ?? 0);
      } catch (error) {
        console.error("Error uploading Excel file:", error);
        Swal.fire({
          title: "Error!",
          text: error?.message ?? "Failed to upload the Excel file.",
          icon: "error",
          confirmButtonText: "OK",
        });
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

  const handleExcelDownload = async () => {
    setDownloading(true);
    try {
      await downloadBrandsExcel();
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

  const handleImagePreview = (imageUrl) => {
    if (imageUrl) {
      setPreviewImage(`${import.meta.env.VITE_API_BASE_URL}${imageUrl}`);
      setModalOpen(true);
    }
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (!modalOpen) setPreviewImage(null);
  };

  const toggleFilterModal = () => {
    setFilterModal(!filterModal);
    if (!filterModal) {
      setTempFilterBrandName(filterBrandName);
    }
  };

  const handleApplyFilters = () => {
    setFilterBrandName(tempFilterBrandName);
    setCurrentPage(1);
    setFilterModal(false);
  };

  const handleClearFilters = () => {
    setTempFilterBrandName("");
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Drugs" breadcrumbItem="Brand List" />

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
                      Brand List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={() => navigate("/brand-form")}
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
                          cursor: "pointer",
                        }}
                        className="hover-scale m-0"
                      >
                        <FaFileExcel style={{ fontSize: "18px" }} />
                        Upload
                      </label>
                      <input
                        id="excel-upload"
                        type="file"
                        accept=".xlsx, .xls"
                        style={{ display: "none" }}
                        onChange={handleExcelUpload}
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
                    ) : brands?.length === 0 ? (
                      <div className="text-center py-4">
                        <p
                          className="text-muted mb-0"
                          style={{ fontSize: "14px" }}
                        >
                          No brands available
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
                              <th>Brand ID</th>
                              <th>Brand Name</th>
                              <th>Photo</th>
                              <th>Description</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {brands?.map((brand, index) => (
                              <tr key={brand?.brand_id ?? index}>
                                <td>
                                  {(currentPage - 1) * pageSize + index + 1}
                                </td>
                                <td>{brand?.brand_id ?? "N/A"}</td>
                                <td>{brand?.brand_name ?? "N/A"}</td>
                                <td>
                                  {brand?.brand_image ? (
                                    <img
                                      src={`${
                                        import.meta.env.VITE_API_BASE_URL
                                      }${brand.brand_image}`}
                                      alt={brand?.brand_name ?? "Brand"}
                                      style={{
                                        width: "50px",
                                        height: "50px",
                                        objectFit: "cover",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleImagePreview(brand?.brand_image)
                                      }
                                      title="Click to preview"
                                    />
                                  ) : (
                                    "N/A"
                                  )}
                                </td>
                                <td>{brand?.brand_description ?? "N/A"}</td>
                                <td>
                                  <div className="d-flex gap-1">
                                    <FaEdit
                                      style={{
                                        fontSize: "18px",
                                        color: "#4caf50",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleEdit(brand?.brand_id)
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
                                        handleDelete(brand?.brand_id)
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

      {/* Modal for Image Preview */}
      <Modal isOpen={modalOpen} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>Image Preview</ModalHeader>
        <ModalBody>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "contain",
              }}
            />
          )}
        </ModalBody>
      </Modal>

      {/* Filter Modal */}
      <Modal isOpen={filterModal} toggle={toggleFilterModal} centered size="md">
        <ModalHeader
          toggle={toggleFilterModal}
          style={{
            background: "linear-gradient(90deg, #17a2b8, #00c4cc)",
            color: "#fff",
          }}
        >
          Filter Brands
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="brandName">Search Brand Name</Label>
              <Input
                type="text"
                id="brandName"
                placeholder="Enter brand name"
                value={tempFilterBrandName}
                onChange={(e) => setTempFilterBrandName(e.target.value)}
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

export default BrandList;
