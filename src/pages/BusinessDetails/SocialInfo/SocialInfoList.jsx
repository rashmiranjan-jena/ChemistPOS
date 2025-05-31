import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa"; // Icons for actions and Excel
import Breadcrumbs from "../../../components/Common/Breadcrumb"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteSocialPage, fetchSocial, updateSocialPageStatus } from "../../../ApiService/SocialInfo/SocialInfo";

const SocialInfoList = () => {
  const navigate = useNavigate();

  // Static sample social pages data
  const [socialPages, setSocialPages] = useState([]);

  const [openDropdown, setOpenDropdown] = useState(null);
  // fetch social data
  useEffect(() => {
    fetchData();
  },[]);

  const fetchData = async() =>{
    try {
      const response = await fetchSocial();
      setSocialPages(response);
    } catch (error) {
      console.log("error",error);
      
    }
  }

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddSocialPage = () => {
    navigate("/socialinfo");
  };

  const handleView = (id) => {
    navigate(`/socialinfo-details/${id}`);
  };

  const handleEdit = (id) => {
    navigate("/socialinfo", { state: { id } });
  };

  const handleStatusChange = (id, currentStatus) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to ${currentStatus ? "unpublish" : "publish"} this social page.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then(async(result) => {
      if (result.isConfirmed) {
        const newStatus = !currentStatus;
       try {
         const response = await updateSocialPageStatus(id, newStatus);
         if (response.status === 200) {
           Swal.fire(
             "Status Updated!",
             `The status for the social page has been ${newStatus? "published" : "unpublished"}.`,
             "success"
            );
          }
          fetchData();
       } catch (error) {
        Swal.fire("Error", "An error occurred while updating the status.", "error");
       }
        Swal.fire(
          "Status Updated!",
          `The status for the social page has been ${newStatus ? "published" : "unpublished"}.`,
          "success"
        );
      } else {
        Swal.fire("Cancelled", "No changes were made to the status.", "error");
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this social page. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Are you absolutely sure?",
          text: "This will permanently delete the social page from the system.",
          icon: "error",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
        }).then(async(secondResult) => {
          if (secondResult.isConfirmed) {
            try {
              const response = await deleteSocialPage(id);
              if(response.status ===204){
                Swal.fire(
                  "Deleted!",
                  "The social page has been deleted successfully.",
                  "success"
                );
                fetchData();  
              }
            } catch (error) {
              console.log("error",error);
              
            }
          } else {
            Swal.fire("Cancelled", "The social page was not deleted.", "error");
          }
        });
      } else {
        Swal.fire("Cancelled", "The social page was not deleted.", "error");
      }
    });
  };

 
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Social Pages" breadcrumbItem="Social Pages List" />

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
                      Social Pages List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={handleAddSocialPage}
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
                          <th>Social Pages</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {socialPages.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="text-center">
                              <p>No Data Available</p>
                            </td>
                          </tr>
                        ) : (
                          socialPages.map((page, index) => (
                            <tr key={page.business_social_id}>
                              <td>{index + 1}</td>
                              <td>{page.business_social_id}</td>
                              <td>
                                {page.social_details.social_details.map((social, idx) => (
                                  <div key={idx}>
                                    <strong>{social.social_media_type}</strong>:{" "}
                                    <a
                                      href={social.social_media_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {social.social_media_url}
                                    </a>
                                    {idx < page.social_details.social_details.length - 1 && (
                                      <br />
                                    )}
                                  </div>
                                ))}
                              </td>
                              <td>
                                <Dropdown
                                  isOpen={
                                    openDropdown === page.business_social_id
                                  }
                                  toggle={() =>
                                    toggleDropdown(page.business_social_id)
                                  }
                                >
                                  <DropdownToggle
                                    caret
                                    color={page.status ? "success" : "danger"}
                                    className="btn btn-sm btn-rounded"
                                  >
                                    <i
                                      className={
                                        page.status
                                          ? "far fa-dot-circle text-success"
                                          : "far fa-dot-circle text-danger"
                                      }
                                    />{" "}
                                    {page.status ? "Published" : "Unpublished"}
                                  </DropdownToggle>
                                  <DropdownMenu>
                                    <DropdownItem
                                      onClick={() =>
                                        handleStatusChange(
                                          page.business_social_id,
                                          page.status
                                        )
                                      }
                                    >
                                      {page.status ? "Unpublish" : "Publish"}
                                    </DropdownItem>
                                  </DropdownMenu>
                                </Dropdown>
                              </td>
                              <td>
                                <div className="d-flex gap-2 justify-content-center">
                                  <FaEye
                                    style={{
                                      fontSize: "18px",
                                      color: "#007bff",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleView(page.business_social_id)
                                    }
                                    title="View"
                                  />
                                  <FaEdit
                                    style={{
                                      fontSize: "18px",
                                      color: "#4caf50",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleEdit(page.business_social_id)
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
                                      handleDelete(page.business_social_id)
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

      <style jsx>{`
        .hover-scale:hover {
          transform: scale(1.1) !important;
        }
        .table-container {
          max-height: 400px; /* Adjust this value based on your needs */
          overflow-y: auto; /* Vertical scrolling */
          overflow-x: auto; /* Horizontal scrolling */
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .table {
          margin-bottom: 0;
          min-width: 800px; /* Ensures horizontal scroll on smaller screens */
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

export default SocialInfoList;