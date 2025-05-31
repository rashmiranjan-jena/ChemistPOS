import React, { useState, useEffect } from "react";
import { Button, Table, Card, CardBody, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { getCategories, updateCategoryStatus, deleteCategory } from "../../../ApiService/Faq/Faq"; 
import Swal from "sweetalert2";

const Faqcategorytable = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        const data = response?.data;
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Fetched data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    navigate("/faqcategory");
  };

  const handleEdit = (id) => {
   navigate("/faqcategory", {state:{id}});
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
      
        Swal.fire({
          title: "Are you really sure?",
          text: "This is your final chance to cancel the deletion.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
        }).then(async (finalResult) => {
          if (finalResult.isConfirmed) {
            try {
              await deleteCategory(id); 
              setCategories((prevCategories) =>
                prevCategories.filter((category) => category.faqCategory_id !== id)
              );
              Swal.fire("Deleted!", "The category has been deleted.", "success");
            } catch (error) {
              console.error("Error deleting category:", error);
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Failed to delete the category. Please try again later.",
              });
            }
          } else {
            Swal.fire("Cancelled", "The category was not deleted.", "info");
          }
        });
      } else {
        Swal.fire("Cancelled", "The category was not deleted.", "info");
      }
    });
  };
  

  const toggleDropdown = (id) => {
    setDropdownOpen(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = !currentStatus;
  
    try {
      await updateCategoryStatus(id, newStatus);
  
      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `The status has been ${newStatus ? "Published" : "Unpublished"}.`,
      });
  
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.faqCategory_id === id
            ? { ...category, status: newStatus }
            : category
        )
      );
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to update status",
        text: error?.response?.data?.message || "An error occurred.",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-content">
      <Breadcrumbs title="Faq Category Management" breadcrumbItem="All Faq Categories" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Faq Category Master</h4>
            <Button color="primary" onClick={handleAddCategory}>
              <FaPlus className="mr-2" /> Add Faq Category
            </Button>
          </div>

          <div className="table-responsive" style={{ maxHeight: "500px", overflowY: "auto" }}>
            <Table bordered hover responsive className="custom-table">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Category Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories?.length === 0 ? (
                  <tr>
                    <td colSpan="4">No categories found.</td>
                  </tr>
                ) : (
                  categories?.map((category, index) => (
                    <tr key={category?.faqCategory_id}>
                      <td>{index + 1}</td>
                      <td>{category?.category_name}</td>
                      <td>
                        <Dropdown
                          isOpen={dropdownOpen[category?.faqCategory_id]}
                          toggle={() => toggleDropdown(category?.faqCategory_id)}
                        >
                          <DropdownToggle
                            caret
                            color={category?.status ? "success" : "danger"}
                            className="btn btn-white btn-sm btn-rounded"
                            onClick={(e) => e.preventDefault()}
                          >
                            <i
                              className={
                                category?.status
                                  ? "far fa-dot-circle text-success"
                                  : "far fa-dot-circle text-danger"
                              }
                            />{" "}
                            {category?.status ? "Published" : "Unpublished"}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              onClick={() =>
                                handleStatusChange(category?.faqCategory_id, category?.status)
                              }
                            >
                              {category?.status ? "Unpublish" : "Publish"}
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                      <td>
                        <Button color="link" onClick={() => handleEdit(category?.faqCategory_id)} className="text-warning">
                          <FaEdit size={20} />
                        </Button>{" "}
                        <Button color="link" onClick={() => handleDelete(category?.faqCategory_id)} className="text-danger">
                          <FaTrash size={20} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Faqcategorytable;
