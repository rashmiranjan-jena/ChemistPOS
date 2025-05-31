import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Table,
  Card,
  CardBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash, FaPlus, FaFileExcel, FaDownload } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import {
  getSubcategories,
  deleteSubcategory,
  updateSubcategoryStatus,
  uploadSubcategoriesExcel, 
} from "../../../ApiService/SubcategoryMaster/SubcategoryMaster";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const SubcategoryMasterlist = () => {
  const navigate = useNavigate();
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [modal, setModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const data = await getSubcategories();
        const formattedData = data
          .map((item) => {
            const details = item.sub_category_details;
            if (!details) return null;
            return {
              id: details.sub_category_id,
              name: details.sub_category_name,
              about: details.about_sub_category,
              image:
                details.images && details.images.length > 0
                  ? details.images[0]
                  : null,
              status: details.status ? "Published" : "Unpublished",
              parentCategory: details.category_name,
            };
          })
          .filter(Boolean);
        setSubcategories(formattedData);
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch subcategories. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, []);

  const handleAddSubcategory = () => {
    navigate("/subcategorymaster");
  };

  const toggleDropdown = (id) => {
    if (!id) return;
    setDropdownOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    toggleModal();
  };

  const handleStatusChange = async (id, status) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${status === "Published" ? "publish" : "unpublish"} this subcategory?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    });

    if (result.isConfirmed) {
      try {
        const newStatus = status === "Published";
        await updateSubcategoryStatus(id, newStatus);
        const updatedData = await getSubcategories();
        const formattedData = updatedData
          .map((item) => {
            const details = item.sub_category_details;
            if (!details) return null;
            return {
              id: details.sub_category_id,
              name: details.sub_category_name,
              about: details.about_sub_category,
              image: details.images && details.images.length > 0 ? details.images[0] : null,
              status: details.status ? "Published" : "Unpublished",
              parentCategory: details.category_name,
            };
          })
          .filter(Boolean);
        setSubcategories(formattedData);
        Swal.fire("Success!", `Subcategory status updated to ${status}.`, "success");
      } catch (error) {
        console.error("Error updating subcategory status:", error);
        Swal.fire("Error!", "An error occurred while updating the subcategory status.", "error");
      }
    }
  };

  const handleEdit = (id) => {
    navigate("/subcategorymaster", { state: { id } });
  };

  const handleDelete = async (id) => {
    const firstConfirmation = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this subcategory?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (firstConfirmation.isConfirmed) {
      const secondConfirmation = await Swal.fire({
        title: "Are you absolutely sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (secondConfirmation.isConfirmed) {
        try {
          const response = await deleteSubcategory(id);
          if (response.status === 200) {
            setSubcategories(subcategories.filter((subcategory) => subcategory.id !== id));
            Swal.fire("Deleted!", `Subcategory with ID: ${id} has been deleted successfully.`, "success");
          } else {
            Swal.fire("Failed!", "Failed to delete subcategory.", "error");
          }
        } catch (error) {
          console.error("Error deleting subcategory:", error);
          Swal.fire("Error!", "An error occurred while deleting the subcategory.", "error");
        }
      }
    }
  };

  // Excel Upload Handler
  const handleExcelUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please upload an Excel file (.xlsx or .xls)",
        confirmButtonColor: "#d33",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await uploadSubcategoriesExcel(file);
      const updatedData = await getSubcategories();
      const formattedData = updatedData
        .map((item) => {
          const details = item.sub_category_details;
          if (!details) return null;
          return {
            id: details.sub_category_id,
            name: details.sub_category_name,
            about: details.about_sub_category,
            image: details.images && details.images.length > 0 ? details.images[0] : null,
            status: details.status ? "Published" : "Unpublished",
            parentCategory: details.category_name,
          };
        })
        .filter(Boolean);
      setSubcategories(formattedData);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Excel file uploaded successfully!",
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      console.error("Error uploading Excel file:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Failed to upload Excel file. Please try again.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
      event.target.value = null;
    }
  };

  // Excel Download Handler
  const handleExcelDownload = () => {
    try {
      const exportData = subcategories.map(subcategory => ({
        "ID": subcategory.id,
        "Subcategory Name": subcategory.name,
        "Parent Category": subcategory.parentCategory,
        "About": subcategory.about,
        "Status": subcategory.status,
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Subcategories");
      XLSX.writeFile(wb, "Subcategories.xlsx");

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Excel file downloaded successfully!",
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      console.error("Error downloading Excel file:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to download Excel file. Please try again.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="page-content">
      <Breadcrumbs title="Subcategories" breadcrumbItem="All Subcategories" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Subcategory Master</h4>
            <div className="d-flex gap-2">
              <Button
                color="success"
                onClick={handleExcelUpload}
                disabled={loading}
              >
                <FaFileExcel className="mr-2" /> Upload Excel
              </Button>
              <Button
                color="info"
                onClick={handleExcelDownload}
                disabled={loading || subcategories.length === 0}
              >
                <FaDownload className="mr-2" /> Download Excel
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept=".xlsx,.xls"
              />
              <Button color="primary" onClick={handleAddSubcategory} disabled={loading}>
                <FaPlus className="mr-2" /> Add Subcategory
              </Button>
            </div>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div
              className="table-responsive"
              style={{ maxHeight: "500px", overflowY: "auto" }}
            >
              <Table bordered hover responsive className="custom-table">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Subcategory Name</th>
                    <th>Parent Category Name</th>
                    <th>About Subcategory</th>
                    <th>Subcategory Image</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {subcategories && subcategories.length > 0 ? (
                    subcategories.map((subcategory, index) => (
                      <tr key={subcategory.id}>
                        <td>{index + 1}</td>
                        <td>{subcategory.name || "N/A"}</td>
                        <td>{subcategory.parentCategory || "N/A"}</td>
                        <td>{subcategory.about || "N/A"}</td>
                        <td>
                          {subcategory.image && subcategory.image.sub_category_image ? (
                            <img
                              src={`${import.meta.env.VITE_API_BASE_URL}${subcategory.image.sub_category_image}`}
                              alt="Subcategory"
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "10%",
                                cursor: "pointer",
                              }}
                              onClick={() => handleImageClick(`${import.meta.env.VITE_API_BASE_URL}${subcategory.image.sub_category_image}`)}
                            />
                          ) : (
                            <span className="text-muted">No Image Available</span>
                          )}
                        </td>
                        <td>
                          <Dropdown
                            isOpen={dropdownOpen[subcategory.id] || false}
                            toggle={() => toggleDropdown(subcategory.id)}
                          >
                            <DropdownToggle
                              caret
                              color={subcategory.status === "Published" ? "success" : "danger"}
                              className="btn btn-sm btn-rounded"
                            >
                              <i
                                className={
                                  subcategory.status === "Published"
                                    ? "far fa-dot-circle text-success"
                                    : "far fa-dot-circle text-danger"
                                }
                              />{" "}
                              {subcategory.status}
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem onClick={() => handleStatusChange(subcategory.id, "Published")}>
                                Published
                              </DropdownItem>
                              <DropdownItem onClick={() => handleStatusChange(subcategory.id, "Unpublished")}>
                                Unpublished
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </td>
                        <td>
                          <Button
                            color="link"
                            onClick={() => handleEdit(subcategory.id)}
                            className="text-warning"
                          >
                            <FaEdit size={20} />
                          </Button>
                          <Button
                            color="link"
                            onClick={() => handleDelete(subcategory.id)}
                            className="text-danger"
                          >
                            <FaTrash size={20} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">
                        No subcategory data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </CardBody>
      </Card>
      <Modal isOpen={modal} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>Subcategory Image</ModalHeader>
        <ModalBody className="text-center">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Enlarged Subcategory"
              style={{ width: "100%", height: "auto", borderRadius: "10px" }}
            />
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default SubcategoryMasterlist;