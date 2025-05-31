import React, { useState, useEffect } from "react";
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
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
  Spinner,
} from "reactstrap";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaFileExcel,
  FaFilePdf,
  FaEyeSlash,
  FaFilter,
} from "react-icons/fa";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";
import {
  getPurchaseRequests,
  deletePurchaseRequest,
  adminLogin,
  sendPurchaseOrderEmail,
} from "../../../ApiService/Purchase/PurchaseRequest";

const PurchesRequestList = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [emailSendModalOpen, setEmailSendModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [loginForm, setLoginForm] = useState({
    loginId: "",
    password: "",
    loginType: "email",
  });
  const [filterForm, setFilterForm] = useState({
    requestNo: "",
    date: "",
    supplier: "",
  });
  const [loginError, setLoginError] = useState("");
  const [drugDetailsModalOpen, setDrugDetailsModalOpen] = useState(false);
  const [currentDrugDetails, setCurrentDrugDetails] = useState([]);
  const [supplierEmail, setSupplierEmail] = useState("");
  const [isAddingEmail, setIsAddingEmail] = useState(false);
  const [newSupplierEmail, setNewSupplierEmail] = useState("");
  const [pdfData, setPdfData] = useState({ blob: null, url: null });
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const fetchPurchaseRequests = async () => {
    try {
      setLoading(true);
      const data = await getPurchaseRequests();
      console.log("Fetched purchase requests:", data);
      const transformedData =
        data?.map((request) => ({
          id: request?.id,
          requestNo: request?.pr_no,
          date: request?.date,
          time: request?.time,
          requestedBy: request?.employee_name,
          supplier: request?.supplier_name,
          supplierId: request?.supplier_id,
          supplierEmail: request?.supplier_contact_details?.email || "N/A",
          supplierContactDetails: request?.supplier_contact_details,
          drugDetails: request?.drug_details,
          businessDetails: request?.business_details,
          orderStatus: request?.status ? "OrderInitiate" : "OrderNotInitiate",
          dropdownOpen: false,
        })) || [];
      setRequests(transformedData);
      setFilteredRequests(transformedData); // Initialize filtered requests
    } catch (error) {
      console.error("Error fetching purchase requests:", error);
      Swal.fire({
        title: "Error!",
        text: error?.message || "Failed to fetch purchase requests.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseRequests();
  }, []);

  const handleOrderStatusSelect = (id, status) => {
    if (status === "OrderInitiate") {
      setCurrentRequestId(id);
      const request = requests?.find((r) => r?.id === id);
      if (request?.supplierEmail) {
        setSupplierEmail(request.supplierEmail);
        setIsAddingEmail(false);
      } else {
        setSupplierEmail("");
        setIsAddingEmail(true);
      }
      toggleModal();
    } else {
      updateOrderStatus(id, status);
    }
  };

  const handleAdminLogin = async () => {
    try {
      setLoginLoading(true); 
      const credentials = {
        identifier: loginForm.loginId,
        password: loginForm.password,
        login_type: "admin"
      };

      const response = await adminLogin(credentials);
      if (response?.message === "Admin login successful!") {
        localStorage.setItem(
          "adminAuth",
          JSON.stringify({
            id: response?.id,
            access: response?.access,
            refresh: response?.refresh,
            message: response?.message,
          })
        );

        const request = requests?.find((r) => r?.id === currentRequestId);

        setLoginError("");
        toggleModal();

        const { blob, url } = generatePDF(request);
        setPdfData({ blob, url });
        setCurrentRequest(request);
        setPreviewModalOpen(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(error?.error || "Invalid credentials");
    } finally {
      setLoginLoading(false); // Stop spinner
    }
  };

  const handleSendEmail = () => {
    togglePreviewModal();
    setEmailSendModalOpen(true);
  };

  const handleConfirmSendEmail = async () => {
    setSubmissionLoading(true);
    const emailToUse = isAddingEmail ? newSupplierEmail : supplierEmail;
    const adminAuth = JSON.parse(localStorage.getItem("adminAuth")) || {};
    const adminId = adminAuth?.id || null;

    if (!adminId) {
      Swal.fire({
        title: "Error!",
        text: "Admin ID not found. Please log in again.",
        icon: "error",
        confirmButtonText: "OK",
      });
      toggleEmailSendModal();
      setSubmissionLoading(false);
      return;
    }

    if (!pdfData?.blob) {
      Swal.fire({
        title: "Error!",
        text: "PDF data not found. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
      toggleEmailSendModal();
      setSubmissionLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("admin_id", adminId);
      formData.append("email", emailToUse);
      formData.append(
        "file",
        pdfData.blob,
        `PO_${currentRequest?.requestNo || "unknown"}.pdf`
      );
      formData.append("supplier_id", currentRequest?.supplierId || "");
      formData.append("pr_no_id", currentRequest?.id || "");

      await sendPurchaseOrderEmail(formData);

      if (currentRequestId) {
        updateOrderStatus(currentRequestId, "OrderSent");
        await fetchPurchaseRequests();
      }

      toggleEmailSendModal();
      setSuccessModalOpen(true);
    } catch (error) {
      console.error("Error sending email:", error);
      Swal.fire({
        title: "Error!",
        text: error?.message || "Failed to send email to supplier.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setSubmissionLoading(false);
    }
  };

  const toggleModal = () => setModalOpen(!modalOpen);
  const toggleSuccessModal = () => setSuccessModalOpen(!successModalOpen);
  const togglePreviewModal = () => setPreviewModalOpen(!previewModalOpen);
  const toggleDrugDetailsModal = () =>
    setDrugDetailsModalOpen(!drugDetailsModalOpen);
  const toggleEmailSendModal = () => setEmailSendModalOpen(!emailSendModalOpen);
  const toggleFilterModal = () => setFilterModalOpen(!filterModalOpen);

  const showDrugDetails = (drugDetails) => {
    setCurrentDrugDetails(drugDetails);
    toggleDrugDetailsModal();
  };

  const updateOrderStatus = (id, status) => {
    setRequests(
      requests?.map((request) =>
        request?.id === id ? { ...request, orderStatus: status } : request
      ) || []
    );
    setFilteredRequests(
      filteredRequests?.map((request) =>
        request?.id === id ? { ...request, orderStatus: status } : request
      ) || []
    );
  };

  const handleLoginChange = (e) => {
    const { name, value } = e?.target || {};
    setLoginForm({ ...loginForm, [name]: value });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e?.target || {};
    setFilterForm({ ...filterForm, [name]: value });
  };

  const applyFilters = () => {
    const filtered = requests.filter((request) => {
      const matchesRequestNo = filterForm.requestNo
        ? request.requestNo
            ?.toLowerCase()
            .includes(filterForm.requestNo.toLowerCase())
        : true;
      const matchesDate = filterForm.date
        ? request.date === filterForm.date
        : true;
      const matchesSupplier = filterForm.supplier
        ? request.supplier
            ?.toLowerCase()
            .includes(filterForm.supplier.toLowerCase())
        : true;
      return matchesRequestNo && matchesDate && matchesSupplier;
    });
    setFilteredRequests(filtered);
    toggleFilterModal();
  };

  const resetFilters = () => {
    setFilterForm({ requestNo: "", date: "", supplier: "" });
    setFilteredRequests(requests);
    toggleFilterModal();
  };

  const generatePDF = (request) => {
    const doc = new jsPDF();
    doc.setFontSize(10);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 190, 277);

    // Use business_details from the request
    const business = request?.businessDetails || {};
    doc.text(`Store:- ${business?.business_name || "COMPANY NAME"} `, 14, 20);
    doc.text(
      business?.contact_number
        ? `Phone:- ${business.contact_number}`
        : "Phone:- (000) 000-0000",
      14,
      25
    );
    doc.text(`Email :- ${business?.email || "N/A"}`, 14, 30);

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("PURCHASE ORDER", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("DATE", 160, 20);
    doc.text(request?.date || "", 180, 20);
    doc.text("PR. NO. #", 160, 25);
    doc.text(request?.requestNo || "", 180, 25);

    const supplierDetails = request?.supplierContactDetails || {};
    console.log(supplierDetails);
    doc.text(`Supplier:-${request?.supplier || "N/A"}`, 14, 55);

    const tableBody =
    request?.drugDetails?.map((drug, index) => [
      index + 1, // Item number
      drug?.drug_name || "N/A",
      drug?.orderQuantity || 0,
    ]) || [];
  
  doc.autoTable({
    startY: 90,
    head: [["ITEM #", "DRUG NAME", "QTY"]],
    body: tableBody,
    theme: "grid",
    headStyles: { fillColor: [200, 200, 200], textColor: 0 },
    styles: { cellPadding: 2, fontSize: 10 },
  });
  

    doc.setFontSize(8);
    doc.text(
      "If you have any questions about this purchase order, please contact us.",
      14,
      270
    );
    doc.text("http://vertex42.com/ExcelTemplates/purchase-order.html", 14, 275);
    doc.text("Purchase Order Template © 2015 Vertex42", 140, 275);

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    return { blob: pdfBlob, url: pdfUrl };
  };
  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = (id) => {
    navigate(`/purchase-request-form`, { state: { id } });
  };

  const handleDelete = async (id) => {
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
          title: "Final Confirmation",
          text: "Are you absolutely sure you want to delete this?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#dc3545",
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Yes, permanently delete it!",
        }).then(async (finalResult) => {
          if (finalResult.isConfirmed) {
            try {
              await deletePurchaseRequest(id);
              setRequests(
                requests?.filter((request) => request?.id !== id) || []
              );
              setFilteredRequests(
                filteredRequests?.filter((request) => request?.id !== id) || []
              );
              Swal.fire(
                "Deleted!",
                "Purchase request has been deleted.",
                "success"
              );
            } catch (error) {
              console.error("Error deleting purchase request:", error);
              Swal.fire(
                "Error!",
                "Failed to delete purchase request.",
                "error"
              );
            }
          }
        });
      }
    });
  };

  const handleExcelDownload = () => {
    const escapeCsvField = (field) => {
      if (field === null || field === undefined) return '""';
      const str = String(field);
      if (str.includes('"') || str.includes(",") || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headers = [
      "Sr.No",
      "Request No.",
      "Date",
      "Time",
      "Requested By",
      "Supplier",
      "Drug Details",
      "Order Status",
    ];

    const rows =
      filteredRequests?.map((request, index) => [
        index + 1,
        request?.requestNo || "",
        request?.date || "",
        request?.time || "",
        request?.requestedBy || "",
        request?.supplier || "",
        request?.drugDetails
          ?.map(
            (drug) =>
              `${drug?.drug_name || ""} (${drug?.brand_name || ""}, Qty: ${
                drug?.orderQuantity || 0
              })`
          )
          .join("; ") || "",
        request?.orderStatus === "OrderInitiate"
          ? "Order Initiated"
          : request?.orderStatus === "OrderSent"
          ? "Order Sent"
          : "Order Not Initiated",
      ]) || [];

    const csvContent = [
      "\ufeff" + headers.map(escapeCsvField).join(","),
      ...rows.map((row) => row.map(escapeCsvField).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "purchase_requests.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Purchases"
            breadcrumbItem="Purchase Request List"
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
                      Purchase Request List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        onClick={() => navigate("/purchase-request-form")}
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
                        ></i>{" "}
                        Add
                      </Button>
                      <Button
                        color="info"
                        onClick={toggleFilterModal}
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
                        <FaFilter style={{ fontSize: "18px" }} /> Filter
                      </Button>
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
                        <FaFileExcel style={{ fontSize: "18px" }} /> Download
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
                          <th>Request No.</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Requested By</th>
                          <th>Supplier</th>
                          <th>Drug Details</th>
                          <th>Order Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="9" className="text-center">
                              Loading...
                            </td>
                          </tr>
                        ) : !filteredRequests?.length ? (
                          <tr>
                            <td colSpan="9" className="text-center">
                              No purchase requests found.
                            </td>
                          </tr>
                        ) : (
                          filteredRequests?.map((request, index) => (
                            <tr key={request?.id}>
                              <td>{index + 1}</td>
                              <td>{request?.requestNo || ""}</td>
                              <td>{request?.date || ""}</td>
                              <td>{request?.time || ""}</td>
                              <td>{request?.requestedBy || ""}</td>
                              <td>{request?.supplier || ""}</td>
                              <td>
                                <Button
                                  color="link"
                                  onClick={() =>
                                    showDrugDetails(request?.drugDetails)
                                  }
                                  className="p-0"
                                >
                                  Click to view details (
                                  {request?.drugDetails?.length || 0} items)
                                </Button>
                              </td>
                              <td>
                                <Dropdown
                                  isOpen={request?.dropdownOpen}
                                  toggle={() => {
                                    setFilteredRequests(
                                      filteredRequests?.map((req) =>
                                        req?.id === request?.id
                                          ? {
                                              ...req,
                                              dropdownOpen: !req?.dropdownOpen,
                                            }
                                          : req
                                      ) || []
                                    );
                                    setRequests(
                                      requests?.map((req) =>
                                        req?.id === request?.id
                                          ? {
                                              ...req,
                                              dropdownOpen: !req?.dropdownOpen,
                                            }
                                          : req
                                      ) || []
                                    );
                                  }}
                                >
                                  <DropdownToggle
                                    caret
                                    color={
                                      request?.orderStatus === "OrderInitiate"
                                        ? "success"
                                        : request?.orderStatus === "OrderSent"
                                        ? "primary"
                                        : "info"
                                    }
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
                                    {request?.orderStatus === "OrderInitiate"
                                      ? "Order Initiated"
                                      : request?.orderStatus === "OrderSent"
                                      ? "Order Sent"
                                      : "Order Not Initiated"}
                                  </DropdownToggle>
                                  <DropdownMenu>
                                    <DropdownItem
                                      onClick={() =>
                                        handleOrderStatusSelect(
                                          request?.id,
                                          "OrderNotInitiate"
                                        )
                                      }
                                    >
                                      Order Not Initiated
                                    </DropdownItem>
                                    <DropdownItem
                                      onClick={() =>
                                        handleOrderStatusSelect(
                                          request?.id,
                                          "OrderInitiate"
                                        )
                                      }
                                    >
                                      Order Initiated
                                    </DropdownItem>
                                  </DropdownMenu>
                                </Dropdown>
                              </td>
                              <td>
                                <div className="d-flex gap-1">
                                  <FaEdit
                                    style={{
                                      fontSize: "18px",
                                      color: "#4caf50",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleEdit(request?.id)}
                                    title="Edit"
                                  />
                                  <FaTrash
                                    style={{
                                      fontSize: "18px",
                                      color: "#f44336",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleDelete(request?.id)}
                                    title="Delete"
                                  />
                                </div>
                              </td>
                            </tr>
                          )) || []
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

      <Modal isOpen={modalOpen} toggle={toggleModal} centered>
        <div className="modal-3d">
          <ModalHeader toggle={toggleModal} className="modal-header-3d">
            Admin Login
          </ModalHeader>
          <ModalBody className="modal-body-3d">
            <Form>
              <FormGroup>
                <Label for="loginId">User ID (Email or Mobile Number)</Label>
                <Input
                  type="text"
                  name="loginId"
                  id="loginId"
                  placeholder="Enter Email or Mobile Number"
                  value={loginForm.loginId || ""}
                  onChange={handleLoginChange}
                  className="input-3d"
                  disabled={loginLoading}
                />
              </FormGroup>
              <FormGroup className="position-relative">
                <Label for="password">Password</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Enter password"
                  value={loginForm.password || ""}
                  onChange={handleLoginChange}
                  className="input-3d"
                  disabled={loginLoading}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    right: "10px",
                    top: "35px",
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </FormGroup>
              {loginError && (
                <div className="text-danger mb-3">{loginError}</div>
              )}
              {loginLoading && (
                <div className="text-center">
                  <Spinner color="primary" />
                </div>
              )}
            </Form>
          </ModalBody>
          <ModalFooter className="modal-footer-3d">
            <Button
              color="secondary"
              onClick={toggleModal}
              className="btn-3d"
              disabled={loginLoading}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleAdminLogin}
              className="btn-3d"
              disabled={loginLoading}
            >
              {loginLoading ? "Logging in..." : "Login & Proceed"}
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      <Modal
        isOpen={previewModalOpen}
        toggle={togglePreviewModal}
        size="lg"
        centered
      >
        <div className="modal-3d">
          <ModalHeader toggle={togglePreviewModal} className="modal-header-3d">
            Purchase Order Preview
          </ModalHeader>
          <ModalBody className="modal-body-3d">
            {pdfData?.url && (
              <iframe
                src={pdfData.url}
                style={{ width: "100%", height: "500px", border: "none" }}
                title="PDF Preview"
              />
            )}
            <FormGroup className="mt-3">
              <Label>Supplier Email</Label>
              {supplierEmail && !isAddingEmail ? (
                <div className="mb-2 d-flex align-items-center">
                  <Input
                    type="email"
                    value={supplierEmail}
                    readOnly
                    className="input-3d"
                  />
                  <Button
                    color="link"
                    size="sm"
                    onClick={() => setIsAddingEmail(true)}
                    style={{ marginLeft: "10px" }}
                  >
                    Change Email
                  </Button>
                </div>
              ) : (
                <div>
                  <Input
                    type="email"
                    value={newSupplierEmail}
                    onChange={(e) => setNewSupplierEmail(e.target.value)}
                    placeholder="Enter supplier email"
                    className="input-3d"
                    required
                  />
                  {supplierEmail && (
                    <Button
                      color="link"
                      size="sm"
                      onClick={() => {
                        setIsAddingEmail(false);
                        setNewSupplierEmail("");
                      }}
                      style={{ marginTop: "10px" }}
                    >
                      Cancel and Use Original Email
                    </Button>
                  )}
                </div>
              )}
            </FormGroup>
          </ModalBody>
          <ModalFooter className="modal-footer-3d">
            <Button
              color="secondary"
              onClick={togglePreviewModal}
              className="btn-3d"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleSendEmail}
              className="btn-3d"
              disabled={isAddingEmail && !newSupplierEmail}
            >
              Send to Supplier
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      <Modal isOpen={emailSendModalOpen} toggle={toggleEmailSendModal} centered>
        <div className="modal-3d">
          <ModalHeader
            toggle={toggleEmailSendModal}
            className="modal-header-3d"
          >
            Confirm Email Send
          </ModalHeader>
          <ModalBody className="modal-body-3d">
            {submissionLoading ? (
              <div className="text-center">Sending email...</div>
            ) : (
              <p>
                Are you sure you want to send the Purchase Order to{" "}
                <strong>
                  {isAddingEmail ? newSupplierEmail : supplierEmail}
                </strong>
                ?
              </p>
            )}
          </ModalBody>
          <ModalFooter className="modal-footer-3d">
            <Button
              color="secondary"
              onClick={toggleEmailSendModal}
              className="btn-3d"
              disabled={submissionLoading}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleConfirmSendEmail}
              className="btn-3d"
              disabled={submissionLoading}
            >
              {submissionLoading ? "Sending..." : "Confirm Send"}
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      <Modal isOpen={successModalOpen} toggle={toggleSuccessModal} centered>
        <div className="modal-3d">
          <ModalHeader
            toggle={toggleSuccessModal}
            className="modal-header-3d success-header"
          >
            Success!
          </ModalHeader>
          <ModalBody className="modal-body-3d">
            <div className="text-center">
              <i
                className="bx bx-check-circle"
                style={{ fontSize: "48px", color: "#28a745" }}
              ></i>
              <p className="mt-3">
                Purchase Order PDF has been emailed to the supplier
                successfully!
              </p>
            </div>
          </ModalBody>
          <ModalFooter className="modal-footer-3d">
            <Button
              color="success"
              onClick={toggleSuccessModal}
              className="btn-3d"
            >
              Close
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      <Modal
        isOpen={drugDetailsModalOpen}
        toggle={toggleDrugDetailsModal}
        size="lg"
      >
        <ModalHeader toggle={toggleDrugDetailsModal}>Drug Details</ModalHeader>
        <ModalBody>
          <Table
            className="table table-hover table-striped align-middle stylish-table"
            responsive
          >
            <thead>
              <tr>
                <th style={{ backgroundColor: "blue", color: "#fff" }}>#</th>
                <th style={{ backgroundColor: "blue", color: "#fff" }}>
                  Drug Name
                </th>
                <th style={{ backgroundColor: "blue", color: "#fff" }}>
                  Drug Brand
                </th>
                <th style={{ backgroundColor: "blue", color: "#fff" }}>
                  Drug Form
                </th>
                <th style={{ backgroundColor: "blue", color: "#fff" }}>
                  Drug Strength
                </th>
                <th style={{ backgroundColor: "blue", color: "#fff" }}>
                  Pack Qty
                </th>
                <th style={{ backgroundColor: "blue", color: "#fff" }}>
                  Unit Qty
                </th>
              </tr>
            </thead>
            <tbody>
              {currentDrugDetails?.map((drug, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{drug?.drug_name || "N/A"}</td>
                  <td>{drug?.brand_name || "N/A"}</td>
                  <td>{drug?.drug_form || "N/A"}</td>
                  <td>{drug?.drug_powers || "N/A"}</td>
                  <td>{drug?.orderQuantity || 0}</td>
                  <td>{drug?.orderUnitQuantity || 0}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleDrugDetailsModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={filterModalOpen} toggle={toggleFilterModal} centered>
        <div className="modal-3d">
          <ModalHeader toggle={toggleFilterModal} className="modal-header-3d">
            Filter Purchase Requests
          </ModalHeader>
          <ModalBody className="modal-body-3d">
            <Form>
              <FormGroup>
                <Label for="requestNo">Request No.</Label>
                <Input
                  type="text"
                  name="requestNo"
                  id="requestNo"
                  placeholder="Enter Request No."
                  value={filterForm.requestNo}
                  onChange={handleFilterChange}
                  className="input-3d"
                />
              </FormGroup>
              <FormGroup>
                <Label for="date">Date</Label>
                <Input
                  type="date"
                  name="date"
                  id="date"
                  value={filterForm.date}
                  onChange={handleFilterChange}
                  className="input-3d"
                />
              </FormGroup>
              <FormGroup>
                <Label for="supplier">Supplier</Label>
                <Input
                  type="text"
                  name="supplier"
                  id="supplier"
                  placeholder="Enter Supplier Name"
                  value={filterForm.supplier}
                  onChange={handleFilterChange}
                  className="input-3d"
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter className="modal-footer-3d">
            <Button color="secondary" onClick={resetFilters} className="btn-3d">
              Reset
            </Button>
            <Button color="primary" onClick={applyFilters} className="btn-3d">
              Apply Filters
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      <style jsx>{`
        .modal-3d {
          transform-style: preserve-3d;
          perspective: 1000px;
          background: #fff;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          transform: rotateX(5deg) rotateY(5deg);
          transition: transform 0.3s ease;
        }
        .modal-3d:hover {
          transform: rotateX(0deg) rotateY(0deg);
        }
        .modal-header-3d {
          background: linear-gradient(45deg, #007bff, #00c4cc);
          color: white;
          border-radius: 15px 15px 0 0;
          border-bottom: none;
          padding: 15px 20px;
        }
        .success-header {
          background: linear-gradient(45deg, #28a745, #71cb73);
        }
        .modal-body-3d {
          padding: 20px;
          background: #f8f9fa;
        }
        .modal-footer-3d {
          border-top: none;
          padding: 15px 20px;
          background: #f8f9fa;
          border-radius: 0 0 15px 15px;
        }
        .input-3d {
          border: none;
          border-radius: 8px;
          padding: 10px;
          background: #fff;
          box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.1),
            inset -2px -2px 5px rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
        }
        .input-3d:focus {
          box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.2),
            inset -1px -1px 3px rgba(255, 255, 255, 0.9);
          outline: none;
        }
        .btn-3d {
          border: none;
          border-radius: 8px;
          padding: 8px 20px;
          box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2),
            -3px -3px 6px rgba(255, 255, 255, 0.7);
          transition: all 0.2s ease;
        }
        .btn-3d:hover {
          box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25),
            -2px -2px 4px rgba(255, 255, 255, 0.8);
          transform: translateY(1px);
        }
        .btn-3d:active {
          box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.2),
            inset -2px -2px 4px rgba(255, 255, 255, 0.7);
          transform: translateY(2px);
        }
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
          min-width: 1000px;
        }
        .table-striped tbody tr:nth-of-type(odd) {
          background-color: rgba(0, 0, 0, 0.03);
        }
        .table-hover tbody tr:hover {
          background-color: rgba(0, 123, 255, 0.1);
        }
        .stylish-table {
          border-collapse: separate;
          border-spacing: 0;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .stylish-table th,
        .stylish-table td {
          padding: 12px;
          vertical-align: middle;
        }
        .stylish-table thead th {
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .stylish-table tbody tr:hover {
          background-color: rgba(0, 123, 255, 0.1);
          transition: background-color 0.2s ease;
        }
        .stylish-table tbody td {
          border-bottom: 1px solid #eee;
        }
      `}</style>
    </React.Fragment>
  );
};

export default PurchesRequestList;
