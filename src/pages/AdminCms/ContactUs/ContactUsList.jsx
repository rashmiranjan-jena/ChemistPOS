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
import { fetchContactus, updateContactStatus,deleteContactUs } from "../../../ApiService/ContactUs/ContactUs"; 
import Swal from "sweetalert2";

const ContactUsList = () => {
  document.title = "ContactUs Registration";
  const navigate = useNavigate();
  const [contactUsData, setContactUsData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchContactus();
        setContactUsData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, []);

  const handleAddBrand = () => {
    navigate("/contactus");
  };

  const handleEdit = (id) => {
   navigate("/contactus", {state: {id}})
  };

  const handleDelete = (id) => {
    // First confirmation
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this contact info? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete it!",
      cancelButtonText: "No, Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Second confirmation
        Swal.fire({
          title: "Are you absolutely sure?",
          text: "This is your final chance to cancel the deletion.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, Delete it!",
          cancelButtonText: "No, Cancel",
        }).then(async (finalResult) => {
          if (finalResult.isConfirmed) {
            try {
              // Call the delete API method
              await deleteContactUs(id);

              // Update the UI by removing the deleted contact
              setContactUsData((prev) =>
                prev.filter((contact) => contact.contact_page_id !== id)
              );

              Swal.fire({
                title: "Deleted!",
                text: "The contact info has been deleted.",
                icon: "success",
                confirmButtonText: "OK",
              });
            } catch (error) {
              Swal.fire({
                title: "Error",
                text: "Failed to delete the contact info. Please try again.",
                icon: "error",
                confirmButtonText: "Retry",
              });
            }
          }
        });
      }
    });
  };

  const handleStatusChange = async (id, status) => {
    try {
      const response = await updateContactStatus(id, status);
      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `The status has been updated to ${status ? "Published" : "Unpublished"}.`,
      });
      setContactUsData(contactUsData.map(contact => 
        contact.contact_page_id === id ? { ...contact, status } : contact
      ));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update status. Please try again.",
      });
    }
  };
  return (
    <div className="page-content">
      {/* Breadcrumb */}
      <Breadcrumbs title="Contactus Info" breadcrumbItem="All Contactus Info" />

      <Card className="shadow">
        <CardBody>
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-primary">Contactus Master</h4>
            <Button color="primary" onClick={handleAddBrand}>
              <FaPlus className="mr-2" /> Add Contact
            </Button>
          </div>

          <div className="table-responsive" style={{ maxHeight: "500px" }}>
            {contactUsData.length === 0 ? (
              <p>No Data Available</p> 
            ) : (
              <Table bordered hover responsive className="custom-table">
                <thead className="table-light">
                  <tr>
                    <th>Sr. No.</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contactUsData.map((contact, index) => (
                    <tr key={contact.contact_page_id}>
                      <td>{index + 1}</td>
                      <td>{contact.phone}</td>
                      <td>{contact.email}</td>
                      <td>{contact.location}</td>
                      <td>
                        <Dropdown
                          isOpen={contact.isDropdownOpen}
                          toggle={() => {
                            setContactUsData(contactUsData.map((c) =>
                              c.contact_page_id === contact.contact_page_id
                                ? { ...c, isDropdownOpen: !c.isDropdownOpen }
                                : c
                            ));
                          }}
                        >
                          <DropdownToggle
                            caret
                            color={contact.status ? "success" : "danger"}
                            className="btn btn-white btn-sm btn-rounded"
                            onClick={(e) => e.preventDefault()}
                          >
                            <i
                              className={contact.status ? "far fa-dot-circle text-success" : "far fa-dot-circle text-danger"}
                            />{" "}
                            {contact.status ? "Published" : "Unpublished"}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              onClick={() => handleStatusChange(contact.contact_page_id, true)}
                            >
                              Published
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleStatusChange(contact.contact_page_id, false)}
                            >
                              Unpublished
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                      <td>
                        {/* <Button
                          color="link"
                          onClick={() => handleView(contact.contact_page_id)}
                          className="text-primary"
                        >
                          <FaEye size={20} />
                        </Button>{" "} */}
                        <Button
                          color="link"
                          onClick={() => handleEdit(contact.contact_page_id)}
                          className="text-warning"
                        >
                          <FaEdit size={20} />
                        </Button>{" "}
                        <Button
                          color="link"
                          onClick={() => handleDelete(contact.contact_page_id)}
                          className="text-danger"
                        >
                          <FaTrash size={20} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ContactUsList;
