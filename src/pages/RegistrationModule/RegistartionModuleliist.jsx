import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Breadcrumbs from "../../components/Common/Breadcrumb"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import { deleteBusiness, fetchBusinesses, updateBusinessStatus } from "../../ApiService/Registration/Registration";
import Swal from "sweetalert2";

const RegistrationModuleList = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [businesses,setBusinesses] = useState([])

  useEffect(() => {
    fetchBusinessMaster();
  }, []);
  const fetchBusinessMaster = async() =>{
    try {
      const response = await fetchBusinesses();
      if(response){
        setBusinesses(response);
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({ ...prevState, [id]: !prevState[id] }));
  };

  const handleAddBusiness = () => {
    navigate("/registration");
  };

  const handleEdit = (business) => {
    navigate("/registration", { state: { business } });
  };

  const handleDelete = async (id) => {
    console.log(`Delete business with ID: ${id}`);
    try {
      const response = await deleteBusiness(id);
        fetchBusinessMaster();
        Swal.fire({
          title: "success",
          text: "Delete Successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
    } catch (error) {
      console.log(error);
      
    }
  };

  const handleStatusChange = async(id, currentStatus) => {
    const newStatus = currentStatus ? false : true;
    try {
      const response = await updateBusinessStatus(id,newStatus)
      if(response.status){
        fetchBusinessMaster();
        Swal.fire({
          title: "Success",
          text: `Status changed to ${newStatus? "Publice" :"Unpublished"}`,
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.log(error);
      
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Businesses" breadcrumbItem="All Registrations" />

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
                      Business Master
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={handleAddBusiness}
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
                        <FaPlus style={{ fontSize: "18px" }} />
                        Add Company
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
                        <i className="bx bx-undo" style={{ fontSize: "18px" }}></i>
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
                          background: "linear-gradient(90deg, #007bff, #00c4cc)",
                          color: "#fff",
                        }}
                      >
                        <tr>
                          <th>Sr.No</th>
                          <th>Business Name</th>
                          <th>Business Type</th>
                          <th>Email ID</th>
                          <th>Contact Number</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {businesses.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center">
                              No businesses found
                            </td>
                          </tr>
                        ) : (
                          businesses.map((business, index) => (
                            <tr key={business.business_id}>
                              <td>{index + 1}</td>
                              <td>{business.business_name}</td>
                              <td>{business.business_type}</td>
                              <td>{business.email}</td>
                              <td>{business.contact_number}</td>
                              <td>
                                <Button
                                  color={business.status ? "success" : "danger"}
                                  size="sm"
                                  onClick={() =>
                                    handleStatusChange(
                                      business.business_id,
                                      business.status
                                    )
                                  }
                                  style={{
                                    borderRadius: "5px",
                                    padding: "2px 8px",
                                    fontSize: "12px",
                                  }}
                                >
                                  {business.status ? "Published" : "Unpublished"}
                                </Button>
                              </td>
                              <td>
                                <div className="d-flex gap-2 justify-content-center">
                                  <FaEdit
                                    style={{
                                      fontSize: "18px",
                                      color: "#4caf50",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleEdit(business)}
                                    title="Edit"
                                  />
                                  <FaTrash
                                    style={{
                                      fontSize: "18px",
                                      color: "#f44336",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleDelete(business.business_id)}
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
          max-height: 400px;
          overflow-y: auto;
          overflow-x: auto;
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .table {
          margin-bottom: 0;
          min-width: 800px;
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

export default RegistrationModuleList;