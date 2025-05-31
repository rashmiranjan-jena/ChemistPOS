import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { FaEye, FaEdit, FaTrash, FaFileExcel } from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getSellers,
  deleteSeller,
  uploadSellersExcel,
  downloadSellersExcel,
} from "../../../ApiService/Associate/SellerManagement";

const SellerManagementList = () => {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false); // Renamed for clarity
  const [selectedSeller, setSelectedSeller] = useState(null); // State for selected seller
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await getSellers();
      setSellers(response ?? []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sellers:", error);
      Swal.fire({
        title: "Error!",
        text: error?.message ?? "Failed to fetch sellers.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setLoading(false);
    }
  };

  const handleBack = () => navigate(-1);

  const handleView = (seller) => {
    setSelectedSeller(seller);
    setModalOpen(true);
  };

  const handleEdit = (id) =>
    navigate(`/seller-management-form`, { state: { id } });

  const handleDelete = async (id) => {
    const firstConfirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this seller.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "No, cancel",
    });

    if (firstConfirmation?.isConfirmed) {
      const secondConfirmation = await Swal.fire({
        title: "Confirm Deletion",
        text: "This action cannot be undone. Are you absolutely sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it",
        cancelButtonText: "No, keep it",
      });

      if (secondConfirmation?.isConfirmed) {
        try {
          await deleteSeller(id);
          setSellers(sellers.filter((seller) => seller?.id !== id));
          Swal.fire("Deleted!", "Seller has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting seller:", error);
          Swal.fire({
            title: "Error!",
            text: error?.message ?? "Failed to delete seller.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    }
  };

  // const handleExcelUpload = async (event) => {
  //   const file = event?.target?.files?.[0];
  //   if (file) {
  //     const formData = new FormData();
  //     formData.append("excel_file", file);

  //     try {
  //       await uploadSellersExcel(formData);
  //       Swal.fire("Success!", "Excel file uploaded successfully.", "success");
  //       await fetchSellers();
  //     } catch (error) {
  //       console.error("Error uploading Excel file:", error);
  //       Swal.fire({
  //         title: "Error!",
  //         text: error?.message ?? "Failed to upload Excel file.",
  //         icon: "error",
  //         confirmButtonText: "OK",
  //       });
  //     }
  //   } else {
  //     Swal.fire({
  //       title: "No File Selected!",
  //       text: "Please select an Excel file to upload.",
  //       icon: "warning",
  //       confirmButtonText: "OK",
  //     });
  //   }
  // };

  const handleExcelDownload = async () => {
    setDownloading(true);
    try {
      await downloadSellersExcel();
      Swal.fire({
        title: "Success!",
        text: "Excel file downloaded successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error downloading Excel file:", error);
      Swal.fire({
        title: "Error!",
        text: error?.message ?? "Failed to download Excel file.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setDownloading(false);
    }
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) setSelectedSeller(null);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Seller Management" breadcrumbItem="Seller List" />

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
                      Seller List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={() => navigate("/seller-management-form")}
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
                        <i
                          className="bx bx-plus"
                          style={{ fontSize: "18px" }}
                        ></i>
                        Add
                      </Button>
                      {/* <label
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
                        Upload
                      </label>
                      <input
                        id="excel-upload"
                        type="file"
                        accept=".xlsx, .xls"
                        style={{ display: "none" }}
                        onChange={handleExcelUpload}
                      /> */}
                      <Button
                        color="success"
                        onClick={handleExcelDownload}
                        disabled={downloading}
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
                        {downloading ? "Downloading..." : "Download"}
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
                          <th>Name</th>
                          <th>Short Form</th>
                          <th>Seller Type</th>
                          <th>Contact</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="7" className="text-center">
                              Loading sellers...
                            </td>
                          </tr>
                        ) : sellers?.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center">
                              No sellers found.
                            </td>
                          </tr>
                        ) : (
                          sellers.map((seller, index) => (
                            <tr key={seller?.id ?? index}>
                              <td>{index + 1}</td>
                              <td>{seller?.id ?? "N/A"}</td>
                              <td>{seller?.seller_name ?? "N/A"}</td>
                              <td>{seller?.short_form ?? "N/A"}</td>
                              <td>{seller?.seller_type_name ?? "N/A"}</td>
                              <td>
                                <div>
                                  {seller?.contact_details?.phone ?? "N/A"}
                                </div>
                                <div>
                                  {seller?.contact_details?.email ?? "N/A"}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex gap-2 justify-content-center">
                                  <FaEye
                                    style={{
                                      fontSize: "18px",
                                      color: "#007bff",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleView(seller)}
                                    title="View"
                                  />
                                  <FaEdit
                                    style={{
                                      fontSize: "18px",
                                      color: "#4caf50",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleEdit(seller?.id)}
                                    title="Edit"
                                  />
                                  <FaTrash
                                    style={{
                                      fontSize: "18px",
                                      color: "#f44336",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleDelete(seller?.id)}
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

      {/* Modal for Seller Details */}
      <Modal isOpen={modalOpen} toggle={toggleModal} centered size="lg">
        <ModalHeader
          toggle={toggleModal}
          style={{
            background: "linear-gradient(90deg, #007bff, #00c4cc)",
            color: "#fff",
          }}
        >
          Seller Details
        </ModalHeader>
        <ModalBody>
          {selectedSeller && (
            <ListGroup flush>
              <ListGroupItem>
                <strong>ID:</strong> {selectedSeller?.id ?? "N/A"}
              </ListGroupItem>
              <ListGroupItem>
                <strong>Seller Name:</strong>{" "}
                {selectedSeller?.seller_name ?? "N/A"}
              </ListGroupItem>
              <ListGroupItem>
                <strong>Short Form:</strong>{" "}
                {selectedSeller?.short_form ?? "N/A"}
              </ListGroupItem>
              <ListGroupItem>
                <strong>Logo:</strong>{" "}
                {selectedSeller?.logo ? (
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}${selectedSeller.logo}`}
                    alt={selectedSeller?.seller_name ?? "Seller"}
                    style={{ width: "100px", marginTop: "10px" }}
                    onError={(e) => (e.target.src = "/default-logo.png")}
                  />
                ) : (
                  "N/A"
                )}
              </ListGroupItem>
              <ListGroupItem>
                <strong>Description:</strong>{" "}
                {selectedSeller?.description ?? "N/A"}
              </ListGroupItem>
              <ListGroupItem>
                <strong>Drug Licence No:</strong>{" "}
                {selectedSeller?.drug_licence_no ?? "N/A"}
              </ListGroupItem>
              <ListGroupItem>
                <strong>Pharma Certificate:</strong>{" "}
                {selectedSeller?.pharma_certificate ? (
                  <a
                    href={`${import.meta.env.VITE_API_BASE_URL}${selectedSeller.pharma_certificate}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#007bff",
                      textDecoration: "underline",
                    }}
                  >
                    View Certificate
                  </a>
                ) : (
                  "N/A"
                )}
              </ListGroupItem>
              <ListGroupItem>
                <strong>Pharma Certificate No:</strong>{" "}
                {selectedSeller?.pharma_certificate_no ?? "N/A"}
              </ListGroupItem>
              <ListGroupItem>
                <strong>GST No:</strong> {selectedSeller?.GST_no ?? "N/A"}
              </ListGroupItem>
              <ListGroupItem>
                <strong>FSSAI No:</strong> {selectedSeller?.FASSI_no ?? "N/A"}
              </ListGroupItem>
              <ListGroupItem>
                <strong>Prohibited:</strong>{" "}
                <span
                  className={`badge ${
                    selectedSeller?.prohibited_status ? "bg-danger" : "bg-success"
                  }`}
                >
                  {selectedSeller?.prohibited_status ? "Yes" : "No"}
                </span>
              </ListGroupItem>
              <ListGroupItem>
                <strong>Seller Type:</strong>{" "}
                {selectedSeller?.seller_type_name ?? "N/A"}
              </ListGroupItem>
              <ListGroupItem>
                <strong>Manufacturer:</strong>{" "}
                {selectedSeller?.manufacturer_name ?? "N/A"}
              </ListGroupItem>
              <ListGroupItem>
                <strong>Discount:</strong>{" "}
                {selectedSeller?.discount
                  ? `${selectedSeller.discount}%`
                  : "N/A"}
              </ListGroupItem>
              <ListGroupItem>
                <strong>Expiry Management:</strong>{" "}
                <span
                  className={`badge ${
                    selectedSeller?.expirymanagement
                      ? "bg-success"
                      : "bg-secondary"
                  }`}
                >
                  {selectedSeller?.expirymanagement ? "Yes" : "No"}
                </span>
              </ListGroupItem>
              <ListGroupItem>
                <strong>Drug Type:</strong>{" "}
                {selectedSeller?.drug_type_name ?? "N/A"}
              </ListGroupItem>
              <ListGroupItem>
                <strong>Contact Details:</strong>
                <div>Phone: {selectedSeller?.contact_details?.phone ?? "N/A"}</div>
                <div>Email: {selectedSeller?.contact_details?.email ?? "N/A"}</div>
                <div>
                  Website: {selectedSeller?.contact_details?.website ?? "N/A"}
                </div>
                <div>
                  Address: {selectedSeller?.contact_details?.address ?? "N/A"}
                </div>
              </ListGroupItem>
              <ListGroupItem>
                <strong>Credit Details:</strong>
                <div>
                  Collection Type:{" "}
                  {selectedSeller?.credit_details?.collectionType ?? "N/A"}
                </div>
                <div>
                  Collection Day:{" "}
                  {selectedSeller?.credit_details?.collectionDay ?? "N/A"}
                </div>
                <div>
                  Interest Rate:{" "}
                  {selectedSeller?.credit_details?.interestRate
                    ? `${selectedSeller.credit_details.interestRate}%`
                    : "N/A"}
                </div>
                <div>
                  Credit Period:{" "}
                  {selectedSeller?.credit_details?.creditPeriod ?? "N/A"}
                </div>
                <div>
                  Credit Limit:{" "}
                  {selectedSeller?.credit_details?.creditLimit ?? "N/A"}
                </div>
                <div>
                  Invoice Limit:{" "}
                  {selectedSeller?.credit_details?.invoiceLimit ?? "N/A"}
                </div>
                <div>
                  Billing Cycle:{" "}
                  {selectedSeller?.credit_details?.billingCycle ?? "N/A"}
                </div>
                <div>
                  Payment Cycle:{" "}
                  {selectedSeller?.credit_details?.paymentCycle ?? "N/A"}
                </div>
              </ListGroupItem>
            </ListGroup>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

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
          min-width: 800px; /* Adjusted for fewer columns */
        }
        .table-striped tbody tr:nth-of-type(odd) {
          background-color: rgba(0, CommodityTypeMasterList.jsx0, 0, 0.03);
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

export default SellerManagementList;