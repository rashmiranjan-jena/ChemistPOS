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
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { getBlogData,updateBlogStatus } from "../../../ApiService/Blog/Blog";
import Swal from "sweetalert2";

const BlogsList = () => {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({}); 

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getBlogData();
        setBlogs(response.data); 
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []); 

  const handleAddBlog = () => {
    navigate("/blogs");
  };

  // Action Handlers
  // const handleView = (id) => {
  //   alert(`View Blog with ID: ${id}`);
  // };

  const handleEdit = (id) => {
   navigate(`/editblogs/${id}`);
  };

  const handleDelete = (id) => {
    alert(`Delete Blog with ID: ${id}`);
  };

  // Handle Status Change
  const handleStatusChange = async (id, status) => {
    // Show confirmation dialog using SweetAlert2
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to mark this blog as ${status ? 'Published' : 'Unpublished'}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Update!',
      cancelButtonText: 'No, Cancel',
    });
  
    // If the user confirms the action, proceed with the status update
    if (result.isConfirmed) {
      try {
        const updatedBlog = await updateBlogStatus(id, status);
  
        // Display a success message
        Swal.fire(
          'Updated!',
          `Blog with ID: ${id} status updated to ${status ? 'Published' : 'Unpublished'}`,
          'success'
        );
  
        // Update the blogs state with the new status
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog.blog_id === id ? { ...blog, status } : blog
          )
        );
      } catch (error) {
        // Display an error message if something goes wrong
        console.error('Error updating blog status:', error);
        Swal.fire('Error!', 'There was an issue updating the blog status.', 'error');
      }
    } else {
      // If the user cancels the action, display a cancellation message
      Swal.fire('Cancelled', 'The blog status was not updated.', 'info');
    }
  };
  

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <div className="page-content">
      {/* Breadcrumb */}
      <Breadcrumbs title="Blogs" breadcrumbItem="All Blogs" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Blog List</h4>
            <Button color="primary" onClick={handleAddBlog}>
              <FaPlus className="mr-2" /> Add Blog
            </Button>
          </div>

          <div className="table-responsive" style={{ maxHeight: "500px" }}>
            <Table bordered hover responsive className="custom-table">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Blog Title</th>
                  <th>Description</th>
                  <th>Read Time</th>
                  <th>Content</th>
                  <th>Quote</th>
                  <th>Blog Tag</th>
                  <th>Banner Image</th>
                  <th>Display Image</th>
                  <th>Author Name</th>
                  <th>Author Image</th>
                  <th>Author Designation</th>
                  <th>Social Name</th>
                  <th>Social Link</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog, index) => (
                  <tr key={blog.blog_id}>
                    <td>{index + 1}</td>
                    <td>{blog.title}</td>
                    <td>{blog.description}</td>
                    <td>{blog.time}min</td>
                    <td>{blog.content}</td>
                    <td>{blog.blog_quote || "N/A"}</td>
                    <td>{blog.blogtag}</td>
                    <td>
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL}${blog.banner_image}`}
                        alt="Banner"
                        style={{ width: "50px", height: "50px" }}
                      />
                    </td>
                    <td>
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL}${blog.display_image}`}
                        alt="Display"
                        style={{ width: "50px", height: "50px" }}
                      />
                    </td>
                    <td>{blog.author_name}</td>
                    <td>
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL}${blog.author_image}`}
                        alt="Author"
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                        }}
                      />
                    </td>
                    <td>{blog.author_designation}</td>
                    <td>{blog.social_links?.socialName}</td>
                    <td>
                      <a
                        href={blog.social_links?.socialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {blog.social_links?.socialLink}
                      </a>
                    </td>
                    <td>
                      {/* Status Dropdown */}
                      <Dropdown isOpen={dropdownOpen[blog.blog_id]} toggle={() => toggleDropdown(blog.blog_id)}>
                        <DropdownToggle
                          caret
                          color={blog.status ? "success" : "danger"}
                          className="btn btn-white btn-sm btn-rounded"
                        >
                          <i
                            className={
                              blog.status
                                ? "far fa-dot-circle text-success"
                                : "far fa-dot-circle text-danger"
                            }
                          />{" "}
                          {blog.status ? "Published" : "Unpublished"}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem
                            onClick={() =>
                              handleStatusChange(blog.blog_id, true) 
                            }
                          >
                            Publish
                          </DropdownItem>
                          <DropdownItem
                            onClick={() =>
                              handleStatusChange(blog.blog_id, false) 
                            }
                          >
                            Unpublish
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </td>

                    <td>
                      {/* <Button
                        color="link"
                        onClick={() => handleView(blog.blog_id)}
                        className="text-primary"
                      >
                        <FaEye size={20} />
                      </Button>{" "} */}
                      <Button
                        color="link"
                        onClick={() => handleEdit(blog.blog_id)}
                        className="text-warning"
                      >
                        <FaEdit size={20} />
                      </Button>{" "}
                      <Button
                        color="link"
                        onClick={() => handleDelete(blog.blog_id)}
                        className="text-danger"
                      >
                        <FaTrash size={20} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default BlogsList;
