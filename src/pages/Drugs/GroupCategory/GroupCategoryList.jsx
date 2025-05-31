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
} from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaFileExcel } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import {
  getGroupCategories,
  deleteGroupCategory,
  uploadGroupCategoriesExcel,
  downloadGroupCategoriesExcel
} from "../../../ApiService/Drugs/GroupCategory";
import Swal from "sweetalert2";

const GroupCategoryList = () => {
  const navigate = useNavigate();
  const [groupCategories, setGroupCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [downloading, setDownloading] = useState(false); 

  useEffect(() => {
    const fetchGroupCategories = async () => {
      try {
        const data = await getGroupCategories();
        setGroupCategories(data ?? []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching group categories:", error);
        Swal.fire({
          title: "Error!",
          text: error?.message ?? "Failed to fetch group categories.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoading(false);
      }
    };

    fetchGroupCategories();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = (id) => {
    navigate(`/group-category-form`, { state: { id } });
  };

  const handleDelete = async (id) => {
    const firstConfirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this group category.",
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
          await deleteGroupCategory(id);
          setGroupCategories(
            groupCategories.filter(
              (category) => category?.group_category_id !== id
            )
          );
          Swal.fire({
            title: "Deleted!",
            text: "The group category has been successfully deleted.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error("Error deleting group category:", error);
          Swal.fire({
            title: "Error!",
            text: error?.message ?? "Failed to delete the group category.",
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
        const response = await uploadGroupCategoriesExcel(formData);
        Swal.fire({
          title: "Upload Successful!",
          text: "The Excel file has been successfully uploaded and processed.",
          icon: "success",
          confirmButtonText: "OK",
        });
        const updatedData = await getGroupCategories();
        setGroupCategories(updatedData ?? []);
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
      await downloadGroupCategoriesExcel();
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

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Drugs" breadcrumbItem="Group Category List" />

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
                      Group Category List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={() => navigate("/group-category-form")}
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
                        disabled={downloading} // Disable button while downloading
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
                          <th>ID</th>
                          <th>Group Category Name</th>
                          <th>Photo</th>
                          <th>Description</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="6" className="text-center">
                              Loading...
                            </td>
                          </tr>
                        ) : groupCategories?.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center">
                              No group categories found.
                            </td>
                          </tr>
                        ) : (
                          groupCategories?.map((category, index) => (
                            <tr key={category?.group_category_id ?? index}>
                              <td>{index + 1}</td>
                              <td>{category?.group_category_id ?? "N/A"}</td>
                              <td>{category?.group_category_name ?? "N/A"}</td>
                              <td>
                                {category?.group_category_image ? (
                                  <img
                                    src={`${import.meta.env.VITE_API_BASE_URL}${
                                      category.group_category_image
                                    }`}
                                    alt={
                                      category?.group_category_name ??
                                      "Group Category"
                                    }
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      objectFit: "cover",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleImagePreview(
                                        category?.group_category_image
                                      )
                                    }
                                    title="Click to preview"
                                  />
                                ) : (
                                  "N/A"
                                )}
                              </td>
                              <td>
                                {category?.group_category_description ?? "N/A"}
                              </td>
                              <td>
                                <div className="d-flex gap-2 justify-content-center">
                                  <FaEdit
                                    style={{
                                      fontSize: "18px",
                                      color: "#4caf50",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleEdit(category?.group_category_id)
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
                                      handleDelete(category?.group_category_id)
                                    }
                                    title="Delete"
                                  />
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
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

export default GroupCategoryList;
