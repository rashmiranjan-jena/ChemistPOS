import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import {
  FaEye,
  FaEyeSlash,
  FaFilter,
  FaFileExcel,
  FaCheckCircle,
} from "react-icons/fa";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";
import {
  getReturnProduct,
  sendReturnOrderEmail,
} from "../../ApiService/ReturnDrug/ReturnProduct";
import { adminLogin } from "../../ApiService/Purchase/PurchaseRequest";

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[i], shuffled[j]];
  }
  return shuffled;
};

const ExpireProductReturn = () => {
  const navigate = useNavigate();
  const [notificationSent, setNotificationSent] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [emailSendModalOpen, setEmailSendModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({
    loginId: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [supplierEmail, setSupplierEmail] = useState("");
  const [isAddingEmail, setIsAddingEmail] = useState(false);
  const [newSupplierEmail, setNewSupplierEmail] = useState("");
  const [pdfData, setPdfData] = useState({
    supplier: { blob: null, url: null, memoNumber: "" },
    internal: { blob: null, url: null, memoNumber: "" },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [activePdf, setActivePdf] = useState("supplier");
  const [filters, setFilters] = useState({
    type: "",
  });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async (type = "") => {
    try {
      setLoading(true);
      setError(null);
      const params = type && type.trim() !== "" ? { type } : {};
      const response = await getReturnProduct(params);
      const allProducts = response.map((item) => ({
        id: item?.drug_details?.drug_id,
        productName: item?.drug_details?.drug_name,
        batchNo: item?.batch_no,
        expiryDate: item?.expire_date,
        quantity: item?.quantity,
        price: item?.rate,
        supplier: item?.supplier_name,
        supplierEmail: item?.supplier_email,
        supplierId: item?.supplier_id,
        poNumber: item?.Po_id || "N/A",
        invoiceNumber: item?.invoice_no,
        invoiceDate: item?.bill_date,
        purchaseDate: item?.bill_date,
        type: item?.type || "Normal",
      }));

      setProducts(shuffleArray(allProducts));
      setFilteredProducts(shuffleArray(allProducts));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again.");
      setLoading(false);
    }
  };

  // Initial fetch without filters
  React.useEffect(() => {
    fetchProducts();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ type: "" });
    fetchProducts();
    toggleFilterModal();
  };

  const applyFilters = () => {
    const type = filters.type.trim();
    if (type === "") {
      fetchProducts();
    } else {
      fetchProducts(type);
    }
    toggleFilterModal();
  };

  const toggleProductSelection = (batchNo) => {
    setSelectedProducts((prev) =>
      prev.includes(batchNo)
        ? prev.filter((item) => item !== batchNo)
        : [...prev, batchNo]
    );
  };

  const handleBack = () => {
    navigate(-1);
  };

  const toggleModal = () => setModalOpen(!modalOpen);
  const togglePreviewModal = () => setPreviewModalOpen(!previewModalOpen);
  const toggleEmailSendModal = () => setEmailSendModalOpen(!emailSendModalOpen);
  const toggleSuccessModal = () => setSuccessModalOpen(!successModalOpen);
  const toggleFilterModal = () => setFilterModalOpen(!filterModalOpen);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const generatePDF = (products, type) => {
    console.log("Generating PDF with products:", products);
    if (!products || products.length === 0) {
      throw new Error("No products provided for PDF generation");
    }

    const doc = new jsPDF();
    const memoNumber = `RM-${Date.now()}`;
    const memoDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Set document properties
    doc.setProperties({
      title: `Return Memo (${type === "supplier" ? "Original" : "Duplicate"})`,
      author: "Pharmacy Management System",
      creator: "Vichaarlab",
    });

    // Header with Solid Color
    doc.setFillColor(0, 123, 255); // Solid blue
    doc.rect(0, 0, 210, 40, "F");

    // Logo Placeholder
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("[Logo]", 14, 15);

    // Header Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Pharmacy Management System", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Your Trusted Healthcare Partner", 105, 28, { align: "center" });

    // Document Title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Return Memo (${type === "supplier" ? "Original" : "Duplicate"})`,
      105,
      50,
      { align: "center" }
    );

    // Border
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 123, 255);
    doc.roundedRect(10, 45, 190, 235, 5, 5, "S");

    // Memo Information
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.text(`Memo Number: ${memoNumber}`, 14, 60);
    doc.text(`Date: ${memoDate}`, 14, 68);

    // Supplier Information
    const supplier = products[0]?.supplier || "Multiple Suppliers";
    const supplierEmail = products[0]?.supplierEmail || "N/A";
    doc.text(`Supplier: ${supplier}`, 14, 76);
    doc.text(`Email: ${supplierEmail}`, 14, 84);

    // Divider
    doc.setLineWidth(0.2);
    doc.setDrawColor(150, 150, 150);
    doc.line(14, 90, 196, 90);

    // Table Title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 123, 255);
    doc.text("Product Details", 14, 100);

    // Prepare table data
    const tableColumn = [
      "Product Name",
      "Batch",
      "Exp.",
      "Qty",
      "Price",
      "Amt",
      "PO N0.",
      "Inv.",
    ];
    const tableRows = products.map((product) => [
      product.productName || "N/A",
      product.batchNo || "N/A",
      product.expiryDate || "N/A",
      product.quantity || 0,
      product.price ? product.price.toFixed(2) : "0.00",
      product.quantity && product.price
        ? (product.quantity * product.price).toFixed(2)
        : "0.00",
      product.poNumber || "N/A",
      product.invoiceNumber || "N/A",
    ]);

    // Calculate total amount
    const totalAmount = products.reduce(
      (sum, product) =>
        sum +
        (product.quantity && product.price
          ? product.quantity * product.price
          : 0),
      0
    );

    // Generate table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 105,
      styles: {
        font: "helvetica",
        fontSize: 9,
        cellPadding: 4,
        textColor: [50, 50, 50],
        fillColor: [255, 255, 255],
        lineColor: [150, 150, 150],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [0, 123, 255],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 10,
        cellPadding: 5,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { left: 14, right: 14 },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: "bold" }, // Product Name (wider)
        1: { cellWidth: 20 }, // Batch
        2: { cellWidth: 20 }, // Expiry
        3: { cellWidth: 15 }, // Qty
        4: { cellWidth: 20 }, // Price
        5: { cellWidth: 20 }, // Amount
        6: { cellWidth: 20 }, // PO Number
        7: { cellWidth: 20 }, // Invoice
      },
    });

    // Total Amount
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 123, 255);
    doc.text(
      `Total Amount: $${totalAmount.toFixed(2)}`,
      14,
      doc.lastAutoTable.finalY + 15
    );

    // Instructions
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text("Return Instructions:", 14, doc.lastAutoTable.finalY + 25);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
      "Please arrange pickup or replacement within 15 days. Contact us for coordination.",
      14,
      doc.lastAutoTable.finalY + 33,
      { maxWidth: 182 }
    );

    // Footer
    doc.setFillColor(0, 123, 255);
    doc.rect(0, 280, 210, 17, "F");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(
      "Contact: support@vichaarlab.com | Phone: +91 8457045959 | Vichaarlab Pharmacy Solutions",
      105,
      288,
      { align: "center" }
    );

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    return { blob: pdfBlob, url: pdfUrl, memoNumber };
  };

  const handleAdminLogin = async () => {
    try {
      const credentials = {
        identifier: loginForm.loginId,
        password: loginForm.password,
        login_type: "admin",
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

        const selected = products.filter((p) =>
          selectedProducts.includes(p.batchNo)
        );

        if (!selected || selected.length === 0) {
          Swal.fire({
            title: "Error!",
            text: "No products selected for PDF generation.",
            icon: "error",
            confirmButtonText: "OK",
          });
          toggleModal();
          return;
        }

        setSupplierEmail(selected[0]?.supplierEmail || "");
        setIsAddingEmail(!selected[0]?.supplierEmail);

        setLoginError("");
        toggleModal();

        try {
          const supplierPdf = generatePDF(selected, "supplier");
          const internalPdf = generatePDF(selected, "internal");
          setPdfData({
            supplier: supplierPdf,
            internal: internalPdf,
          });
          setPreviewModalOpen(true);
        } catch (pdfError) {
          console.error("PDF generation error:", pdfError);
          Swal.fire({
            title: "Error!",
            text: "Failed to generate PDF. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(error?.error || "Invalid credentials");
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

    if (!pdfData.supplier?.blob) {
      Swal.fire({
        title: "Error!",
        text: "Supplier PDF data not found. Please try again.",
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
        pdfData.supplier.blob,
        `Return_Memo_Original_${pdfData.supplier.memoNumber}.pdf`
      );

      const selectedDrugs = products.filter((p) =>
        selectedProducts.includes(p.batchNo)
      );

      const drugDetails = selectedDrugs.map((drug) => ({
        drug_id: drug?.id,
        drug_name: drug?.productName,
        batch_no: drug?.batchNo,
        expiry_date: drug?.expiryDate,
        quantity: drug?.quantity,
        rate: drug?.price,
        purchase_amount: (drug?.quantity * drug?.price)?.toFixed(2),
        po_number: drug?.poNumber,
        invoice_number: drug?.invoiceNumber,
        invoice_date: drug?.invoiceDate,
        purchase_date: drug?.purchaseDate,
        type: drug?.type,
      }));

      const totalProducts = drugDetails.length;

      const supplierDetails = {
        supplier_id: selectedDrugs[0]?.supplierId,
        supplier_name: selectedDrugs[0]?.supplier,
        supplier_contact: selectedDrugs[0]?.supplierEmail,
      };

      formData.append("drug_details", JSON.stringify(drugDetails));
      formData.append("total_products", totalProducts);
      formData.append("supplier", supplierDetails.supplier_id || "");

      await sendReturnOrderEmail(formData);

      toggleEmailSendModal();
      setSuccessModalOpen(true);
      setNotificationSent(true);
      setTimeout(() => setNotificationSent(false), 3000);
      navigate(`/return-memo`);
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

  const handleDownloadInternalPdf = () => {
    if (pdfData.internal?.blob) {
      const url = pdfData.internal.url;
      const link = document.createElement("a");
      link.href = url;
      link.download = `Return_Memo_Duplicate_${pdfData.internal.memoNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      Swal.fire({
        title: "Error!",
        text: "Internal PDF data not found.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleExcelDownload = () => {
    const headers = [
      "Sr.No",
      "ID",
      "Drug Name",
      "Batch No",
      "Expiry Date",
      "Quantity",
      "Price",
      "Amount",
      "Supplier",
      "PO Number",
      "Invoice Number",
      "Invoice Date",
      "Type",
    ];
    const rows = filteredProducts.map((product, index) => [
      index + 1,
      product.id,
      product.productName,
      product.batchNo,
      product.expiryDate,
      product.quantity,
      product.price?.toFixed(2),
      (product.quantity * product.price)?.toFixed(2),
      product.supplier,
      product.poNumber,
      product.invoiceNumber,
      product.invoiceDate,
      product.type,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "products_status.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Inventory"
            breadcrumbItem="Drug Status Management"
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
                      Drug Status Management
                    </h4>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="warning"
                        onClick={() => {
                          if (selectedProducts.length === 0) {
                            Swal.fire({
                              title: "Error!",
                              text: "Please select at least one product.",
                              icon: "error",
                              confirmButtonText: "OK",
                            });
                            return;
                          }
                          setModalOpen(true);
                        }}
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
                          className="bx bx-mail-send"
                          style={{ fontSize: "18px" }}
                        ></i>
                        Send Notification
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
                        <FaFileExcel style={{ fontSize: "18px" }} />
                        Export Excel
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
                        title="Filter"
                      >
                        <FaFilter style={{ fontSize: "18px" }} />
                        Filter
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

                  {notificationSent && (
                    <div className="alert alert-success" role="alert">
                      Notification sent successfully!
                    </div>
                  )}

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="table-container">
                    {loading ? (
                      <div className="text-center">Loading products...</div>
                    ) : filteredProducts.length === 0 ? (
                      <div className="text-center">
                        No products found for the selected type.
                      </div>
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
                            <th>Select</th>
                            <th>Sr.No</th>
                            <th>Drug Name</th>
                            <th>Batch No</th>
                            <th>PO Number</th>
                            <th>Invoice</th>
                            <th>Expiry Date</th>
                            <th>Quantity</th>
                            <th>Rate (₹)</th>
                            <th>Purchase Amount (₹)</th>
                            <th>Supplier</th>
                            <th>Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map((product, index) => (
                            <tr key={product.batchNo}>
                              <td>
                                <FaCheckCircle
                                  style={{
                                    fontSize: "20px",
                                    color: selectedProducts.includes(
                                      product.batchNo
                                    )
                                      ? "#28a745"
                                      : "#e9ecef",
                                    cursor: "pointer",
                                    transition: "color 0.3s ease",
                                  }}
                                  onClick={() =>
                                    toggleProductSelection(product.batchNo)
                                  }
                                  title={
                                    selectedProducts.includes(product.batchNo)
                                      ? "Selected"
                                      : "Select"
                                  }
                                />
                              </td>
                              <td>{index + 1}</td>
                              <td>{product.productName}</td>
                              <td>{product.batchNo}</td>
                              <td>
                                <Badge color="info" pill>
                                  {product.poNumber}
                                </Badge>
                              </td>
                              <td>
                                <Badge color="primary" pill>
                                  {product.invoiceNumber}
                                </Badge>
                              </td>
                              <td>
                                <Badge
                                  color={
                                    product.type === "Normal"
                                      ? "success"
                                      : product.type === "About to Expire"
                                      ? "warning"
                                      : "danger"
                                  }
                                  pill
                                >
                                  {product.expiryDate}
                                </Badge>
                              </td>
                              <td>{product.quantity}</td>
                              <td>{product.price?.toFixed(2)}</td>
                              <td>
                                {(product.quantity * product.price)?.toFixed(2)}
                              </td>
                              <td>{product.supplier}</td>
                              <td>
                                <Badge
                                  color={
                                    product.type === "Normal"
                                      ? "success"
                                      : product.type === "About to Expire"
                                      ? "warning"
                                      : "danger"
                                  }
                                  pill
                                >
                                  {product.type}
                                </Badge>
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

      {/* Admin Login Modal */}
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
                  value={loginForm.loginId}
                  onChange={handleLoginChange}
                  className="input-3d"
                />
              </FormGroup>
              <FormGroup className="position-relative">
                <Label for="password">Password</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Enter password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  className="input-3d"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "70%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#007bff",
                  }}
                  title={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </FormGroup>
              {loginError && (
                <div className="text-danger mb-3">{loginError}</div>
              )}
            </Form>
          </ModalBody>
          <ModalFooter className="modal-footer-3d">
            <Button color="secondary" onClick={toggleModal} className="btn-3d">
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleAdminLogin}
              className="btn-3d"
            >
              Login & Proceed
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={previewModalOpen}
        toggle={togglePreviewModal}
        size="xl"
        centered
      >
        <div className="modal-3d">
          <ModalHeader toggle={togglePreviewModal} className="modal-header-3d">
            Return Memo Preview
          </ModalHeader>
          <ModalBody className="modal-body-3d">
            <div className="d-flex gap-3 mb-3">
              <Button
                color={activePdf === "supplier" ? "primary" : "secondary"}
                onClick={() => setActivePdf("supplier")}
                className="btn-3d"
              >
                Supplier Memo (Original)
              </Button>
              <Button
                color={activePdf === "internal" ? "primary" : "secondary"}
                onClick={() => setActivePdf("internal")}
                className="btn-3d"
              >
                Internal Memo (Duplicate)
              </Button>
              <Button
                color="success"
                onClick={handleDownloadInternalPdf}
                className="btn-3d"
              >
                Download Duplicate Memo
              </Button>
            </div>
            {pdfData[activePdf]?.url && (
              <iframe
                src={pdfData[activePdf].url}
                style={{ width: "100%", height: "500px", border: "none" }}
                title={`${
                  activePdf === "supplier" ? "Supplier" : "Internal"
                } Memo Preview`}
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
                Are you sure you want to send the return memo to{" "}
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
                Return Memo has been emailed to the supplier successfully!
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

      {/* Filter Modal */}
      <Modal isOpen={filterModalOpen} toggle={toggleFilterModal} centered>
        <div className="modal-3d">
          <ModalHeader toggle={toggleFilterModal} className="modal-header-3d">
            Filter Products
          </ModalHeader>
          <ModalBody className="modal-body-3d">
            <Form>
              <FormGroup>
                <Label for="type">Type</Label>
                <Input
                  type="select"
                  name="type"
                  id="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="input-3d"
                >
                  <option value="">Select Type</option>
                  <option value="expired">Expired</option>
                  <option value="about_to_expire">About to Expire</option>
                  <option value="crossed_return_date">
                    Crossed Return Date
                  </option>
                </Input>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter className="modal-footer-3d">
            <Button color="secondary" onClick={resetFilters} className="btn-3d">
              Reset
            </Button>
            <Button color="primary" onClick={applyFilters} className="btn-3d">
              Apply
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
          max-height: 600px;
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

export default ExpireProductReturn;
