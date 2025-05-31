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
  ModalFooter,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaFileExcel, FaDownload } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import {
  fetchCategories,
  updateCategoryStatus,
  deleteCategory,
  uploadCategoriesExcel
} from "../../../ApiService/CategoryMaster/CategoryNameMaster/CategoryNameMaster";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const CategoryNameMasterList = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({ ...prevState, [id]: !prevState[id] }));
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleAddCategory = () => navigate("/categorynamemaster");

  const handleEdit = (id) => {
    navigate("/categorynamemaster", { state: { id } });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the category!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const secondResult = await Swal.fire({
        title: "Are you really sure?",
        text: "You will not be able to undo this action!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });

      if (secondResult.isConfirmed) {
        try {
          await deleteCategory(id);
          Swal.fire("Deleted!", "The category has been deleted.", "success");
          setCategories((prevCategories) =>
            prevCategories.filter(
              (category) => category.category_name_id !== id
            )
          );
        } catch (error) {
          Swal.fire(
            "Error!",
            "There was an issue deleting the category.",
            "error"
          );
        }
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    const result = await Swal.fire({
      title: `Are you sure you want to ${
        status ? "publish" : "unpublish"
      } this category?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await updateCategoryStatus(id, status);
        Swal.fire(
          "Updated!",
          `Category ${id} has been ${status ? "Published" : "Unpublished"}.`,
          "success"
        );
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.category_name_id === id
              ? { ...category, status: status }
              : category
          )
        );
      } catch (error) {
        Swal.fire(
          "Error!",
          "There was an issue updating the category status.",
          "error"
        );
      }
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
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
      
     const result = await uploadCategoriesExcel(file);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Excel file uploaded successfully!",
        confirmButtonColor: "#3085d6",
      });
      
      const updatedData = await fetchCategories();
      setCategories(updatedData);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to upload Excel file. Please try again.",
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
      const exportData = categories.map(category => ({
        "ID": category.category_name_id,
        "Category Name": category.category_name,
        "Status": category.status ? "Published" : "Unpublished",
        
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Categories");
      XLSX.writeFile(wb, "Categories.xlsx");

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Excel file downloaded successfully!",
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
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
      <Breadcrumbs title="Categories" breadcrumbItem="All Categories" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Category Name Master</h4>
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
                disabled={loading || categories.length === 0}
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
              <Button color="primary" onClick={handleAddCategory} disabled={loading}>
                <FaPlus className="mr-2" /> Add Category
              </Button>
            </div>
          </div>

          <div
            className="table-responsive"
            style={{ maxHeight: "500px", overflowY: "auto" }}
          >
            <Table bordered hover responsive className="custom-table">
              <thead className="table-light">
                <tr>
                  <th>Sr. No.</th>
                  <th>Category Name</th>
                  <th>Category Image</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : categories.length > 0 ? (
                  categories.map((category, idx) => (
                    <tr key={category.category_name_id}>
                      <td>{idx + 1}</td>
                      <td>{category.category_name}</td>
                      <td>
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL}${category.category_image}`}
                          alt={category.category_name}
                          width={50}
                          height={50}
                          style={{ borderRadius: "20%" }}
                          onClick={() =>
                            openImageModal(
                              `${import.meta.env.VITE_API_BASE_URL}${category.category_image}`
                            )
                          }
                        />
                      </td>
                      <td>
                        <Dropdown
                          isOpen={dropdownOpen[category.category_name_id] || false}
                          toggle={() => toggleDropdown(category.category_name_id)}
                        >
                          <DropdownToggle
                            caret
                            color={category.status ? "success" : "danger"}
                            className="btn btn-sm btn-rounded"
                          >
                            <i
                              className={
                                category.status
                                  ? "far fa-dot-circle text-success"
                                  : "far fa-dot-circle text-danger"
                              }
                            />{" "}
                            {category.status ? "Published" : "Unpublished"}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange(category.category_name_id, true)
                              }
                            >
                              Published
                            </DropdownItem>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange(category.category_name_id, false)
                              }
                            >
                              Unpublished
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                      <td>
                        <Button
                          color="link"
                          onClick={() => handleEdit(category.category_name_id)}
                          className="text-warning"
                        >
                          <FaEdit size={20} />
                        </Button>{" "}
                        <Button
                          color="link"
                          onClick={() => handleDelete(category.category_name_id)}
                          className="text-danger"
                        >
                          <FaTrash size={20} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No category name found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>

      {/* Modal for viewing full image */}
      <Modal
        isOpen={imageModalOpen}
        toggle={() => setImageModalOpen(false)}
        size="md"
        centered
      >
        <ModalHeader toggle={() => setImageModalOpen(false)}>
          Category Image
        </ModalHeader>
        <ModalBody>
          <img
            src={selectedImage}
            alt="Full Size"
            style={{ width: "100%", height: "auto", borderRadius: "10px" }}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setImageModalOpen(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CategoryNameMasterList;