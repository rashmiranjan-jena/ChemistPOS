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
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaFileExcel,
  FaPlus,
  FaPaperPlane,
  FaFilter,
} from "react-icons/fa";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";
import {
  getReturnBill,
  PostReturneOrderEmail,
} from "../../ApiService/ReturnDrug/ReturnProduct";

const ReturnBill = () => {
  const navigate = useNavigate();
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [returnBills, setReturnBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [emailSendModalOpen, setEmailSendModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [pdfData, setPdfData] = useState({
    original: { blob: null, url: null, billNumber: "" },
    duplicate: { blob: null, url: null, billNumber: "" },
  });
  const [selectedBill, setSelectedBill] = useState(null);
  const [supplierEmail, setSupplierEmail] = useState("");
  const [isAddingEmail, setIsAddingEmail] = useState(true);
  const [newSupplierEmail, setNewSupplierEmail] = useState("");
  const [filters, setFilters] = useState({
    returnBillNumber: "",
    date: "",
    refMemoNumber: "",
    collectionBoyName: "",
    mobileNumber: "",
    email: "",
  });

  useEffect(() => {
    const fetchReturnBills = async () => {
      try {
        const response = await getReturnBill();
        setReturnBills(response || []);
        setFilteredBills(response || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch return bills. Please try again.");
        setLoading(false);
      }
    };

    fetchReturnBills();
  }, []);

  useEffect(() => {
    const filtered = returnBills.filter((bill) => {
      const billNumberMatch = bill?.return_bill_no
        ?.toLowerCase()
        .includes(filters.returnBillNumber.toLowerCase());
      const dateMatch = filters.date
        ? bill?.date && new Date(bill.date).toISOString().slice(0, 10) === filters.date
        : true;
    
      return billNumberMatch && dateMatch;
    });
    setFilteredBills(filtered);
  }, [filters, returnBills]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      returnBillNumber: "",
      date: "",
      refMemoNumber: "",
      collectionBoyName: "",
      mobileNumber: "",
      email: "",
    });
  };

  const handleBack = () => {
    navigate(-1);
  };



  const handleEdit = (id) => {
    console.log(`Edit return bill with ID: ${id}`);
    navigate(`/return-bill-form`, { state: { id } });
  };

  const handleDelete = (id) => {
    console.log(`Delete return bill with ID: ${id}`);
  };

  const handleExcelDownload = () => {
    const headers = [
      "Sr.No",
      "Return Bill Number",
      "Date",
      "Ref. Memo Number",
      "Collection Boy Name",
      "Mobile Number",
      "Email",
      "Photo URL",
    ];
    const rows = filteredBills.map((bill, index) => [
      index + 1,
      bill?.return_bill_no || "N/A",
      bill?.date ? new Date(bill.date).toLocaleString() : "N/A",
      bill?.memo_no_name || "N/A",
      bill?.collection_boy_name || "N/A",
      bill?.mobile_no || "N/A",
      bill?.email || "N/A",
      bill?.photo || "N/A",
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "return_bills.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const togglePhotoModal = () => setPhotoModalOpen(!photoModalOpen);

  const handleViewPhoto = (photo) => {
    setSelectedPhoto(photo);
    togglePhotoModal();
  };

  const handleAddReturnBillForMemo = (id) => {
    navigate("/return-adjusment-form", {
      state: { id },
    });
  };

  const togglePreviewModal = () => setPreviewModalOpen(!previewModalOpen);
  const toggleEmailSendModal = () => setEmailSendModalOpen(!emailSendModalOpen);
  const toggleSuccessModal = () => setSuccessModalOpen(!successModalOpen);

  const generatePDF = (bill) => {
    const billNumber = bill?.return_bill_no || "RB-AUTO";
    const memoDate = bill?.date
      ? new Date(bill.date).toISOString().slice(0, 10)
      : "N/A";

    const createPDF = (isDuplicate = false) => {
      try {
        const doc = new jsPDF();

        // Header
        doc.setFillColor(0, 123, 255);
        doc.rect(0, 0, 210, 30, "F");
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text("Pharmacy Management System", 105, 15, { align: "center" });
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Your Trusted Healthcare Partner", 105, 22, {
          align: "center",
        });

        // Title
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text(
          `Return Bill${isDuplicate ? " (Duplicate)" : " (Original)"}`,
          105,
          40,
          { align: "center" }
        );

        // Duplicate Watermark
        if (isDuplicate) {
          doc.setFontSize(40);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(200, 200, 200);
          doc.text("DUPLICATE", 105, 150, { angle: 45, align: "center" });
        }

        // Border
        doc.setLineWidth(0.5);
        doc.setDrawColor(0, 123, 255);
        doc.rect(10, 35, 190, 250);

        // Bill Information
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text(`Return Bill Number: ${billNumber}`, 14, 50);
        doc.text(`Date: ${memoDate}`, 14, 58);
        doc.text(`Ref. Memo Number: ${bill?.memo_no_name || "N/A"}`, 14, 66);
        doc.text(
          `Collection Boy Name: ${bill?.collection_boy_name || "N/A"}`,
          14,
          74
        );
        doc.text(`Mobile Number: ${bill?.mobile_no || "N/A"}`, 14, 82);
        doc.text(`Email: ${bill?.email || "N/A"}`, 14, 90);

        // Divider
        doc.setLineWidth(0.2);
        doc.setDrawColor(200, 200, 200);
        doc.line(14, 96, 196, 96);

        // Products Details
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 123, 255);
        doc.text("Products Details", 14, 104);

        const productColumns = [
          "Product Name",
          "Batch No",
          "Expiry Date",
          "Quantity",
        ];
        const productRows =
          bill?.products?.map((product) => [
            product.productName || "N/A",
            product.batchNo || "N/A",
            product.expiryDate || "N/A",
            product.quantity?.toString() || "N/A",
          ]) || [];

        doc.autoTable({
          head: [productColumns],
          body: productRows,
          startY: 110,
          styles: {
            fontSize: 10,
            cellPadding: 3,
            textColor: [0, 0, 0],
            fillColor: [255, 255, 255],
          },
          headStyles: {
            fillColor: [0, 123, 255],
            textColor: [255, 255, 255],
            fontStyle: "bold",
          },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { left: 14, right: 14 },
          columnStyles: {
            0: { cellWidth: 50 }, // Product Name
            1: { cellWidth: 30 }, // Batch No
            2: { cellWidth: 30 }, // Expiry Date
            3: { cellWidth: 30 }, // Quantity
          },
        });

        // Collection Details
        let startY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 123, 255);
        doc.text("Collection Details", 14, startY);

        const tableColumn = ["Field", "Value"];
        const tableRows = [
          ["Collection Boy Name", bill?.collection_boy_name || "N/A"],
          ["Mobile Number", bill?.mobile_no || "N/A"],
          ["Photo Included", bill?.photo ? "Yes" : "No"],
        ];

        doc.autoTable({
          head: [tableColumn],
          body: tableRows,
          startY: startY + 6,
          styles: {
            fontSize: 10,
            cellPadding: 3,
            textColor: [0, 0, 0],
            fillColor: [255, 255, 255],
          },
          headStyles: {
            fillColor: [0, 123, 255],
            textColor: [255, 255, 255],
            fontStyle: "bold",
          },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { left: 14, right: 14 },
        });

        // Photo (if provided)
        startY = doc.lastAutoTable.finalY + 10;
        if (bill?.photo) {
          try {
            const imgData = `${import.meta.env.VITE_API_BASE_URL}${bill.photo}`;
            const imgWidth = 80;
            const imgHeight = 60;
            doc.addImage(imgData, "JPEG", 14, startY, imgWidth, imgHeight);
            startY += imgHeight + 10;
          } catch (error) {
            console.error("Error adding image to PDF:", error);
          }
        }

        // Footer
        doc.setFillColor(0, 123, 255);
        doc.rect(0, 287, 210, 10, "F");
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.text("Contact: support@vichaarlab.com | 8457045959", 105, 292, {
          align: "center",
        });

        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        return { blob: pdfBlob, url: pdfUrl, billNumber };
      } catch (error) {
        console.error("Error creating PDF:", error);
        return null;
      }
    };

    try {
      const originalPDF = createPDF(false);
      const duplicatePDF = createPDF(true);

      if (!originalPDF || !duplicatePDF) {
        throw new Error("Failed to generate one or both PDFs");
      }

      setPdfData({
        original: originalPDF,
        duplicate: duplicatePDF,
      });
    } catch (error) {
      console.error("Error generating PDFs:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to generate PDF. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Handle send return bill
  const handleSendReturnBill = (bill) => {
    setSelectedBill(bill);
    setSupplierEmail(bill?.email || "");
    setIsAddingEmail(!bill?.email);
    setNewSupplierEmail("");
    generatePDF(bill);
    setPreviewModalOpen(true);
  };

  // Handle email sending
  const handleSendEmail = () => {
    togglePreviewModal();
    setEmailSendModalOpen(true);
  };

  const handleConfirmSendEmail = async () => {
    setSubmissionLoading(true);
    const emailToUse = isAddingEmail ? newSupplierEmail : supplierEmail;

    if (!emailToUse) {
      Swal.fire({
        title: "Error!",
        text: "Supplier email is required. Please provide an email.",
        icon: "error",
        confirmButtonText: "OK",
      });
      toggleEmailSendModal();
      setSubmissionLoading(false);
      return;
    }

    if (!pdfData.original?.blob) {
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
      formData.append("email", emailToUse);
      formData.append(
        "file",
        pdfData.original.blob,
        `Return_Bill_${pdfData.original.billNumber}.pdf`
      );
      formData.append("date", selectedBill?.date || "");
      formData.append("memo_no", selectedBill?.memo_no_name || "");
      formData.append(
        "collection_boy_name",
        selectedBill?.collection_boy_name || ""
      );
      formData.append("mobile_no", selectedBill?.mobile_no || "");

      await PostReturneOrderEmail(formData);

      // Swal.fire({
      //   title: "Success!",
      //   text: "Return Bill has been emailed to the supplier successfully!",
      //   icon: "success",
      //   confirmButtonText: "OK",
      // });

      toggleEmailSendModal();
      setSuccessModalOpen(true);
      setTimeout(() => {
        setSuccessModalOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Error sending email:", error);
      // Swal.fire({
      //   title: "Error!",
      //   text: error?.message || "Failed to send email to supplier.",
      //   icon: "error",
      //   confirmButtonText: "OK",
      // });
    } finally {
      setSubmissionLoading(false);
    }
  };

  // Download PDF
  const downloadPDF = (type) => {
    const pdf = pdfData[type];
    if (pdf?.url) {
      const link = document.createElement("a");
      link.href = pdf.url;
      link.download = `Return_Bill_${pdf.billNumber}_${type}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Inventory" breadcrumbItem="Return Bill List" />

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
                      Return Bill List
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
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

                  {/* Filter Section */}
                  <Row className="mb-4">
                    <div className="mb-4">
                      <h5
                        className="mb-3 d-flex align-items-center gap-2"
                        style={{
                          fontWeight: "600",
                          color: "#007bff",
                          borderBottom: "2px solid #007bff",
                          paddingBottom: "5px",
                        }}
                      >
                        <FaFilter /> Filters
                      </h5>
                      <Row>
                        <Col md="4">
                          <FormGroup>
                            <Label for="returnBillNumber">
                              Return Bill Number
                            </Label>
                            <Input
                              type="text"
                              name="returnBillNumber"
                              id="returnBillNumber"
                              value={filters.returnBillNumber}
                              onChange={handleFilterChange}
                              placeholder="Enter bill number"
                              className="input-3d"
                              disabled={loading}
                            />
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup>
                            <Label for="date">Date</Label>
                            <Input
                              type="date"
                              name="date"
                              id="date"
                              value={filters.date}
                              onChange={handleFilterChange}
                              className="input-3d"
                              disabled={loading}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                  </Row>

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
                          <th>Return Bill Number</th>
                          <th>Date</th>
                          <th>Memo Number</th>
                          <th>Collection Boy Name</th>
                          <th>Mobile Number</th>
                          <th>Email</th>
                          <th>Photo</th>
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
                        ) : error ? (
                          <tr>
                            <td colSpan="9" className="text-center text-danger">
                              {error}
                            </td>
                          </tr>
                        ) : filteredBills.length === 0 ? (
                          <tr>
                            <td colSpan="9" className="text-center">
                              No return bills found.
                            </td>
                          </tr>
                        ) : (
                          filteredBills.map((bill, index) => (
                            <tr key={bill?.id || index}>
                              <td>{index + 1}</td>
                              <td>{bill?.return_bill_no || "N/A"}</td>
                              <td>
                                {bill?.date
                                  ? new Date(bill.date).toLocaleString()
                                  : "N/A"}
                              </td>
                              <td>{bill?.memo_no_name || "N/A"}</td>
                              <td>{bill?.collection_boy_name || "N/A"}</td>
                              <td>{bill?.mobile_no || "N/A"}</td>
                              <td>{bill?.email || "N/A"}</td>
                              <td>
                                {bill?.photo ? (
                                  <img
                                    src={`${import.meta.env.VITE_API_BASE_URL}${
                                      bill.photo
                                    }`}
                                    alt="Return Bill"
                                    style={{
                                      width: "60px",
                                      height: "60px",
                                      objectFit: "cover",
                                      borderRadius: "6px",
                                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleViewPhoto(
                                        `${import.meta.env.VITE_API_BASE_URL}${
                                          bill.photo
                                        }`
                                      )
                                    }
                                  />
                                ) : (
                                  "N/A"
                                )}
                              </td>
                              <td>
                                <div className="d-flex gap-2 justify-content-center">
                                 
                                  <FaEdit
                                    style={{
                                      fontSize: "18px",
                                      color: "#4caf50",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleEdit(bill?.id)}
                                    title="Edit"
                                  />
                                  <FaTrash
                                    style={{
                                      fontSize: "18px",
                                      color: "#f44336",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleDelete(bill?.id)}
                                    title="Delete"
                                  />
                                  <FaPlus
                                    style={{
                                      fontSize: "18px",
                                      color: "green",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleAddReturnBillForMemo(bill?.return_bill_no)
                                    }
                                    title="Add Return Bill"
                                  />
                                  <FaPaperPlane
                                    style={{
                                      fontSize: "18px",
                                      color: "#ff9800",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleSendReturnBill(bill)}
                                    title="Send Return Bill"
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

      {/* Photo Modal */}
      <Modal isOpen={photoModalOpen} toggle={togglePhotoModal} centered>
        <div className="modal-3d">
          <ModalHeader toggle={togglePhotoModal} className="modal-header-3d">
            View Photo
          </ModalHeader>
          <ModalBody className="modal-body-3d">
            {selectedPhoto && (
              <img
                src={selectedPhoto}
                alt="Return Bill Photo"
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  objectFit: "contain",
                  borderRadius: "10px",
                }}
              />
            )}
          </ModalBody>
          <ModalFooter className="modal-footer-3d">
            <Button
              color="secondary"
              onClick={togglePhotoModal}
              className="btn-3d"
            >
              Close
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* PDF Preview Modal */}
      <Modal
        isOpen={previewModalOpen}
        toggle={togglePreviewModal}
        size="xl"
        centered
      >
        <div className="modal-3d">
          <ModalHeader toggle={togglePreviewModal} className="modal-header-3d">
            Return Bill Preview
          </ModalHeader>
          <ModalBody className="modal-body-3d">
            {pdfData.original?.url && (
              <iframe
                src={pdfData.original.url}
                style={{ width: "100%", height: "500px", border: "none" }}
                title="Return Bill Preview"
              />
            )}
            <div className="d-flex justify-content-center mt-3">
              <Button
                color="primary"
                onClick={() => downloadPDF("original")}
                className="btn-3d me-2"
                disabled={!pdfData.original?.url}
              >
                Download Original
              </Button>
              <Button
                color="secondary"
                onClick={() => downloadPDF("duplicate")}
                className="btn-3d"
                disabled={!pdfData.duplicate?.url}
              >
                Download Duplicate
              </Button>
            </div>
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

      {/* Email Send Confirmation Modal */}
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
                Are you sure you want to send the return bill to{" "}
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

      {/* Success Modal */}
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
                Return Bill has been emailed to the supplier successfully!
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

export default ReturnBill;
