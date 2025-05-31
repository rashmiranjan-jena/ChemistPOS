import React, { useState } from "react";
import { Button, Card, CardBody, Col, Container, Row, Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaFileExcel } from "react-icons/fa"; // Icons for actions and Excel
import Breadcrumbs from "../../../components/Common/Breadcrumb"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Static data
const staticContactData = [
  {
    department_contact_id: 1,
    department_name: "Sales",
    buisness_name: "ABC Corp",
    contact_details: "+1-123-456-7890",
    contact_person_name: "John Doe",
    designation: "Sales Manager",
    email_id: "john.doe@abccorp.com",
    status: true,
  },
  {
    department_contact_id: 2,
    department_name: "Support",
    buisness_name: "XYZ Ltd",
    contact_details: "+1-987-654-3210",
    contact_person_name: "Jane Smith",
    designation: "Support Lead",
    email_id: "jane.smith@xyz.com",
    status: false,
  },
  {
    department_contact_id: 3,
    department_name: "HR",
    buisness_name: "ABC Corp",
    contact_details: "+1-555-123-4567",
    contact_person_name: "Emily Johnson",
    designation: "HR Manager",
    email_id: "emily.johnson@abccorp.com",
    status: true,
  },
];

const ContactInfoList = () => {
  const navigate = useNavigate();
  const [contactInfoData, setContactInfoData] = useState(staticContactData);
  const [dropdownOpen, setDropdownOpen] = useState({});

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddContactInfo = () => {
    navigate("/contactinfo");
  };

  const handleView = (id) => {
    navigate(`/contactinfo-details/${id}`);
  };

  const handleEdit = (id) => {
    navigate("/contactinfo", { state: { id } });
  };

  const handleStatusChange = (id, status) => {
    const updatedData = contactInfoData.map((contact) =>
      contact.department_contact_id === id
        ? { ...contact, status: status }
        : contact
    );
    setContactInfoData(updatedData);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Are you really sure?",
          text: "This action is irreversible.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        }).then((finalResult) => {
          if (finalResult.isConfirmed) {
            setContactInfoData(contactInfoData.filter((contact) => contact.department_contact_id !== id));
            Swal.fire("Deleted!", "Your contact info has been deleted.", "success");
          }
        });
      }
    });
  };

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Excel file selected:", file.name);
      // You can add logic here to process the uploaded Excel file if needed
    }
  };

  const handleExcelDownload = () => {
    const headers = [
      "Sr.No",
      "ID",
      "Department Name",
      "Business Name",
      "Contact Details",
      "Contact Person Name",
      "Designation",
      "Email",
      "Status",
    ];
    const rows = contactInfoData.map((contact, index) => [
      index + 1,
      contact.department_contact_id,
      contact.department_name,
      contact.buisness_name,
      contact.contact_details,
      contact.contact_person_name,
      contact.designation,
      contact.email_id,
      contact.status ? "Published" : "Unpublished",
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "contact_info.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Contact Info" breadcrumbItem="Contact Info List" />

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
                      Contact Info List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={handleAddContactInfo}
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
                        Add Contact Info
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
                        Upload Excel
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
                        Download Excel
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
                          <th>Department Name</th>
                          <th>Business Name</th>
                          <th>Contact Details</th>
                          <th>Contact Person Name</th>
                          <th>Designation</th>
                          <th>Email</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contactInfoData.length === 0 ? (
                          <tr>
                            <td colSpan="10" className="text-center">
                              <p>No Data Available</p>
                            </td>
                          </tr>
                        ) : (
                          contactInfoData.map((contact, index) => (
                            <tr key={contact.department_contact_id}>
                              <td>{index + 1}</td>
                              <td>{contact.department_contact_id}</td>
                              <td>{contact.department_name}</td>
                              <td>{contact.buisness_name}</td>
                              <td>{contact.contact_details}</td>
                              <td>{contact.contact_person_name}</td>
                              <td>{contact.designation}</td>
                              <td>{contact.email_id}</td>
                              <td>
                                <Dropdown
                                  isOpen={dropdownOpen[contact.department_contact_id]}
                                  toggle={() => toggleDropdown(contact.department_contact_id)}
                                >
                                  <DropdownToggle
                                    caret
                                    color={contact.status ? "success" : "danger"}
                                    className="btn btn-sm btn-rounded"
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    <i
                                      className={
                                        contact.status
                                          ? "far fa-dot-circle text-success"
                                          : "far fa-dot-circle text-danger"
                                      }
                                    />{" "}
                                    {contact.status ? "Published" : "Unpublished"}
                                  </DropdownToggle>
                                  <DropdownMenu>
                                    <DropdownItem
                                      onClick={() =>
                                        handleStatusChange(
                                          contact.department_contact_id,
                                          !contact.status
                                        )
                                      }
                                    >
                                      {contact.status ? "Unpublish" : "Publish"}
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
                                    onClick={() => handleView(contact.department_contact_id)}
                                    title="View"
                                  />
                                  <FaEdit
                                    style={{
                                      fontSize: "18px",
                                      color: "#4caf50",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleEdit(contact.department_contact_id)}
                                    title="Edit"
                                  />
                                  <FaTrash
                                    style={{
                                      fontSize: "18px",
                                      color: "#f44336",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleDelete(contact.department_contact_id)}
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
          min-width: 1000px; /* Ensures horizontal scroll on smaller screens */
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

export default ContactInfoList;