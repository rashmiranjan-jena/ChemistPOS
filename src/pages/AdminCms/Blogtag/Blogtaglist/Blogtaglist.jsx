import React, { useState } from "react";
import { Button, Table, Card, CardBody, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { useNavigate } from "react-router-dom"; // Use useNavigate in v6
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa"; // React icons for actions
import Breadcrumbs from "../../../../components/Common/Breadcrumb";

const Blogtaglist = () => {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  // Sample data for blogs
  const blogs = [
    {
      id: 1,
      blogtitle: "Summer Blog",
      description: "This is a description of the summer blog.",
      readtime: "5 mins",
      content: "Content of the blog goes here.",
      quote: "Inspirational quote",
      blogtag: "Summer, Vacation",
      bannerimage: "path/to/banner.jpg",
      displayimage: "path/to/display.jpg",
      authorname: "John Doe",
      authorimage: "path/to/author.jpg",
      authordesignation: "Content Writer",
      socialname: "Facebook",
      sociallink: "https://facebook.com/johndoe",
      status: "Published",
    },
    {
      id: 2,
      blogtitle: "Winter Blog",
      description: "This is a description of the winter blog.",
      readtime: "3 mins",
      content: "Content of the winter blog goes here.",
      quote: "Another quote",
      blogtag: "Winter, Snow",
      bannerimage: "path/to/banner2.jpg",
      displayimage: "path/to/display2.jpg",
      authorname: "Jane Doe",
      authorimage: "path/to/author2.jpg",
      authordesignation: "Editor",
      socialname: "Twitter",
      sociallink: "https://twitter.com/janedoe",
      status: "Unpublished",
    },
    // Add more blogs here
  ];

  const handleAddBlog = () => {
    navigate("/blogtag");
  };

  // Action Handlers
  const handleView = (id) => {
    alert(`View Blog with ID: ${id}`);
  };

  const handleEdit = (id) => {
    alert(`Edit Blog with ID: ${id}`);
  };

  const handleDelete = (id) => {
    alert(`Delete Blog with ID: ${id}`);
  };

  // Handle Status Change
  const handleStatusChange = (id, status) => {
    alert(`Updated Status of Blog ${id} to ${status}`);
    // Add logic to update the status in your data or API
  };

  return (
    <div className="page-content">
      {/* Breadcrumb */}
      <Breadcrumbs title="Blogs Tag" breadcrumbItem="All Blogs Tag" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Blog Tag List</h4>
            {/* Add Blog Button with icon */}
            <Button color="primary" onClick={handleAddBlog}>
              <FaPlus className="mr-2" /> Add Blog Tag
            </Button>
          </div>

          <div className="table-responsive" style={{ maxHeight: '500px' }}>
            <Table bordered hover responsive className="custom-table">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Blog Tag</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id}>
                    <td>{blog.id}</td>
                    <td>{blog.blogtag}</td>
                    <td>
                      {/* Status Dropdown */}
                      <Dropdown>
                        <DropdownToggle
                          caret
                          color={blog.status === "Published" ? "success" : "danger"}
                          className="btn btn-white btn-sm btn-rounded"
                          onClick={(e) => e.preventDefault()}
                        >
                          <i
                            className={
                              blog.status === "Unpublished"
                                ? "far fa-dot-circle text-danger"
                                : blog.status === "Published"
                                ? "far fa-dot-circle text-success"
                                : "far fa-dot-circle text-info"
                            }
                          />{" "}
                          {blog.status}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem onClick={() => handleStatusChange(blog.id, "Published")}>
                            Published
                          </DropdownItem>
                          <DropdownItem onClick={() => handleStatusChange(blog.id, "Unpublished")}>
                            Unpublished
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </td>
                    <td>
                      {/* Action Icons */}
                      <Button color="link" onClick={() => handleView(blog.id)} className="text-primary">
                        <FaEye size={20} />
                      </Button>{" "}
                      <Button color="link" onClick={() => handleEdit(blog.id)} className="text-warning">
                        <FaEdit size={20} />
                      </Button>{" "}
                      <Button color="link" onClick={() => handleDelete(blog.id)} className="text-danger">
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

export default Blogtaglist;
