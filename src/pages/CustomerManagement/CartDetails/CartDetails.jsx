import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom"; // Use useNavigate in v6
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa"; // React icons for actions
import Breadcrumbs from "../../../components/Common/Breadcrumb"; // Ensure the path is correct

const CartDetails = () => {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  // Sample data for social info
  const socialPages = [
    {
      id: 1,
      pageName: "Facebook",
      url: "https://facebook.com/brand",
      favicon: "https://via.placeholder.com/16", // Placeholder favicon URL
      status: "Published",
    },
    {
      id: 2,
      pageName: "Twitter",
      url: "https://twitter.com/brand",
      favicon: "https://via.placeholder.com/16",
      status: "Unpublished",
    },
    // Add more social page info here
  ];

  const handleAddSocialPage = () => {
    navigate("/socialinfo");
  };

  // Action Handlers
  const handleView = (id) => {
    alert(`View Social Page with ID: ${id}`);
  };

  const handleEdit = (id) => {
    alert(`Edit Social Page with ID: ${id}`);
  };

  const handleDelete = (id) => {
    alert(`Delete Social Page with ID: ${id}`);
  };

  // Handle Status Change
  const handleStatusChange = (id, status) => {
    alert(`Updated Status of Social Page ${id} to ${status}`);
    // Add logic to update the status in your data or API
  };

  return (
    <div className="page-content">
      {/* Breadcrumb */}
      <Breadcrumbs title="Social Pages" breadcrumbItem="All Social Pages" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Social Page Master</h4>
            {/* Add Social Page Button with icon */}
            <Button color="primary" onClick={handleAddSocialPage}>
              <FaPlus className="mr-2" /> Add Social Page
            </Button>
          </div>

          <div className="table-responsive" style={{ maxHeight: "500px" }}>
            <Table bordered hover responsive className="custom-table">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Social Page Name</th>
                  <th>URL</th>
                  <th>Favicon</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {socialPages.map((page) => (
                  <tr key={page.id}>
                    <td>{page.id}</td>
                    <td>{page.pageName}</td>
                    <td>
                      <a href={page.url} target="_blank" rel="noopener noreferrer">
                        {page.url}
                      </a>
                    </td>
                    <td>
                      <img
                        src={page.favicon}
                        alt="favicon"
                        style={{ width: "16px", height: "16px" }}
                      />
                    </td>
                    <td>
                      {/* Status Dropdown */}
                      <Dropdown>
                        <DropdownToggle
                          caret
                          color={
                            page.status === "Published"
                              ? "success"
                              : "danger"
                          }
                          className="btn btn-white btn-sm btn-rounded"
                          onClick={(e) => e.preventDefault()}
                        >
                          <i
                            className={
                              page.status === "Unpublished"
                                ? "far fa-dot-circle text-danger"
                                : "far fa-dot-circle text-success"
                            }
                          />{" "}
                          {page.status}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem
                            onClick={() =>
                              handleStatusChange(page.id, "Published")
                            }
                          >
                            Published
                          </DropdownItem>
                          <DropdownItem
                            onClick={() =>
                              handleStatusChange(page.id, "Unpublished")
                            }
                          >
                            Unpublished
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </td>
                    <td>
                      {/* Action Icons */}
                      <Button
                        color="link"
                        onClick={() => handleView(page.id)}
                        className="text-primary"
                      >
                        <FaEye size={20} />
                      </Button>{" "}
                      <Button
                        color="link"
                        onClick={() => handleEdit(page.id)}
                        className="text-warning"
                      >
                        <FaEdit size={20} />
                      </Button>{" "}
                      <Button
                        color="link"
                        onClick={() => handleDelete(page.id)}
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

export default CartDetails;
