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
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaFileExcel } from "react-icons/fa"; // Icons for actions and Excel
import Breadcrumbs from "../../../components/Common/Breadcrumb"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteBusinessBrandDetails, getBusinessBrandDetails, statusChange } from "../../../ApiService/BusinessOverview/Brandinfo";

const BrandInfoList = () => {
  const navigate = useNavigate();
  const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

  // Static sample brand data
  const [brandInfo, setBrandInfo] = useState([]);

  const [modal, setModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState({});

  // fetch brand info data
  useEffect(() => {
    fetchBrandInfo();
  },[]);
// fetch brand info data
const fetchBrandInfo = async () => {
  try {
    const response = await getBusinessBrandDetails();
    if (response.status === 200) {
      setBrandInfo(response.data);
    }
  } catch (error) {
    console.error("Error fetching brand info data:", error);
  }
}

  const toggleModal = () => setModal(!modal);

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddBrand = () => {
    navigate("/brandinfo");
  };

 

  const handleEdit = (brand) => {
    navigate("/brandinfo", { state: { brand } });
  };

  const handleStatusChange = async(id, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      const response = await statusChange(id, { status: newStatus });
      if (response.status === 200) {
        fetchBrandInfo();
        Swal.fire("Status updated successfully!",{
          icon: "success",
          confirmButtonText: "OK",
          timer: 1500,

        });
      }
    } catch (error) {
      console.log("Error changing status:", error);
      
    }
    // setBrandInfo((prevState) =>
    //   prevState.map((brand) =>
    //     brand.business_brand_id === id ? { ...brand, status: newStatus } : brand
    //   )
    // );
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed!",
    }).then((firstResult) => {
      if (firstResult.isConfirmed) {
        
        Swal.fire({
          title: "Are you absolutely sure?",
          text: "This action is irreversible!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
        }).then(async(secondResult) => {
          if (secondResult.isConfirmed) {
            try {
              const response = await deleteBusinessBrandDetails(id);
              if (response.status === 204) {
                Swal.fire("Deleted!", "The brand has been deleted.", "success");
                fetchBrandInfo();
              }
            } catch (error) {
              console.log("Error deleting brand:", error);
              
            }
          }
        });
      }
    });
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    toggleModal();
  };

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Excel file selected:", file.name);
      // Implement your Excel upload logic here (e.g., static data update)
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Brand Info" breadcrumbItem="Brand Info List" />

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
                      Brand Info List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={handleAddBrand}
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
                        Add Brand
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
                          <th>Header Logo</th>
                          <th>Footer Logo</th>
                          <th>Favicon Logo</th>
                          <th>Header/Footer Letterhead</th>
                          <th>Watermark Logo</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {brandInfo.length === 0 ? (
                          <tr>
                            <td colSpan="9" className="text-center">
                              <p>No Data Available</p>
                            </td>
                          </tr>
                        ) : (
                          brandInfo.map((brand, index) => (
                            <tr key={brand.business_brand_id}>
                              <td>{index + 1}</td>
                              <td>{brand.business_brand_id}</td>
                              <td>
                                <img
                                  src={`${BASE_URL}${brand.header_logo}`}
                                  alt="Header Logo"
                                  style={{
                                    width: "50px",
                                    height: "auto",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleImageClick(brand.header_logo)
                                  }
                                />
                              </td>
                              <td>
                                <img
                                  src={`${BASE_URL}${brand.footer_logo}`}
                                  alt="Footer Logo"
                                  style={{
                                    width: "50px",
                                    height: "auto",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleImageClick(brand.footer_logo)
                                  }
                                />
                              </td>
                              <td>
                                <img
                                  src={`${BASE_URL}${brand.favicon}`}
                                  alt="Favicon Logo"
                                  style={{
                                    width: "30px",
                                    height: "auto",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleImageClick(brand.favicon)
                                  }
                                />
                              </td>
                              <td>
                                <img
                                  src={`${BASE_URL}${brand.header_footer_letterhead}`}
                                  alt="Letterhead Logo"
                                  style={{
                                    width: "50px",
                                    height: "auto",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleImageClick(
                                      brand.header_footer_letterhead
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <img
                                  src={`${BASE_URL}${brand.watermark_letterhead}`}
                                  alt="Watermark Logo"
                                  style={{
                                    width: "50px",
                                    height: "auto",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleImageClick(brand.watermark_letterhead)
                                  }
                                />
                              </td>
                              <td>
                                <Dropdown
                                  isOpen={dropdownOpen[brand.business_brand_id]}
                                  toggle={() =>
                                    toggleDropdown(brand.business_brand_id)
                                  }
                                >
                                  <DropdownToggle
                                    caret
                                    color={brand.status ? "success" : "danger"}
                                    className="btn btn-sm btn-rounded"
                                  >
                                    <i
                                      className={
                                        brand.status
                                          ? "far fa-dot-circle text-success"
                                          : "far fa-dot-circle text-danger"
                                      }
                                    />{" "}
                                    {brand.status ? "Published" : "Unpublished"}
                                  </DropdownToggle>
                                  <DropdownMenu>
                                    <DropdownItem
                                      onClick={() =>
                                        handleStatusChange(
                                          brand.business_brand_id,
                                          brand.status
                                        )
                                      }
                                    >
                                      {brand.status ? "Unpublish" : "Publish"}
                                    </DropdownItem>
                                  </DropdownMenu>
                                </Dropdown>
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
                                      handleEdit(brand)
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
                                      handleDelete(brand.business_brand_id)
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

      {/* Modal for Image */}
      <Modal isOpen={modal} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>Photo</ModalHeader>
        <ModalBody>
          <img
            src={selectedImage}
            alt="Selected Logo"
            className="img-fluid"
            style={{ maxWidth: "100%" }}
          />
        </ModalBody>
      </Modal>

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

export default BrandInfoList;