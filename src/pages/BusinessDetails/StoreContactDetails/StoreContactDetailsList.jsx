import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { getBusinessContactList } from "../../../ApiService/SystemAdmin/businessContactDetails";
import Swal from "sweetalert2";

const StoreContactDetailsList = () => {
  const navigate = useNavigate();
  const [storeContacts, setStoreContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await getBusinessContactList();
        setStoreContacts(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch contact details!",
        });
      }
    };
    fetchContacts();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  

  const handleEdit = (id) => {
    navigate("/store-contact-details-form", {
      state: { department_contact_id: id },
    });
  };

  const handleDelete = (id, businessName) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete the contact for ${businessName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Confirm Deletion",
          text: "Please confirm again to delete this contact.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, confirm deletion!",
        }).then((secondResult) => {
          if (secondResult.isConfirmed) {
            console.log(`Delete store contact with ID: ${id}`);
            // Implement actual delete API call here
            Swal.fire("Deleted!", "The contact has been deleted.", "success");
          }
        });
      }
    });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Stores"
            breadcrumbItem="Store Contact Details List"
          />

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
                      Store Contact Details List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={() => navigate("/store-contact-details-form")}
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
                        Add Store Contact
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
                    {loading ? (
                      <div>Loading...</div>
                    ) : (
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
                            <th>Business Name</th>
                            <th>Contact Name</th>
                            <th>Phone No.</th>
                            <th>Email ID</th>
                            <th>City</th>
                            <th>District</th>
                            <th>State</th>
                            <th>Country</th>
                            <th>PIN/ZIP Code</th>
                            <th>Address 1</th>
                            <th>Address 2</th>
                            <th>Landmark</th>
                            <th>Phone No. 2</th>
                            <th>Website</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {storeContacts?.map((contact, index) => (
                            <tr key={contact?.department_contact_id}>
                              <td>{index + 1}</td>
                              <td>{contact?.department_contact_id}</td>
                              <td>{contact?.buisness_name}</td>
                              <td>{contact?.contact_details?.name}</td>
                              <td>{contact?.contact_details?.phoneNo}</td>
                              <td>{contact?.contact_details?.email}</td>
                              <td>{contact?.contact_details?.city}</td>
                              <td>{contact?.contact_details?.district}</td>
                              <td>{contact?.contact_details?.state}</td>
                              <td>{contact?.contact_details?.country}</td>
                              <td>{contact?.contact_details?.pinCode}</td>
                              <td>{contact?.contact_details?.address1}</td>
                              <td>{contact?.contact_details?.address2}</td>
                              <td>{contact?.contact_details?.landmark}</td>
                              <td>{contact?.contact_details?.phoneNo2}</td>
                              <td>
                                {contact?.contact_details?.website || "-"}
                              </td>
                              <td>
                                <div className="d-flex gap-2 justify-content-center">
                                 
                                  <FaEdit
                                    style={{
                                      fontSize: "18px",
                                      color: "#4caf50",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleEdit(contact?.department_contact_id)
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
                                      handleDelete(
                                        contact?.department_contact_id,
                                        contact?.buisness_name
                                      )
                                    }
                                    title="Delete"
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
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
          max-height: 400px;
          overflow-y: auto;
          overflow-x: auto;
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .table {
          margin-bottom: 0;
          min-width: 1200px;
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

export default StoreContactDetailsList;
