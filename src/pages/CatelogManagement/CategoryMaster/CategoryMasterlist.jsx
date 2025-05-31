import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Card,
  CardBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import Swal from "sweetalert2";
import {
  getCategories,
  updateCategoryStatus,
  deleteCategory,
} from "../../../ApiService/CategoryMaster/CategoryMaster";
import { useNavigate,useLocation } from "react-router-dom";

const CategoryMasterlist = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        console.log("categoriesData", categoriesData);
        const formattedCategories = categoriesData.map((item) => ({
          id: item.category_details.category_id,
          brand: item.category_details.brand_name,
          name: item.category_details.category_name,
          about: item.category_details.about_category,
          status: item.category_details.status,
        }));
        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    navigate("/categorymaster");
  };

  const handleView = (id) => {
    alert(id);
  };
  const handleEdit = (id) => {
    navigate("/categorymaster", { state: { id } });
  };
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete the category`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      const doubleCheck = await Swal.fire({
        title: "Are you absolutely sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
      });

      if (doubleCheck.isConfirmed) {
        try {
          await deleteCategory(id);
          setCategories(categories.filter((category) => category.id !== id));
          Swal.fire("Deleted!", `Category has been deleted.`, "success");
        } catch (error) {
          console.error("Error deleting category:", error);
          Swal.fire(
            "Error!",
            "Error deleting category. Please try again.",
            "error"
          );
        }
      } else {
        Swal.fire("Cancelled", "Your category is safe", "info");
      }
    } else {
      Swal.fire("Cancelled", "Your category is safe", "info");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    console.log(newStatus);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to change the status of the category`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      try {
        await updateCategoryStatus(id, newStatus);
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === id ? { ...category, status: newStatus } : category
          )
        );

        Swal.fire("Status Updated", "success");
      } catch (error) {
        console.error("Error updating category status:", error);
        Swal.fire(
          "Error",
          "Error updating category status. Please try again.",
          "error"
        );
      }
    }
  };

  // Toggle Dropdown visibility
  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  return (
    <div className="page-content">
      {/* Breadcrumb */}
      <Breadcrumbs title="Categories" breadcrumbItem="All Categories" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Category Master</h4>
            <Button color="primary" onClick={handleAddCategory}>
              <FaPlus className="mr-2" /> Add Category
            </Button>
          </div>

          <div className="table-responsive" style={{ maxHeight: "500px" }}>
            <Table bordered hover responsive className="custom-table">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Brand</th>
                  <th>Category Name</th>
                  <th>About Category</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((category, index) => (
                    <tr key={category.id}>
                      <td>{index + 1}</td>
                      <td>{category.brand}</td>
                      <td>{category.name}</td>
                      <td>{category.about}</td>
                      <td>
                        <Dropdown
                          isOpen={dropdownOpen === category.id}
                          toggle={() => toggleDropdown(category.id)}
                        >
                          <DropdownToggle
                            caret
                            color={category.status ? "success" : "danger"}
                            className="btn btn-white btn-sm btn-rounded"
                          >
                            <i
                              className={`far fa-dot-circle ${
                                category.status ? "text-success" : "text-danger"
                              }`}
                            />{" "}
                            {category.status ? "Published" : "Unpublished"}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange(category.id, true)
                              }
                            >
                              Published
                            </DropdownItem>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange(category.id, false)
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
                          onClick={() => handleView(category.id)}
                          className="text-primary"
                        >
                          <FaEye size={20} />
                        </Button>{" "}
                        <Button
                          color="link"
                          onClick={() => handleEdit(category.id)}
                          className="text-warning"
                        >
                          <FaEdit size={20} />
                        </Button>{" "}
                        <Button
                          color="link"
                          onClick={() => handleDelete(category.id)}
                          className="text-danger"
                        >
                          <FaTrash size={20} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No category data available
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CategoryMasterlist;
